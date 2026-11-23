import { API_BASE } from "../config";
import { ensureGuestSession } from "./api";

const AUTH_BASE = `${API_BASE}/auth`;

async function authRequest(path, options = {}) {
  const response = await fetch(`${AUTH_BASE}${path}`, {
    credentials: "include",
    cache: "no-store",
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const raw = await response.text();

  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { error: raw };
  }

  if (!response.ok) {
    throw new Error(
      data.error || data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

export async function getCurrentUser() {
  return authRequest("/me");
}

export async function registerAccount({ name, email, password }) {
  // Establish the guest identity first so existing guest conversations
  // can be associated with the new account.
  await ensureGuestSession();

  return authRequest("/register", {
    method: "POST",
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }),
  });
}

export async function loginAccount({ email, password }) {
  await ensureGuestSession();

  return authRequest("/login", {
    method: "POST",
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });
}

export async function logoutAccount() {
  return authRequest("/logout", {
    method: "POST",
  });
}