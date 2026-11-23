// // src/pages/FeaturesPage.jsx
// import { Link } from "react-router-dom";

// const FEATURES_DETAIL = [
//   { icon: "⚡", title: "Groq LPU Speed",       desc: "We use Groq's Language Processing Unit for inference that's 10–20x faster than GPU-based competitors. Your thoughts shouldn't wait." },
//   { icon: "🔀", title: "Model Switching",       desc: "Switch between Llama 3.1 8B, Llama 3.3 70B, Qwen 3 32B, and Llama 4 Scout mid-conversation. Right model, right moment." },
//   { icon: "🌊", title: "Streaming Responses",   desc: "Every model streams token by token. You read as it thinks — no loading spinners, no blank screens." },
//   { icon: "🧩", title: "Ensemble Mode (Beta)", desc: "Send your prompt to multiple models simultaneously. ThinkGPT synthesizes all responses into one definitive answer." },
//   { icon: "💾", title: "Conversation History", desc: "Your chats are saved to MongoDB so you can pick up any thread at any time. Your context, preserved." },
//   { icon: "🔐", title: "Private by Design",    desc: "Your data is yours. We don't use conversations for training. Ever." },
// ];

// const PRICING = [
//   {
//     name: "Starter",
//     desc: "Your AI sidekick for personal use. Effortless, fast, zero friction.",
//     price: "0",
//     period: "Free forever",
//     features: ["Llama 3.1 8B access", "100 messages / day", "Conversation history (7 days)", "Standard streaming speed"],
//     cta: "Get Started",
//     ctaLink: "/get-started",
//   },
//   {
//     name: "Pro",
//     desc: "Full power for power users. Every model, no limits.",
//     price: "19",
//     period: "per month",
//     popular: true,
//     features: ["All 4 models", "Unlimited messages", "Full conversation history", "Ensemble Mode", "Priority inference"],
//     cta: "Start Free Trial",
//     ctaLink: "/get-started",
//   },
//   {
//     name: "Enterprise",
//     desc: "Confidence at scale. AI that aligns your entire team.",
//     price: "79",
//     period: "per month",
//     features: ["Everything in Pro", "Unlimited seats", "Custom system prompts", "API access", "Dedicated support"],
//     cta: "Contact Us",
//     ctaLink: "/about",
//   },
// ];

// export default function FeaturesPage() {
//   return (
//     <div className="features-page">
//       {/* Hero */}
//       <section className="features-hero">
//         <p className="section-label">What's inside</p>
//         <h1 className="section-title" style={{ fontSize: "clamp(2.5rem,5vw,4rem)", margin: "0 auto 16px" }}>
//           Every feature you need,<br />
//           <span className="accent">nothing you don't</span>
//         </h1>
//         <p style={{ color: "var(--off-white)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7, fontSize: "1.05rem" }}>
//           We obsess over speed, clarity, and reliability so you can obsess over
//           whatever actually matters to you.
//         </p>
//       </section>

//       {/* Features grid */}
//       <section className="section" style={{ paddingTop: 0 }}>
//         <div className="features-grid">
//           {FEATURES_DETAIL.map(f => (
//             <div key={f.title} className="feature-card">
//               <div className="feature-icon">{f.icon}</div>
//               <h3>{f.title}</h3>
//               <p>{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Pricing */}
//       <section className="pricing-section">
//         <div style={{ textAlign: "center", marginBottom: 56 }}>
//           <p className="section-label">Pricing</p>
//           <h2 className="section-title" style={{ margin: "0 auto 12px" }}>
//             Simple, honest pricing
//           </h2>
//           <p style={{ color: "var(--off-white)", fontSize: "1rem" }}>
//             Start free. Scale when you're ready.
//           </p>
//         </div>

//         <div className="pricing-grid">
//           {PRICING.map(p => (
//             <div key={p.name} className={`pricing-card ${p.popular ? "popular" : ""}`}>
//               {p.popular && <div className="popular-badge">⭐ Most Popular</div>}
//               <h3>{p.name}</h3>
//               <p className="pricing-desc">{p.desc}</p>
//               <div className="pricing-price">
//                 <sup>$</sup>{p.price}
//               </div>
//               <p className="pricing-period">{p.period}</p>
//               <Link to={p.ctaLink}>
//                 <button className={`btn-full ${p.popular ? "btn-primary" : "btn-ghost"}`}>
//                   {p.cta}
//                 </button>
//               </Link>
//               <ul className="pricing-features">
//                 {p.features.map(feat => (
//                   <li key={feat}>
//                     <span className="check">✓</span>
//                     <span dangerouslySetInnerHTML={{ __html: feat.replace(/^(Unlimited|All|Everything|Full|Custom|Dedicated)/, '<strong>$1</strong>') }} />
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="cta-section">
//         <h2>Got questions?<br /><span className="gradient-text">We've got answers.</span></h2>
//         <p style={{ color: "var(--off-white)", marginBottom: 36, fontSize: "1rem" }}>
//           Everything from model selection to data privacy — we're transparent about all of it.
//         </p>
//         <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
//           <Link to="/get-started"><button className="btn-primary btn-large">Start for Free</button></Link>
//           <Link to="/about"><button className="btn-ghost btn-large">Learn More</button></Link>
//         </div>
//       </section>

//       <footer className="site-footer">
//         <div className="footer-logo">ThinkGPT</div>
//         <ul className="footer-links">
//           <li><Link to="/features">Features</Link></li>
//           <li><Link to="/about">About</Link></li>
//           <li><Link to="/login">Login</Link></li>
//         </ul>
//         <p className="footer-copy">© 2026 ThinkGPT. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }



import { Link } from "react-router-dom";

// Minimal SVG icons — no emoji characters or external icon packages.
const ICONS = {
  speed: (
    <path d="M13 2 3 14h7l-1 8 12-12h-7z" />
  ),

  switching: (
    <>
      <path d="M4 7h16l-4-4" />
      <path d="m20 7-4 4" />
      <path d="M20 17H4l4 4" />
      <path d="m4 17 4-4" />
    </>
  ),

  streaming: (
    <path d="M2 12h3l3-8 4 16 4-12 2 4h4" />
  ),

  ensemble: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="m7 7 3 3m7-3-3 3m-7 7 3-3m7 3-3-3" />
    </>
  ),

  history: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),

  privacy: (
    <>
      <rect x="3" y="10" width="18" height="11" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
      <circle cx="12" cy="15" r="1" />
      <path d="M12 16v2" />
    </>
  ),
};

function FeatureIcon({ name }) {
  return (
    <div className="feature-icon">
      <svg
        width="23"
        height="23"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICONS[name]}
      </svg>
    </div>
  );
}

const FEATURES_DETAIL = [
  {
    icon: "speed",
    title: "Groq LPU Speed",
    desc: "We use Groq's Language Processing Unit for inference that's 10–20x faster than GPU-based competitors. Your thoughts shouldn't wait.",
  },
  {
    icon: "switching",
    title: "Model Switching",
    desc: "Switch between multiple AI models, including GPT-OSS 20B, GPT-OSS 120B, Gemma 4 and GLM 4.7 Flash. Right model, right moment.",
  },
  {
    icon: "streaming",
    title: "Streaming Responses",
    desc: "Every model streams token by token. You read as it thinks — no loading spinners, no blank screens.",
  },
  {
    icon: "ensemble",
    title: "Ensemble Mode",
    desc: "Send your prompt to four AI models simultaneously. ThinkGPT compares their responses and synthesizes them into one final answer.",
  },
  {
    icon: "history",
    title: "Conversation History",
    desc: "Your conversations are saved to MongoDB, allowing you to revisit previous chats and continue where you left off.",
  },
  {
    icon: "privacy",
    title: "Private by Design",
    desc: "Your conversations are associated with your account and protected through session-based authentication.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="features-page">

      {/* HERO */}
      <section className="features-hero">
        <p className="section-label">
          What's inside
        </p>

        <h1
          className="section-title"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            margin: "0 auto 16px",
          }}
        >
          Every feature you need,
          <br />
          <span className="accent">
            nothing you don't
          </span>
        </h1>

        <p
          style={{
            color: "var(--off-white)",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.7,
            fontSize: "1.05rem",
          }}
        >
          We obsess over speed, clarity, and reliability
          so you can obsess over whatever actually
          matters to you.
        </p>
      </section>

      {/* FEATURES GRID */}
      <section
        className="section"
        style={{ paddingTop: 0 }}
      >
        <div className="features-grid">
          {FEATURES_DETAIL.map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
            >
              <FeatureIcon name={feature.icon} />

              <h3>{feature.title}</h3>

              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta-section">
        <h2>
          Got questions?
          <br />
          <span className="gradient-text">
            We've got answers.
          </span>
        </h2>

        <p
          style={{
            color: "var(--off-white)",
            marginBottom: 36,
            fontSize: "1rem",
          }}
        >
          Everything from model selection to data privacy —
          we're transparent about how ThinkGPT works.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/get-started">
            <button className="btn-primary btn-large">
              Start for Free
            </button>
          </Link>

          <Link to="/about">
            <button className="btn-ghost btn-large">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-logo">
          ThinkGPT
        </div>

        <ul className="footer-links">
          <li>
            <Link to="/features">Features</Link>
          </li>

          <li>
            <Link to="/about">About</Link>
          </li>

          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>

        <p className="footer-copy">
          © 2026 ThinkGPT. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
