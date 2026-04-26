// src/pages/HomePage.jsx
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "⚡", title: "Blazing Fast", desc: "Powered by Groq's LPU inference engine — responses in milliseconds, not seconds." },
  { icon: "🧠", title: "Multiple Models", desc: "Switch between Llama 4, Qwen 3, and Llama 3.3 70B to match your task perfectly." },
  { icon: "🌊", title: "Real-time Streaming", desc: "Watch responses generate token by token. No waiting, no staring at a spinner." },
  { icon: "🔒", title: "Secure by Default", desc: "Your conversations stay private. We don't train on your data." },
  { icon: "🤖", title: "Ensemble Mode", desc: "Combine multiple models for a single, higher-quality synthesized response." },
  { icon: "🎯", title: "Context Memory", desc: "ThinkGPT remembers your conversation thread so you never lose context mid-thought." },
];

const SUGGESTIONS = [
  "Explain quantum entanglement simply",
  "Write me a React component",
  "Debug my Python code",
  "Plan a week of healthy meals",
];

export default function HomePage() {
  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Now with Llama 4 Scout — Latest Meta AI
        </div>

        <h1>
          Think <span className="gradient-text">Beyond</span>
          <br />the Ordinary
        </h1>

        <p className="hero-sub">
          ThinkGPT is your AI thinking partner — powered by the world's fastest
          inference engine and the most capable open models.
        </p>

        <div className="hero-actions">
          <Link to="/chat">
            <button className="btn-primary btn-large">Start Thinking →</button>
          </Link>
          <Link to="/features">
            <button className="btn-ghost btn-large">See Features</button>
          </Link>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          Scroll to explore
        </div>
      </section>

      {/* ── MODELS BAR ── */}
      <div className="models-bar">
        <p className="models-bar-label">Powered by</p>
        <div className="models-chips">
          {["Llama 3.1 8B — Fast", "Llama 3.3 70B — Powerful", "Qwen 3 32B — Alibaba", "Llama 4 Scout — Latest", "Groq LPU Inference"].map(m => (
            <div key={m} className="model-chip">{m}</div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section">
        <p className="section-label">What we offer</p>
        <h2 className="section-title">
          Built for people who <span className="accent">actually think</span>
        </h2>
        <p className="section-sub">
          Not another wrapper. ThinkGPT is purpose-built for depth, speed, and clarity.
        </p>

        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "0 48px 100px" }}>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-num">4</div>
            <div className="stat-label">AI Models Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">&lt;1s</div>
            <div className="stat-label">Average Response Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">∞</div>
            <div className="stat-label">Conversations Possible</div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <p className="section-label text-center">Get started today</p>
        <h2>
          Your ideas deserve<br />
          <span className="gradient-text glow-text">a smarter partner</span>
        </h2>
        <p style={{ color: "var(--off-white)", marginBottom: 40, fontSize: "1.05rem" }}>
          Free to start. No credit card required.
        </p>
        <Link to="/get-started">
          <button className="btn-primary btn-large">Create Free Account</button>
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="site-footer">
        <div className="footer-logo">ThinkGPT</div>
        <ul className="footer-links">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><a href="#">Privacy</a></li>
        </ul>
        <p className="footer-copy">© 2026 ThinkGPT. All rights reserved.</p>
      </footer>
    </div>
  );
}