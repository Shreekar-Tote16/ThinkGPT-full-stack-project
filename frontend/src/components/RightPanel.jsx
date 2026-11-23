// import { useEffect, useRef, useState } from "react";
// import { getSessionMessages, getSessions } from "../services/api";

// const MODEL_INFO = {
//   auto: {
//     name: "Auto Routing",
//     provider: "Groq + Cloudflare Workers AI",
//     speed: "Intent-based selection",
//     badge: "⚡",
//     size: "Adaptive",
//     mode: "Automatic",
//   },
//   "groq-fast": {
//     name: "GPT-OSS 20B",
//     provider: "Groq Cloud",
//     speed: "Fast",
//     badge: "⚡",
//     size: "20B",
//     mode: "Manual",
//   },
//   "groq-large": {
//     name: "GPT-OSS 120B",
//     provider: "Groq Cloud",
//     speed: "Advanced reasoning",
//     badge: "🧠",
//     size: "120B",
//     mode: "Manual",
//   },
//   "cloudflare-gemma": {
//     name: "Gemma 4 26B A4B",
//     provider: "Cloudflare Workers AI",
//     speed: "General reasoning",
//     badge: "💎",
//     size: "26B A4B",
//     mode: "Manual",
//   },
//   "cloudflare-glm": {
//     name: "GLM 4.7 Flash",
//     provider: "Cloudflare Workers AI",
//     speed: "Fast reasoning",
//     badge: "✨",
//     size: "Flash",
//     mode: "Manual",
//   },
//   ensemble: {
//     name: "Ensemble Mode",
//     provider: "Groq + Cloudflare Workers AI",
//     speed: "Four concurrent models",
//     badge: "✦",
//     size: "4 models",
//     mode: "Ensemble",
//   },
// };

// const QUICK_PROMPTS = [
//   {
//     icon: "⚡",
//     label: "Explain a concept",
//     prompt: "Explain the concept of ",
//   },
//   {
//     icon: "🐛",
//     label: "Debug my code",
//     prompt: "Help me debug this code:\n\n",
//   },
//   {
//     icon: "✍️",
//     label: "Write a function",
//     prompt: "Write a function that ",
//   },
//   {
//     icon: "📋",
//     label: "Summarize this",
//     prompt: "Summarize the following:\n\n",
//   },
// ];

// const FALLBACK_MODEL_INFO = {
//   name: "GPT-OSS 20B",
//   provider: "Groq Cloud",
//   speed: "Fast",
//   badge: "⚡",
//   size: "20B",
//   mode: "Manual",
// };

// function countWords(messages) {
//   return messages
//     .filter((message) => message.role === "assistant")
//     .reduce((total, message) => {
//       const content =
//         typeof message.content === "string" ? message.content.trim() : "";
//       return total + (content ? content.split(/\s+/).length : 0);
//     }, 0);
// }

// export default function RightPanel({
//   messages = [],
//   model = "groq-fast",
//   onQuickPrompt,
//   onSuggestionClick,
//   onLoadSession,
//   refreshTrigger = 0,
// }) {
//   const [tab, setTab] = useState("history");
//   const [sessions, setSessions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const [loadingSessionId, setLoadingSessionId] = useState(null);

//   const sessionRequestRef = useRef(0);
//   const promptHandler = onQuickPrompt || onSuggestionClick;
//   const info = MODEL_INFO[model] || FALLBACK_MODEL_INFO;

//   const userMessageCount = messages.filter(
//     (message) => message.role === "user"
//   ).length;
//   const assistantWordCount = countWords(messages);

//   // Refresh the guest's saved conversations when the parent reports a save.
//   // The active flag prevents an older request from updating an unmounted panel.
//   useEffect(() => {
//     let active = true;

//     const fetchSessions = async () => {
//       setLoading(true);
//       setLoadError("");

//       try {
//         const result = await getSessions();
//         if (active) {
//           setSessions(Array.isArray(result) ? result : []);
//         }
//       } catch (error) {
//         if (active) {
//           setLoadError(
//             error.message || "Could not load conversation history."
//           );
//           setSessions([]);
//         }
//       } finally {
//         if (active) {
//           setLoading(false);
//         }
//       }
//     };

//     void fetchSessions();

//     return () => {
//       active = false;
//     };
//   }, [refreshTrigger]);

//   // Open a saved conversation. Only the most recently clicked session may load.
//   const handleSessionClick = async (sessionId) => {
//     const requestId = ++sessionRequestRef.current;
//     setLoadingSessionId(sessionId);
//     setLoadError("");

//     try {
//       const sessionMessages = await getSessionMessages(sessionId);

//       if (requestId !== sessionRequestRef.current) return;

//       if (!Array.isArray(sessionMessages)) {
//         throw new Error("The server returned an invalid conversation.");
//       }

//       onLoadSession?.(sessionId, sessionMessages);
//     } catch (error) {
//       if (requestId === sessionRequestRef.current) {
//         setLoadError(
//           error.message || "Could not open this conversation."
//         );
//       }
//     } finally {
//       if (requestId === sessionRequestRef.current) {
//         setLoadingSessionId(null);
//       }
//     }
//   };

//   const handleSessionKeyDown = (event, sessionId) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       void handleSessionClick(sessionId);
//     }
//   };

//   const handleQuickPrompt = (prompt) => {
//     promptHandler?.(prompt);
//   };

//   return (
//     <aside className="right-panel">
//       {/* History / Session tabs */}
//       <div className="rp-tabs" role="tablist" aria-label="Chat sidebar">
//         <button
//           className={`rp-tab ${tab === "history" ? "active" : ""}`}
//           onClick={() => setTab("history")}
//           type="button"
//           role="tab"
//           aria-selected={tab === "history"}
//         >
//           History
//         </button>
//         <button
//           className={`rp-tab ${tab === "info" ? "active" : ""}`}
//           onClick={() => setTab("info")}
//           type="button"
//           role="tab"
//           aria-selected={tab === "info"}
//         >
//           Session
//         </button>
//       </div>

//       {/* History tab */}
//       {tab === "history" && (
//         <div className="rp-content" role="tabpanel">
//           <p className="rp-section-label">Recent chats</p>

//           <div
//             className="rp-history-list"
//             aria-label="Recent conversations"
//             aria-live="polite"
//           >
//             {loading ? (
//               <div className="rp-history-loading">
//                 Loading conversations…
//               </div>
//             ) : sessions.length === 0 ? (
//               <div className="rp-history-empty">
//                 {loadError || "No conversations yet"}
//               </div>
//             ) : (
//               sessions.map((session) => (
//                 <div
//                   key={session.id}
//                   className="rp-history-item"
//                   role="button"
//                   tabIndex={0}
//                   title={session.title || "New conversation"}
//                   aria-busy={loadingSessionId === session.id}
//                   onClick={() => void handleSessionClick(session.id)}
//                   onKeyDown={(event) =>
//                     handleSessionKeyDown(event, session.id)
//                   }
//                 >
//                   <div className="rp-history-icon">
//                     {loadingSessionId === session.id ? "◌" : "💬"}
//                   </div>
//                   <div className="rp-history-body">
//                     <p className="rp-history-title">
//                       {session.title || "New conversation"}
//                     </p>
//                     <p className="rp-history-preview">
//                       {session.preview || "No preview available"}
//                     </p>
//                   </div>
//                   <span className="rp-history-time">
//                     {session.time || ""}
//                   </span>
//                 </div>
//               ))
//             )}
//           </div>

//           {loadError && sessions.length > 0 && (
//             <div className="rp-history-empty" role="alert">
//               {loadError}
//             </div>
//           )}

//           <p className="rp-section-label" style={{ marginTop: 24 }}>
//             Quick prompts
//           </p>
//           <div className="rp-quick-prompts">
//             {QUICK_PROMPTS.map((prompt) => (
//               <button
//                 key={prompt.label}
//                 className="rp-quick-btn"
//                 onClick={() => handleQuickPrompt(prompt.prompt)}
//                 type="button"
//               >
//                 <span>{prompt.icon}</span>
//                 {prompt.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Session / active model tab */}
//       {tab === "info" && (
//         <div className="rp-content" role="tabpanel">
//           <p className="rp-section-label">Active model</p>

//           <div className="rp-model-card">
//             <div className="rp-model-badge">{info.badge || "✦"}</div>
//             <div>
//               <p className="rp-model-name">{info.name || "AI model"}</p>
//               <p className="rp-model-meta">
//                 {info.provider || "Provider unavailable"}
//                 {info.speed ? ` · ${info.speed}` : ""}
//               </p>
//             </div>
//           </div>

//           <div className="rp-stats-grid">
//             <div className="rp-stat">
//               <span className="rp-stat-num">{info.size || "—"}</span>
//               <span className="rp-stat-label">Model size / routing</span>
//             </div>
//             <div className="rp-stat">
//               <span className="rp-stat-num">{info.mode || "—"}</span>
//               <span className="rp-stat-label">Selection mode</span>
//             </div>
//             <div className="rp-stat">
//               <span className="rp-stat-num">{userMessageCount}</span>
//               <span className="rp-stat-label">User messages in this session</span>
//             </div>
//             <div className="rp-stat">
//               <span className="rp-stat-num">{assistantWordCount}</span>
//               <span className="rp-stat-label">Assistant words in this session</span>
//             </div>
//           </div>

//           <p className="rp-section-label" style={{ marginTop: 24 }}>
//             Tips
//           </p>
//           <div className="rp-tips">
//             <div className="rp-tip">
//               <span className="rp-tip-icon">💡</span>
//               <p>
//                 Use <strong>Shift+Enter</strong> to add a new line without
//                 sending.
//               </p>
//             </div>
//             <div className="rp-tip">
//               <span className="rp-tip-icon">🔀</span>
//               <p>
//                 Switch models between messages to compare different approaches.
//               </p>
//             </div>
//             <div className="rp-tip">
//               <span className="rp-tip-icon">🧠</span>
//               <p>
//                 Ensemble Mode compares GPT-OSS 20B, GPT-OSS 120B, Gemma 4 and
//                 GLM 4.7 Flash, then uses GPT-OSS 120B to synthesize the final
//                 answer.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </aside>
//   );
// }

const MODEL_INFO = {
  auto: {
    name: "Auto Routing",
    provider: "Groq + Cloudflare Workers AI",
    speed: "Intent-based selection",
    badge: "⚡",
    size: "Adaptive",
    mode: "Automatic",
  },

  "groq-fast": {
    name: "GPT-OSS 20B",
    provider: "Groq Cloud",
    speed: "Fast",
    badge: "⚡",
    size: "20B",
    mode: "Manual",
  },

  "groq-large": {
    name: "GPT-OSS 120B",
    provider: "Groq Cloud",
    speed: "Advanced reasoning",
    badge: "🧠",
    size: "120B",
    mode: "Manual",
  },

  "cloudflare-gemma": {
    name: "Gemma 4 26B A4B",
    provider: "Cloudflare Workers AI",
    speed: "General reasoning",
    badge: "💎",
    size: "26B A4B",
    mode: "Manual",
  },

  "cloudflare-glm": {
    name: "GLM 4.7 Flash",
    provider: "Cloudflare Workers AI",
    speed: "Fast reasoning",
    badge: "✨",
    size: "Flash",
    mode: "Manual",
  },

  ensemble: {
    name: "Ensemble Mode",
    provider: "Groq + Cloudflare Workers AI",
    speed: "Four concurrent models",
    badge: "✦",
    size: "4 models",
    mode: "Ensemble",
  },
};

const QUICK_PROMPTS = [
  {
    icon: "⚡",
    label: "Explain a concept",
    prompt: "Explain the concept of ",
  },
  {
    icon: "🐛",
    label: "Debug my code",
    prompt: "Help me debug this code:\n\n",
  },
  {
    icon: "✍️",
    label: "Write a function",
    prompt: "Write a function that ",
  },
  {
    icon: "📋",
    label: "Summarize this",
    prompt: "Summarize the following:\n\n",
  },
];

const FALLBACK_MODEL_INFO = {
  name: "GPT-OSS 20B",
  provider: "Groq Cloud",
  speed: "Fast",
  badge: "⚡",
  size: "20B",
  mode: "Manual",
};

function countWords(messages) {
  if (!Array.isArray(messages)) return 0;

  return messages
    .filter((message) => message.role === "assistant")
    .reduce((total, message) => {
      const content =
        typeof message.content === "string"
          ? message.content.trim()
          : "";

      return total + (content ? content.split(/\s+/).length : 0);
    }, 0);
}

export default function RightPanel({
  messages = [],
  model = "groq-fast",
  onQuickPrompt,
  onSuggestionClick,
}) {
  const promptHandler = onQuickPrompt || onSuggestionClick;

  const info = MODEL_INFO[model] || FALLBACK_MODEL_INFO;

  const userMessageCount = messages.filter(
    (message) => message.role === "user"
  ).length;

  const assistantWordCount = countWords(messages);

  return (
    <aside className="right-panel">

      {/* ── SESSION HEADER ── */}
      <div className="rp-tabs">
        <div className="rp-tab active">
          Session Overview
        </div>
      </div>

      <div className="rp-content">

        {/* ── ACTIVE MODEL ── */}
        <p className="rp-section-label">
          Active model
        </p>

        <div className="rp-model-card">
          <div className="rp-model-badge">
            {info.badge || "✦"}
          </div>

          <div>
            <p className="rp-model-name">
              {info.name || "AI model"}
            </p>

            <p className="rp-model-meta">
              {info.provider || "Provider unavailable"}
              {info.speed ? ` · ${info.speed}` : ""}
            </p>
          </div>
        </div>

        {/* ── SESSION STATISTICS ── */}
        <p className="rp-section-label">
          Session statistics
        </p>

        <div className="rp-stats-grid">

          <div className="rp-stat">
            <span className="rp-stat-num">
              {info.size || "—"}
            </span>

            <span className="rp-stat-label">
              Model size / routing
            </span>
          </div>

          <div className="rp-stat">
            <span className="rp-stat-num">
              {info.mode || "—"}
            </span>

            <span className="rp-stat-label">
              Selection mode
            </span>
          </div>

          <div className="rp-stat">
            <span className="rp-stat-num">
              {userMessageCount}
            </span>

            <span className="rp-stat-label">
              User messages
            </span>
          </div>

          <div className="rp-stat">
            <span className="rp-stat-num">
              {assistantWordCount}
            </span>

            <span className="rp-stat-label">
              Assistant words
            </span>
          </div>

        </div>

        {/* ── QUICK PROMPTS ── */}
        <p
          className="rp-section-label"
          style={{ marginTop: 24 }}
        >
          Quick prompts
        </p>

        <div className="rp-quick-prompts">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              className="rp-quick-btn"
              onClick={() => promptHandler?.(prompt.prompt)}
              type="button"
            >
              <span>{prompt.icon}</span>
              {prompt.label}
            </button>
          ))}
        </div>

        {/* ── TIPS ── */}
        <p
          className="rp-section-label"
          style={{ marginTop: 24 }}
        >
          Tips
        </p>

        <div className="rp-tips">

          <div className="rp-tip">
            <span className="rp-tip-icon">💡</span>

            <p>
              Use <strong>Shift+Enter</strong> to add a new
              line without sending.
            </p>
          </div>

          <div className="rp-tip">
            <span className="rp-tip-icon">🔀</span>

            <p>
              Switch models between messages to compare
              different approaches.
            </p>
          </div>

          <div className="rp-tip">
            <span className="rp-tip-icon">🧠</span>

            <p>
              Ensemble Mode compares GPT-OSS 20B,
              GPT-OSS 120B, Gemma 4 and GLM 4.7 Flash,
              then uses GPT-OSS 120B to synthesize
              the final answer.
            </p>
          </div>

        </div>

      </div>
    </aside>
  );
}