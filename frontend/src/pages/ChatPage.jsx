// // //C:\Users\user\ThinkGPT\frontend\src\pages\ChatPage.jsx
// // import { useRef } from "react";
// // import { Link } from "react-router-dom";

// // import MessageList from "../components/MessageList";
// // import ChatInput from "../components/ChatInput";
// // import RightPanel from "../components/RightPanel";
// // import EnsembleChat from "../components/EnsembleChat";

// // import { useChatStream } from "../hooks/useChatStream";

// // const MODEL_LABELS = {
// //   "auto": "Auto — GPT-OSS 20B",
// //   "groq-fast": "GPT-OSS 20B — Fast",
// //   "groq-large": "GPT-OSS 120B — Advanced Reasoning",
// //   "groq-qwen": "Qwen 3.8 27B — Preview",
// //   "ensemble": "✦ Ensemble — All 3 Models",
// // };

// // const SIDEBAR_HISTORY = [
// //   "Explain quantum entanglement",
// //   "Write a React component",
// //   "Debug my Python script",
// //   "Plan a healthy weekly menu",
// //   "Summarize climate report",
// // ];

// // export default function ChatPage() {
// //   const {
// //     messages,
// //     model,
// //     setModel,
// //     sessionId,
// //     loading,
// //     sessionsVersion,
// //     sendMessage,
// //     stopStreaming,
// //     loadSession,
// //     newChat,
// //   } = useChatStream();

// //   const chatInputRef = useRef(null);

// //   const handleQuickPrompt = (promptText) => {
// //     chatInputRef.current?.prefill?.(promptText);
// //   };

// //   const handleSuggestionClick = (suggestion) => {
// //     chatInputRef.current?.prefill?.(suggestion);
// //   };

// //   const handleSidebarHistoryClick = (item) => {
// //     chatInputRef.current?.prefill?.(item);
// //   };

// //   const handleLoadSession = (sessionId, sessionMessages) => {
// //     console.log(
// //       "Loading session:",
// //       sessionId,
// //       "with",
// //       sessionMessages?.length,
// //       "messages"
// //     );

// //     loadSession(sessionId, sessionMessages);
// //   };

// //   // When ensemble mode is active, swap out main area.
// //   const isEnsemble = model === "ensemble";

// //   return (
// //     <div className="chat-layout">

// //       {/* ── LEFT SIDEBAR ── */}
// //       <aside className="chat-sidebar">

// //         <Link to="/" className="sidebar-logo">
// //           <div className="logo-icon">T</div>
// //           ThinkGPT
// //         </Link>

// //         <button
// //           className="new-chat-btn"
// //           onClick={newChat}
// //         >
// //           <span>+</span> New conversation
// //         </button>

// //         <p className="sidebar-section-label">Recent</p>

// //         <div className="history-list">
// //           {SIDEBAR_HISTORY.map(item => (
// //             <div
// //               key={item}
// //               className="history-item"
// //               onClick={() => handleSidebarHistoryClick(item)}
// //               style={{ cursor: "pointer" }}
// //             >
// //               💬 {item}
// //             </div>
// //           ))}
// //         </div>

// //         <div className="sidebar-bottom">

// //           <span className="sidebar-model-label">
// //             Active model
// //           </span>

// //           <select
// //             className="sidebar-model-select"
// //             value={model}
// //             onChange={e => setModel(e.target.value)}
// //           >

// //             <optgroup label="Auto">
// //               <option value="auto">
// //                 Auto — GPT-OSS 20B
// //               </option>
// //             </optgroup>

// //             <optgroup label="Groq Cloud">
// //               <option value="groq-fast">
// //                 GPT-OSS 20B — Fast
// //               </option>

// //               <option value="groq-large">
// //                 GPT-OSS 120B — Advanced Reasoning
// //               </option>

// //               <option value="groq-qwen">
// //                 Qwen 3.8 27B — Preview
// //               </option>
// //             </optgroup>

// //             <optgroup label="Special">
// //               <option value="ensemble">
// //                 ✦ Ensemble — All 3 Models
// //               </option>
// //             </optgroup>

// //           </select>

// //         </div>
// //       </aside>

// //       {/* ── MAIN AREA — swaps between normal chat and ensemble ── */}

// //       {isEnsemble ? (

// //         // ── ENSEMBLE VIEW ──
// //         <EnsembleChat
// //           sessionId={sessionId}
// //         />

// //       ) : (

// //         // ── NORMAL CHAT VIEW ──
// //         <main className="chat-main">

// //           <div className="chat-header">

// //             <div className="chat-header-model">
// //               <div className="model-dot" />
// //               {MODEL_LABELS[model] || model}
// //             </div>

// //             <div className="chat-header-actions">
// //               <Link to="/">
// //                 <button className="icon-btn" title="Home">
// //                   ⌂
// //                 </button>
// //               </Link>
// //             </div>

// //           </div>

// //           <MessageList
// //             messages={messages}
// //             loading={loading}
// //             onSuggestionClick={handleSuggestionClick}
// //           />

// //           <ChatInput
// //             ref={chatInputRef}
// //             sendMessage={sendMessage}
// //             stopStreaming={stopStreaming}
// //             loading={loading}
// //           />

// //         </main>
// //       )}

// //       {/* ── RIGHT PANEL — hidden in ensemble ── */}

// //       {!isEnsemble && (
// //         <RightPanel
// //           messages={messages}
// //           model={model}
// //           onQuickPrompt={handleQuickPrompt}
// //           onSuggestionClick={handleSuggestionClick}
// //           onLoadSession={handleLoadSession}
// //           refreshTrigger={sessionsVersion}
// //         />
// //       )}

// //     </div>
// //   );
// // }



// //C:\Users\user\ThinkGPT\frontend\src\pages\ChatPage.jsx
// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";

// import MessageList from "../components/MessageList";
// import ChatInput from "../components/ChatInput";
// import RightPanel from "../components/RightPanel";
// import EnsembleChat from "../components/EnsembleChat";
// import { getSessionMessages, getSessions } from "../services/api";
// import { useChatStream } from "../hooks/useChatStream";
// import { useAuth } from "../context/AuthContext";

// // Keep this list aligned with the active model IDs in backend/services/modelRouter.js
// // and backend/services/router.service.js. Qwen has intentionally been removed.
// const MODEL_LABELS = {
//   auto: "Auto — Smart Model Routing",
//   "groq-fast": "GPT-OSS 20B — Fast",
//   "groq-large": "GPT-OSS 120B — Advanced Reasoning",
//   "cloudflare-gemma": "Gemma 4 26B A4B — Cloudflare",
//   "cloudflare-glm": "GLM 4.7 Flash — Cloudflare",
//   ensemble: "✦ Ensemble — All 4 Models",
// };

// const VALID_MODEL_IDS = new Set(Object.keys(MODEL_LABELS));

// export default function ChatPage() {
//   const {
//     messages,
//     model,
//     setModel,
//     sessionId,
//     loading,
//     sessionsVersion,
//     sendMessage,
//     stopStreaming,
//     loadSession,
//     newChat,
//   } = useChatStream();

// const {
//   user,
//   isAuthenticated,
//   authLoading,
//   logout,
// } = useAuth();

// const [accountMenuOpen, setAccountMenuOpen] = useState(false);
// const [logoutLoading, setLogoutLoading] = useState(false);
// const [accountError, setAccountError] = useState("");

// const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

//   const chatInputRef = useRef(null);
//   const recentRequestIdRef = useRef(0);
//   useEffect(() => {
//   if (!mobileDrawerOpen) return;

//   const handleEscape = (event) => {
//     if (event.key === "Escape") {
//       setMobileDrawerOpen(false);
//     }
//   };

//   window.addEventListener("keydown", handleEscape);

//   return () => {
//     window.removeEventListener("keydown", handleEscape);
//   };
// }, [mobileDrawerOpen]);

//   const [recentSessions, setRecentSessions] = useState([]);
//   const [recentLoading, setRecentLoading] = useState(true);
//   const [recentError, setRecentError] = useState("");
//   const [loadingSessionId, setLoadingSessionId] = useState(null);
//   const [recentRefreshVersion, setRecentRefreshVersion] = useState(0);

//   // A stale model (for example, groq-qwen from an older frontend build) must
//   // never be sent to the current backend.
//   const activeModel = VALID_MODEL_IDS.has(model) ? model : "groq-fast";

// const accountDisplayName = isAuthenticated
//   ? user?.name || user?.email || "Your account"
//   : "Guest";

// const accountInitial = accountDisplayName.charAt(0).toUpperCase();

// const historyOwnerKey = isAuthenticated
//   ? user?._id || user?.id || user?.email || "signed-in"
//   : "guest";

//   useEffect(() => {
//     if (!VALID_MODEL_IDS.has(model)) {
//       setModel("groq-fast");
//     }
//   }, [model, setModel]);

//   const isEnsemble = activeModel === "ensemble";
//   const modelLabel = MODEL_LABELS[activeModel];

//   // Load real, guest-owned conversations for the left sidebar.
//   // Request cancellation prevents a late response from an older render
//   // replacing a newer history list.
//   useEffect(() => {
//     let isActive = true;
//     const requestId = ++recentRequestIdRef.current;

//     const loadRecentSessions = async () => {
//       setRecentLoading(true);
//       setRecentError("");

//       try {
//         const result = await getSessions();
//         if (isActive && requestId === recentRequestIdRef.current) {
//           setRecentSessions(Array.isArray(result) ? result : []);
//         }
//       } catch (error) {
//         if (isActive && requestId === recentRequestIdRef.current) {
//           setRecentError(error.message || "Could not load recent conversations.");
//           setRecentSessions([]);
//         }
//       } finally {
//         if (isActive && requestId === recentRequestIdRef.current) {
//           setRecentLoading(false);
//         }
//       }
//     };

//     void loadRecentSessions();

//     return () => {
//       isActive = false;
//     };
//   }, [
//   sessionsVersion,
//   recentRefreshVersion,
//   sessionId,
//   activeModel,
//   historyOwnerKey,
// ]);

//   const handleQuickPrompt = (promptText) => {
//     chatInputRef.current?.prefill?.(promptText);
//   };

//   const handleNewChat = () => {
//   recentRequestIdRef.current += 1;
//   setLoadingSessionId(null);
//   setMobileDrawerOpen(false);
//   setAccountMenuOpen(false);
//   newChat();
// };
// const handleAccountLogout = async () => {
//   if (logoutLoading) return;

//   setLogoutLoading(true);
//   setAccountError("");

//   try {
//     await logout();

//     setAccountMenuOpen(false);

//     // Clear the current chat after logout.
//     // The history effect will reload guest-owned conversations.
//     handleNewChat();
//   } catch (error) {
//     setAccountError(error.message || "Could not sign out.");
//   } finally {
//     setLogoutLoading(false);
//   }
// };

//   const handleLoadSession = (selectedSessionId, sessionMessages) => {
//   if (!selectedSessionId) return;

//   recentRequestIdRef.current += 1;
//   setLoadingSessionId(null);
//   setMobileDrawerOpen(false);
//   setAccountMenuOpen(false);

//   loadSession(
//     selectedSessionId,
//     Array.isArray(sessionMessages) ? sessionMessages : []
//   );

//   // Open saved Ensemble conversations in normal chat.
//   if (activeModel === "ensemble") {
//     setModel("auto");
//   }
// };

//   const handleRecentSessionClick = async (selectedSessionId) => {
//     const requestId = ++recentRequestIdRef.current;
//     setLoadingSessionId(selectedSessionId);
//     setRecentError("");

//     try {
//       const sessionMessages = await getSessionMessages(selectedSessionId);

//       if (requestId !== recentRequestIdRef.current) return;

//       handleLoadSession(selectedSessionId, sessionMessages);
//     } catch (error) {
//       if (requestId === recentRequestIdRef.current) {
//         setRecentError(error.message || "Could not open this conversation.");
//       }
//     } finally {
//       if (requestId === recentRequestIdRef.current) {
//         setLoadingSessionId(null);
//       }
//     }
//   };

//   const handleRecentSessionKeyDown = (event, selectedSessionId) => {
//     if (event.key === "Enter" || event.key === " ") {
//       event.preventDefault();
//       void handleRecentSessionClick(selectedSessionId);
//     }
//   };

//   // const handleRightPanelLoadSession = (selectedSessionId, sessionMessages) => {
//   //   handleLoadSession(selectedSessionId, sessionMessages);
//   // };

//   // The refreshed Recent list can also be requested after an Ensemble save.
//   // The current EnsembleChat component can call this callback once synthesis
//   // and persistence have completed.
//   const handleEnsembleSaved = () => {
//     setRecentRefreshVersion((version) => version + 1);
//   };

//   return (
//     <div className="chat-layout">
//       {/* ── LEFT SIDEBAR ── */}
//       <aside className="chat-sidebar">
//         <Link
//   to="/chat"
//   className="sidebar-logo"
//   onClick={handleNewChat}
//   title="Start a new conversation"
//   aria-label="ThinkGPT - Start a new conversation"
// >
//   <div className="logo-icon">T</div>
//   ThinkGPT
// </Link>

//         <button
//           className="new-chat-btn"
//           onClick={handleNewChat}
//           type="button"
//         >
//           <span>+</span> New conversation
//         </button>

//         <p className="sidebar-section-label">Recent</p>

//         <div className="history-list" aria-label="Recent conversations">
//           {recentLoading ? (
//             <div className="history-item" aria-live="polite">
//               Loading recent chats…
//             </div>
//           ) : recentSessions.length === 0 ? (
//             <div className="history-item">
//               {recentError || "No conversations yet"}
//             </div>
//           ) : (
//             recentSessions.map((session) => (
//               <div
//                 key={session.id}
//                 className="history-item"
//                 role="button"
//                 tabIndex={0}
//                 title={session.title || "New conversation"}
//                 aria-current={session.id === sessionId ? "page" : undefined}
//                 aria-busy={loadingSessionId === session.id}
//                 onClick={() => void handleRecentSessionClick(session.id)}
//                 onKeyDown={(event) =>
//                   handleRecentSessionKeyDown(event, session.id)
//                 }
//               >
//                 {loadingSessionId === session.id ? "◌ " : "💬 "}
//                 {session.title || "New conversation"}
//               </div>
//             ))
//           )}
//         </div>

//         {recentError && recentSessions.length > 0 && (
//           <p className="sidebar-section-label" role="status">
//             {recentError}
//           </p>
//         )}

//         {/* ── ACTIVE MODEL SELECTOR ── */}
//         <div className="sidebar-bottom">
//           <span className="sidebar-model-label">Active model</span>

//           <select
//             className="sidebar-model-select"
//             value={activeModel}
//             onChange={(event) => setModel(event.target.value)}
//             disabled={loading}
//             aria-label="Select active AI model"
//           >
//             <optgroup label="Auto">
//               <option value="auto">Auto — Smart Model Routing</option>
//             </optgroup>

//             <optgroup label="Groq Cloud">
//               <option value="groq-fast">GPT-OSS 20B — Fast</option>
//               <option value="groq-large">
//                 GPT-OSS 120B — Advanced Reasoning
//               </option>
//             </optgroup>

//             <optgroup label="Cloudflare Workers AI">
//               <option value="cloudflare-gemma">Gemma 4 26B A4B</option>
//               <option value="cloudflare-glm">GLM 4.7 Flash</option>
//             </optgroup>

//             <optgroup label="Special">
//               <option value="ensemble">✦ Ensemble — All 4 Models</option>
//             </optgroup>
//           </select>
//         </div>
//                 {/* ── ACCOUNT SECTION ── */}
//         <div className="chat-account">
//           <button
//             type="button"
//             className="chat-account-trigger"
//             onClick={() => setAccountMenuOpen((open) => !open)}
//             aria-expanded={accountMenuOpen}
//             aria-controls="chat-account-menu"
//           >
//             <span className="chat-account-avatar">
//               {accountInitial}
//             </span>

//             <span className="chat-account-details">
//               <span className="chat-account-name">
//                 {authLoading ? "Checking account..." : accountDisplayName}
//               </span>

//               <span className="chat-account-status">
//                 {authLoading
//                   ? "Restoring session"
//                   : isAuthenticated
//                     ? "Signed in"
//                     : "Guest session"}
//               </span>
//             </span>

//             <span className="chat-account-chevron">
//               {accountMenuOpen ? "⌄" : "⌃"}
//             </span>
//           </button>

//           {accountMenuOpen && (
//             <div
//               className="chat-account-menu"
//               id="chat-account-menu"
//             >
//               {authLoading ? (
//                 <div className="chat-account-menu-heading">
//                   <strong>Checking account</strong>
//                   <span>Restoring your session...</span>
//                 </div>
//               ) : isAuthenticated ? (
//                 <>
//                   <div className="chat-account-menu-heading">
//                     <strong>{accountDisplayName}</strong>
//                     <span>{user?.email || "Account signed in"}</span>
//                   </div>

//                   <div className="chat-account-divider" />

//                   <Link
//                     to="/"
//                     onClick={() => setAccountMenuOpen(false)}
//                   >
//                     Home
//                   </Link>

//                   <Link
//                     to="/features"
//                     onClick={() => setAccountMenuOpen(false)}
//                   >
//                     Features
//                   </Link>

//                   <Link
//                     to="/about"
//                     onClick={() => setAccountMenuOpen(false)}
//                   >
//                     About
//                   </Link>

//                   <div className="chat-account-divider" />

//                   <button
//                     type="button"
//                     className="chat-account-signout"
//                     onClick={() => void handleAccountLogout()}
//                     disabled={logoutLoading}
//                   >
//                     {logoutLoading ? "Signing out..." : "Sign out"}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <div className="chat-account-menu-heading">
//                     <strong>Guest session</strong>
//                     <span>
//                       Sign in to access your account and saved conversations.
//                     </span>
//                   </div>

//                   <div className="chat-account-divider" />

//                   <Link
//                     to="/login"
//                     onClick={() => setAccountMenuOpen(false)}
//                   >
//                     Sign in
//                   </Link>

//                   <Link
//                     to="/get-started"
//                     onClick={() => setAccountMenuOpen(false)}
//                   >
//                     Create account
//                   </Link>
//                 </>
//               )}

//               {accountError && (
//                 <p className="chat-account-error" role="alert">
//                   {accountError}
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* ── MAIN AREA: NORMAL CHAT OR ENSEMBLE ── */}
//       {isEnsemble ? (
//        <EnsembleChat
//   key={historyOwnerKey}
//   sessionId={sessionId}
//   onConversationSaved={handleEnsembleSaved}
// />
//       ) : (
//         <main className="chat-main">
//           <div className="chat-header">
//             <div className="chat-header-model">
//               <div className="model-dot" />
//               {modelLabel}
//             </div>

//             <div className="chat-header-actions">
//               <Link to="/" aria-label="Home">
//                 <button className="icon-btn" title="Home" type="button">
//                   ⌂
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <MessageList
//             messages={messages}
//             onSuggestionClick={handleQuickPrompt}
//           />

//           <ChatInput
//             ref={chatInputRef}
//             sendMessage={sendMessage}
//             stopStreaming={stopStreaming}
//             loading={loading}
//           />
//         </main>
//       )}

//       {/* Keep the right-side history/session panel out of Ensemble Mode so the
//           four model cards retain their existing 2×2 workspace. */}
//       {!isEnsemble && (
//         // <RightPanel
//         //   messages={messages}
//         //   model={activeModel}
//         //   onQuickPrompt={handleQuickPrompt}
//         //   onSuggestionClick={handleQuickPrompt}
//         //   onLoadSession={handleRightPanelLoadSession}
//         //   refreshTrigger={sessionsVersion + recentRefreshVersion}
//         // />
//         <RightPanel
//   messages={messages}
//   model={activeModel}
//   onQuickPrompt={handleQuickPrompt}
// />
//       )}
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import RightPanel from "../components/RightPanel";
import EnsembleChat from "../components/EnsembleChat";

import { getSessionMessages, getSessions } from "../services/api";
import { useChatStream } from "../hooks/useChatStream";
import { useAuth } from "../context/AuthContext";

// Keep aligned with the active model IDs in the backend.
const MODEL_LABELS = {
  auto: "Auto — Smart Model Routing",
  "groq-fast": "GPT-OSS 20B — Fast",
  "groq-large": "GPT-OSS 120B — Advanced Reasoning",
  "cloudflare-gemma": "Gemma 4 26B A4B — Cloudflare",
  "cloudflare-glm": "GLM 4.7 Flash — Cloudflare",
  ensemble: "✦ Ensemble — All 4 Models",
};

const VALID_MODEL_IDS = new Set(Object.keys(MODEL_LABELS));

export default function ChatPage() {
  // ==========================================================
  // CHAT
  // ==========================================================

  const {
    messages,
    model,
    setModel,
    sessionId,
    loading,
    sessionsVersion,
    sendMessage,
    stopStreaming,
    loadSession,
    newChat,
  } = useChatStream();

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  const {
    user,
    isAuthenticated,
    authLoading,
    logout,
  } = useAuth();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [accountError, setAccountError] = useState("");

  // ==========================================================
  // MOBILE NAVIGATION
  // ==========================================================

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // ==========================================================
  // REFERENCES
  // ==========================================================

  const chatInputRef = useRef(null);
  const recentRequestIdRef = useRef(0);

  // ==========================================================
  // CONVERSATION HISTORY
  // ==========================================================

  const [recentSessions, setRecentSessions] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");
  const [loadingSessionId, setLoadingSessionId] = useState(null);
  const [recentRefreshVersion, setRecentRefreshVersion] = useState(0);

  // ==========================================================
  // MODEL VALIDATION
  // ==========================================================

  const activeModel = VALID_MODEL_IDS.has(model)
    ? model
    : "groq-fast";

  const isEnsemble = activeModel === "ensemble";
  const modelLabel = MODEL_LABELS[activeModel];

  // ==========================================================
  // ACCOUNT DISPLAY
  // ==========================================================

  const accountDisplayName = isAuthenticated
    ? user?.name || user?.email || "Your account"
    : "Guest";

  const accountInitial = accountDisplayName.charAt(0).toUpperCase();

  const historyOwnerKey = isAuthenticated
    ? user?._id || user?.id || user?.email || "signed-in"
    : "guest";

  // ==========================================================
  // ESCAPE KEY — CLOSE MOBILE DRAWER
  // ==========================================================

  useEffect(() => {
    if (!mobileDrawerOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileDrawerOpen(false);
        setAccountMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileDrawerOpen]);

  // ==========================================================
  // RESET INVALID MODEL
  // ==========================================================

  useEffect(() => {
    if (!VALID_MODEL_IDS.has(model)) {
      setModel("groq-fast");
    }
  }, [model, setModel]);

  // ==========================================================
  // MODEL SELECTION
  // ==========================================================

  const handleModelChange = (event) => {
    const selectedModel = event.target.value;

    if (!VALID_MODEL_IDS.has(selectedModel)) return;

    setModel(selectedModel);
    setMobileDrawerOpen(false);
  };

  // ==========================================================
  // LOAD CONVERSATION HISTORY
  // ==========================================================

  useEffect(() => {
    let isActive = true;

    const requestId = ++recentRequestIdRef.current;

    const loadRecentSessions = async () => {
      setRecentLoading(true);
      setRecentError("");

      try {
        const result = await getSessions();

        if (
          isActive &&
          requestId === recentRequestIdRef.current
        ) {
          setRecentSessions(
            Array.isArray(result) ? result : []
          );
        }
      } catch (error) {
        if (
          isActive &&
          requestId === recentRequestIdRef.current
        ) {
          setRecentError(
            error.message || "Could not load recent conversations."
          );

          setRecentSessions([]);
        }
      } finally {
        if (
          isActive &&
          requestId === recentRequestIdRef.current
        ) {
          setRecentLoading(false);
        }
      }
    };

    void loadRecentSessions();

    return () => {
      isActive = false;
    };
  }, [
    sessionsVersion,
    recentRefreshVersion,
    sessionId,
    activeModel,
    historyOwnerKey,
  ]);

  // ==========================================================
  // CLOSE MOBILE NAVIGATION
  // ==========================================================

  const closeMobileNavigation = () => {
    setMobileDrawerOpen(false);
    setAccountMenuOpen(false);
  };

  // ==========================================================
  // QUICK PROMPTS
  // ==========================================================

  const handleQuickPrompt = (promptText) => {
    chatInputRef.current?.prefill?.(promptText);
  };

  // ==========================================================
  // NEW CONVERSATION
  // ==========================================================

  const handleNewChat = () => {
    // Invalidate outstanding history requests.
    recentRequestIdRef.current += 1;

    setLoadingSessionId(null);
    closeMobileNavigation();

    newChat();
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const handleAccountLogout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);
    setAccountError("");

    try {
      await logout();

      setAccountMenuOpen(false);

      // Return to a clean guest conversation.
      handleNewChat();
    } catch (error) {
      setAccountError(
        error.message || "Could not sign out."
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  // ==========================================================
  // LOAD A SELECTED CONVERSATION
  // ==========================================================

  const handleLoadSession = (
    selectedSessionId,
    sessionMessages
  ) => {
    if (!selectedSessionId) return;

    recentRequestIdRef.current += 1;

    setLoadingSessionId(null);
    closeMobileNavigation();

    loadSession(
      selectedSessionId,
      Array.isArray(sessionMessages)
        ? sessionMessages
        : []
    );

    // Saved Ensemble conversations can be displayed in normal chat.
    if (activeModel === "ensemble") {
      setModel("auto");
    }
  };

  // ==========================================================
  // RECENT CONVERSATION SELECTION
  // ==========================================================

  const handleRecentSessionClick = async (selectedSessionId) => {
    const requestId = ++recentRequestIdRef.current;

    setLoadingSessionId(selectedSessionId);
    setRecentError("");

    try {
      const sessionMessages = await getSessionMessages(
        selectedSessionId
      );

      // Ignore stale responses from previous selections.
      if (requestId !== recentRequestIdRef.current) {
        return;
      }

      handleLoadSession(selectedSessionId, sessionMessages);
    } catch (error) {
      if (requestId === recentRequestIdRef.current) {
        setRecentError(
          error.message || "Could not open this conversation."
        );
      }
    } finally {
      if (requestId === recentRequestIdRef.current) {
        setLoadingSessionId(null);
      }
    }
  };

  // ==========================================================
  // KEYBOARD ACCESSIBILITY FOR HISTORY
  // ==========================================================

  const handleRecentSessionKeyDown = (
    event,
    selectedSessionId
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      void handleRecentSessionClick(selectedSessionId);
    }
  };

  // ==========================================================
  // REFRESH HISTORY AFTER ENSEMBLE SAVE
  // ==========================================================

  const handleEnsembleSaved = () => {
    setRecentRefreshVersion((version) => version + 1);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      className={`chat-layout ${
        mobileDrawerOpen ? "mobile-drawer-open" : ""
      }`}
    >
      {/* ======================================================
          MOBILE TOP BAR
          ====================================================== */}

      <div className="mobile-chatbar">

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileDrawerOpen}
          aria-controls="thinkgpt-mobile-sidebar"
        >
          <span aria-hidden="true">☰</span>
        </button>

        <Link
          to="/chat"
          className="mobile-chatbar-brand"
          onClick={handleNewChat}
          title="ThinkGPT - New conversation"
        >
          <span className="mobile-brand-icon">T</span>
          <span>ThinkGPT</span>
        </Link>

        {/* Direct model selection on mobile */}

        <select
          className="mobile-model-select"
          value={activeModel}
          onChange={handleModelChange}
          disabled={loading}
          aria-label="Select active AI model"
          title="Select active AI model"
        >
          <optgroup label="Automatic">
            <option value="auto">Auto — Smart Routing</option>
          </optgroup>

          <optgroup label="Groq Cloud">
            <option value="groq-fast">GPT-OSS 20B</option>
            <option value="groq-large">GPT-OSS 120B</option>
          </optgroup>

          <optgroup label="Cloudflare">
            <option value="cloudflare-gemma">Gemma 4</option>
            <option value="cloudflare-glm">GLM 4.7 Flash</option>
          </optgroup>

          <optgroup label="Special">
            <option value="ensemble">Ensemble — All 4 Models</option>
          </optgroup>
        </select>

      </div>

      {/* ======================================================
          LEFT SIDEBAR / MOBILE DRAWER
          ====================================================== */}

      <aside
        id="thinkgpt-mobile-sidebar"
        className="chat-sidebar"
        aria-label="Main navigation"
      >

        <Link
          to="/chat"
          className="sidebar-logo"
          onClick={handleNewChat}
          title="Start a new conversation"
          aria-label="ThinkGPT - Start a new conversation"
        >
          <div className="logo-icon">T</div>
          ThinkGPT
        </Link>

        <button
          className="new-chat-btn"
          onClick={handleNewChat}
          type="button"
        >
          <span>+</span>
          New conversation
        </button>

        <p className="sidebar-section-label">Recent</p>

        <div
          className="history-list"
          aria-label="Recent conversations"
        >
          {recentLoading ? (
            <div className="history-item" aria-live="polite">
              Loading recent chats…
            </div>
          ) : recentSessions.length === 0 ? (
            <div className="history-item">
              {recentError || "No conversations yet"}
            </div>
          ) : (
            recentSessions.map((session) => (
              <div
                key={session.id}
                className="history-item"
                role="button"
                tabIndex={0}
                title={session.title || "New conversation"}
                aria-current={
                  session.id === sessionId ? "page" : undefined
                }
                aria-busy={loadingSessionId === session.id}
                onClick={() =>
                  void handleRecentSessionClick(session.id)
                }
                onKeyDown={(event) =>
                  handleRecentSessionKeyDown(event, session.id)
                }
              >
                {loadingSessionId === session.id ? "◌ " : "💬 "}
                {session.title || "New conversation"}
              </div>
            ))
          )}
        </div>

        {recentError && recentSessions.length > 0 && (
          <p className="sidebar-section-label" role="status">
            {recentError}
          </p>
        )}

        {/* DESKTOP MODEL SELECTOR */}

        <div className="sidebar-bottom">
          <span className="sidebar-model-label">Active model</span>

          <select
            className="sidebar-model-select"
            value={activeModel}
            onChange={handleModelChange}
            disabled={loading}
            aria-label="Select active AI model"
          >
            <optgroup label="Auto">
              <option value="auto">
                Auto — Smart Model Routing
              </option>
            </optgroup>

            <optgroup label="Groq Cloud">
              <option value="groq-fast">
                GPT-OSS 20B — Fast
              </option>

              <option value="groq-large">
                GPT-OSS 120B — Advanced Reasoning
              </option>
            </optgroup>

            <optgroup label="Cloudflare Workers AI">
              <option value="cloudflare-gemma">
                Gemma 4 26B A4B
              </option>

              <option value="cloudflare-glm">
                GLM 4.7 Flash
              </option>
            </optgroup>

            <optgroup label="Special">
              <option value="ensemble">
                ✦ Ensemble — All 4 Models
              </option>
            </optgroup>
          </select>
        </div>

        {/* ACCOUNT SECTION */}

        <div className="chat-account">
          <button
            type="button"
            className="chat-account-trigger"
            onClick={() =>
              setAccountMenuOpen((open) => !open)
            }
            aria-expanded={accountMenuOpen}
            aria-controls="chat-account-menu"
          >
            <span className="chat-account-avatar">
              {accountInitial}
            </span>

            <span className="chat-account-details">
              <span className="chat-account-name">
                {authLoading
                  ? "Checking account..."
                  : accountDisplayName}
              </span>

              <span className="chat-account-status">
                {authLoading
                  ? "Restoring session"
                  : isAuthenticated
                    ? "Signed in"
                    : "Guest session"}
              </span>
            </span>

            <span className="chat-account-chevron">
              {accountMenuOpen ? "⌄" : "⌃"}
            </span>
          </button>

          {accountMenuOpen && (
            <div
              className="chat-account-menu"
              id="chat-account-menu"
            >
              {authLoading ? (
                <div className="chat-account-menu-heading">
                  <strong>Checking account</strong>
                  <span>Restoring your session...</span>
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="chat-account-menu-heading">
                    <strong>{accountDisplayName}</strong>
                    <span>{user?.email || "Account signed in"}</span>
                  </div>

                  <div className="chat-account-divider" />

                  <Link to="/" onClick={closeMobileNavigation}>
                    Home
                  </Link>

                  <Link to="/features" onClick={closeMobileNavigation}>
                    Features
                  </Link>

                  <Link to="/about" onClick={closeMobileNavigation}>
                    About
                  </Link>

                  <div className="chat-account-divider" />

                  <button
                    type="button"
                    className="chat-account-signout"
                    onClick={() => void handleAccountLogout()}
                    disabled={logoutLoading}
                  >
                    {logoutLoading ? "Signing out..." : "Sign out"}
                  </button>
                </>
              ) : (
                <>
                  <div className="chat-account-menu-heading">
                    <strong>Guest session</strong>
                    <span>
                      Sign in to access your account and saved conversations.
                    </span>
                  </div>

                  <div className="chat-account-divider" />

                  <Link to="/login" onClick={closeMobileNavigation}>
                    Sign in
                  </Link>

                  <Link to="/get-started" onClick={closeMobileNavigation}>
                    Create account
                  </Link>
                </>
              )}

              {accountError && (
                <p className="chat-account-error" role="alert">
                  {accountError}
                </p>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* ======================================================
          MOBILE DRAWER BACKDROP
          ====================================================== */}

      {mobileDrawerOpen && (
        <button
          type="button"
          className="mobile-drawer-backdrop"
          onClick={closeMobileNavigation}
          aria-label="Close navigation menu"
        />
      )}

      {/* ======================================================
          NORMAL CHAT OR ENSEMBLE MODE
          ====================================================== */}

      {isEnsemble ? (
        <EnsembleChat
          key={historyOwnerKey}
          sessionId={sessionId}
          onConversationSaved={handleEnsembleSaved}
        />
      ) : (
        <main className="chat-main">

          {/* Desktop header */}

          <div className="chat-header">
            <div className="chat-header-model">
              <div className="model-dot" />
              {modelLabel}
            </div>

            <div className="chat-header-actions">
              <Link to="/" aria-label="Home">
                <button
                  className="icon-btn"
                  title="Home"
                  type="button"
                >
                  ⌂
                </button>
              </Link>
            </div>
          </div>

          <MessageList
            messages={messages}
            onSuggestionClick={handleQuickPrompt}
          />

          <ChatInput
            ref={chatInputRef}
            sendMessage={sendMessage}
            stopStreaming={stopStreaming}
            loading={loading}
          />
        </main>
      )}

      {/* ======================================================
          RIGHT SESSION OVERVIEW PANEL
          ====================================================== */}

      {!isEnsemble && (
        <RightPanel
          messages={messages}
          model={activeModel}
          onQuickPrompt={handleQuickPrompt}
        />
      )}
    </div>
  );
}
