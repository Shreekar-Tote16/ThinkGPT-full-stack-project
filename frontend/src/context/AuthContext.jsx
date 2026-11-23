import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  registerAccount,
  loginAccount,
  logoutAccount,
} from "../services/auth";

import { ensureGuestSession } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const result = await getCurrentUser();

    const currentUser =
      result?.authenticated && result?.user
        ? result.user
        : null;

    setUser(currentUser);
    return currentUser;
  }, []);

  // Restore the existing login session when the app opens or refreshes.
  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      try {
        await ensureGuestSession();

        const result = await getCurrentUser();

        if (mounted) {
          setUser(
            result?.authenticated && result?.user
              ? result.user
              : null
          );
        }
      } catch (error) {
        console.error("Could not restore authentication:", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const register = useCallback(async (formData) => {
    await registerAccount(formData);

    const currentUser = await refreshUser();

    if (!currentUser) {
      throw new Error(
        "Account created, but the login session could not be established. Please sign in."
      );
    }

    return currentUser;
  }, [refreshUser]);

  const login = useCallback(async (formData) => {
    await loginAccount(formData);

    const currentUser = await refreshUser();

    if (!currentUser) {
      throw new Error("Login succeeded, but your session could not be restored.");
    }

    return currentUser;
  }, [refreshUser]);

  const logout = useCallback(async () => {
    await logoutAccount();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      register,
      login,
      logout,
      refreshUser,
    }),
    [user, authLoading, register, login, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}