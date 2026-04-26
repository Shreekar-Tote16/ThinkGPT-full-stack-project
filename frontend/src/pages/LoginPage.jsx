// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ signup = false }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (signup && !name.trim()) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      if (signup) {
        // Handle signup - store user data
        const userData = {
          name: name.trim(),
          email: email.trim(),
          password: password, // In production, this should be hashed
          createdAt: new Date().toISOString()
        };
        
        // Store in localStorage (for demo purposes)
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('User signed up:', userData);
        navigate("/chat");
      } else {
        // Handle login - check credentials
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.email === email.trim() && user.password === password) {
            localStorage.setItem('isLoggedIn', 'true');
            console.log('User logged in:', user);
            navigate("/chat");
          } else {
            setError("Invalid email or password");
          }
        } else {
          setError("No account found with this email. Please sign up first.");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/" className="login-logo">
          <div className="logo-icon" style={{
            width: 30, height: 30,
            background: "linear-gradient(135deg, #4D30FF, #CB6FF2)",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.75rem", fontWeight: 900, color: "#fff"
          }}>T</div>
          ThinkGPT
        </Link>

        <h2>{signup ? "Create your account" : "Welcome back"}</h2>
        <p className="sub">
          {signup
            ? "Start thinking with AI — free forever."
            : "Sign in to continue your conversations."}
        </p>

        <form onSubmit={handleSubmit}>
          {signup && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {!signup && (
            <div style={{ textAlign: "right", marginTop: -12, marginBottom: 20 }}>
              <a href="#" style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                Forgot password?
              </a>
            </div>
          )}

          {error && (
            <div style={{ 
              padding: "12px", 
              backgroundColor: "#fee", 
              border: "1px solid #fcc", 
              borderRadius: "6px", 
              marginBottom: "16px",
              color: "#c33",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary btn-full" 
            style={{ marginTop: 8 }}
            disabled={loading}
          >
            {loading ? (signup ? "Creating Account..." : "Signing In...") : (signup ? "Create Account →" : "Sign In →")}
          </button>
        </form>

        <div className="divider">or</div>

        <button
          className="btn-ghost btn-full"
          onClick={() => navigate("/chat")}
          style={{ justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}
        >
          Continue without account
        </button>

        <p className="form-footer" style={{ marginTop: 24 }}>
          {signup ? (
            <>Already have an account? <Link to="/login">Sign in</Link></>
          ) : (
            <>Don't have an account? <Link to="/get-started">Sign up free</Link></>
          )}
        </p>
      </div>
    </div>
  );
}