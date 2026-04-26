// src/pages/AboutPage.jsx
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 48 }}>
          About Project
        </p>
        <p>
          ThinkGPT draws its pulse from the{" "}
          <span className="highlight">speed of thought</span> — intelligence in motion,
          clarity in flow.{" "}
          <span className="dim">
            We wanted a tool that feels less like software and more like
            an extension of your own mind. The result feels less like a
            chatbot, and more like a conversation with someone who
            actually keeps up.
          </span>
        </p>
      </div>

      <div className="about-grid">
        <div className="about-block">
          <h3>Our Mission</h3>
          <p>
            ThinkGPT exists to close the gap between human intent and machine
            capability. We believe AI should be fast enough to not interrupt
            your flow, smart enough to surprise you, and honest enough to
            admit when it doesn't know.
          </p>
        </div>
        <div className="about-block" style={{ background: "var(--space-mid)" }}>
          <h3>The Technology</h3>
          <p>
            We run exclusively on Groq's LPU inference engine — the fastest
            AI inference hardware on the planet. Paired with the world's best
            open models, the result is a thinking partner that keeps pace with
            your fastest ideas.
          </p>
        </div>
        <div className="about-block" style={{ background: "var(--space-mid)" }}>
          <h3>Why Multiple Models?</h3>
          <p>
            Different problems call for different strengths. A creative brief
            might want Qwen 3's nuance. A coding question might want
            Llama 4's precision. ThinkGPT puts the choice in your hands —
            or makes it for you automatically.
          </p>
        </div>
        <div className="about-block">
          <h3>What's Next</h3>
          <p>
            We're building Ensemble Mode — a feature that queries multiple
            models simultaneously and synthesizes the best answer from all
            of them. Because sometimes one intelligence isn't enough.
          </p>
        </div>
      </div>

      <section style={{ padding: "80px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 24 }}>
          Ready to think differently?
        </h2>
        <Link to="/chat">
          <button className="btn-primary btn-large">Open ThinkGPT →</button>
        </Link>
      </section>

      <footer className="site-footer">
        <div className="footer-logo">ThinkGPT</div>
        <ul className="footer-links">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
        <p className="footer-copy">© 2026 ThinkGPT. All rights reserved.</p>
      </footer>
    </div>
  );
}