

// // src/components/EnsembleChat.jsx
// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { API_BASE } from "../config";

// const MODELS = [
//   { key: "groq-fast",   label: "Llama 3.1 8B",      badge: "⚡", meta: "Fastest · 128K" },
//   { key: "groq-large",  label: "Llama 3.3 70B",      badge: "🧠", meta: "Powerful · 128K" },
//   { key: "groq-qwen",   label: "Qwen 3 32B",         badge: "🔮", meta: "Alibaba · 32K"  },
//   { key: "groq-llama4", label: "Llama 4 Scout 17B",  badge: "🚀", meta: "Latest · 128K"  },
// ];

// // Stream a single model — returns full text via onChunk / onDone / onError
// async function streamModel({ message, model, onChunk, onDone, onError, signal }) {
//   try {
//     const res = await fetch(`${API_BASE}/stream`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message, model }),
//       signal,
//     });

//     if (!res.ok) throw new Error(`HTTP ${res.status}`);

//     const reader = res.body.getReader();
//     const decoder = new TextDecoder();
//     let buffer = "";
//     let full = "";

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;
//       buffer += decoder.decode(value, { stream: true });
//       const lines = buffer.split("\n");
//       buffer = lines.pop();
//       for (const line of lines) {
//         if (!line.trim()) continue;
//         try {
//           const json = JSON.parse(line);
//           if (json.response) { full += json.response; onChunk(json.response); }
//           if (json.done)      { onDone(full); return; }
//           if (json.error)     { onError(json.error); return; }
//         } catch {}
//       }
//     }
//     onDone(full);
//   } catch (err) {
//     if (err.name !== "AbortError") onError(err.message);
//   }
// }

// // Call judge endpoint
// async function fetchJudge({ prompt, candidates }) {
//   const res = await fetch(`${API_BASE}/ensemble-judge`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ prompt, candidates }),
//   });
//   if (!res.ok) throw new Error("Judge failed");
//   return res.json(); // { reply }
// }

// // ─── Individual model window ─────────────────────────────────────────────
// function ModelWindow({ model, content, status }) {
//   const bottomRef = useRef(null);
//   const copyBtnRef = useRef(null);

//   useEffect(() => {
//     if (status === "streaming") bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [content, status]);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(content || "");
//       if (copyBtnRef.current) {
//         copyBtnRef.current.classList.add("copied");
//         copyBtnRef.current.textContent = "✓";
//         setTimeout(() => {
//           copyBtnRef.current.classList.remove("copied");
//           copyBtnRef.current.textContent = "📋";
//         }, 2000);
//       }
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   const statusLabel = {
//     idle: "Ready",
//     streaming: "Streaming…",
//     done: "Done",
//     error: "Failed",
//   }[status];

//   return (
//     <div className="ew-window">
//       {/* Window header */}
//       <div className="ew-window-header">
//         <div className="ew-window-info">
//           <span className="ew-window-badge">{model.badge}</span>
//           <div>
//             <p className="ew-window-name">{model.label}</p>
//             <p className="ew-window-meta">{model.meta}</p>
//           </div>
//         </div>
//         <span
//           className={`ew-window-status ${
//             status === "streaming" ? "ew-streaming" : status === "error" ? "ew-error" : ""
//           }`}
//         >
//           {statusLabel}
//         </span>
//       </div>

//       {/* Window body */}
//       <div className="ew-window-body">
//         {status === "idle" && (
//           <div className="ew-idle">
//             <div className="ew-idle-orb">{model.badge}</div>
//             <p>Waiting to start…</p>
//           </div>
//         )}
//         {status === "streaming" && !content && (
//           <div className="typing-indicator" style={{ padding: "8px 0" }}>
//             <span /><span /><span />
//           </div>
//         )}
//         {(status === "streaming" || status === "done") && content && (
//           <div className="md ew-md">
//             <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
//             {status === "streaming" && <span className="cursor-blink">▍</span>}
//           </div>
//         )}
//         {status === "error" && (
//           <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>
//             ❌ This model failed to respond.
//           </p>
//         )}
//         <div ref={bottomRef} />
//       </div>
      
//       {content && status === "done" && (
//         <button 
//           ref={copyBtnRef}
//           className="copy-btn" 
//           onClick={handleCopy}
//         >
//           📋
//         </button>
//       )}
//     </div>
//   );
// }

// // ─── Main EnsembleChat component ─────────────────────────────────────────────
// export default function EnsembleChat() {
//   const [input, setInput]           = useState("");
//   const [phase, setPhase]           = useState("idle"); // idle | running | judging | done
//   const [modelStates, setModelStates] = useState(
//     Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "idle" }]))
//   );
//   const [finalAnswer, setFinalAnswer] = useState("");
//   const [finalStreaming, setFinalStreaming] = useState(false);
//   const [currentPrompt, setCurrentPrompt] = useState("");
//   const abortRef = useRef(null);
//   const textareaRef = useRef(null);
//   const finalRef = useRef(null);
//   const finalCopyBtnRef = useRef(null);

//   useEffect(() => {
//     if (finalAnswer) finalRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [finalAnswer]);

//   const updateModel = (key, patch) => {
//     setModelStates(prev => ({
//       ...prev,
//       [key]: { ...prev[key], ...patch },
//     }));
//   };

//   const handleRun = async () => {
//     if (!input.trim() || phase === "running" || phase === "judging") return;

//     const prompt = input.trim();
//     setCurrentPrompt(prompt);
//     setInput("");
//     setFinalAnswer("");
//     setFinalStreaming(false);
//     setPhase("running");

//     // Reset all windows
//     setModelStates(
//       Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "streaming" }]))
//     );

//     abortRef.current = new AbortController();
//     const { signal } = abortRef.current;

//     const candidates = [];

//     // Run all 4 in parallel
//     await Promise.allSettled(
//       MODELS.map(model =>
//         new Promise(resolve => {
//           streamModel({
//             message: prompt,
//             model: model.key,
//             signal,
//             onChunk: token => {
//               updateModel(model.key, prev => ({
//                 content: (prev?.content || "") + token,
//                 status: "streaming",
//               }));
//               // need functional update — use ref trick
//               setModelStates(prev => ({
//                 ...prev,
//                 [model.key]: {
//                   ...prev[model.key],
//                   content: prev[model.key].content + token,
//                   status: "streaming",
//                 },
//               }));
//             },
//             onDone: full => {
//               setModelStates(prev => ({
//                 ...prev,
//                 [model.key]: { content: full, status: "done" },
//               }));
//               candidates.push({ model: model.label, output: full });
//               resolve();
//             },
//             onError: () => {
//               setModelStates(prev => ({
//                 ...prev,
//                 [model.key]: { ...prev[model.key], status: "error" },
//               }));
//               resolve();
//             },
//           });
//         })
//       )
//     );

//     if (candidates.length === 0) {
//       setPhase("idle");
//       return;
//     }

//     // Judge phase
//     setPhase("judging");
//     setFinalStreaming(true);

//     try {
//       const { reply } = await fetchJudge({ prompt, candidates });
//       // Simulate streaming the final answer character by character
//       let i = 0;
//       const interval = setInterval(() => {
//         if (i >= reply.length) {
//           clearInterval(interval);
//           setFinalStreaming(false);
//           setPhase("done");
//           return;
//         }
//         const chunk = reply.slice(0, i + 3); // reveal 3 chars at a time
//         setFinalAnswer(chunk);
//         i += 3;
//       }, 12);
//     } catch {
//       setFinalAnswer("❌ Synthesis failed. Please try again.");
//       setFinalStreaming(false);
//       setPhase("done");
//     }
//   };

//   const handleStop = () => {
//     abortRef.current?.abort();
//     setPhase("idle");
//     MODELS.forEach(m => {
//       setModelStates(prev => ({
//         ...prev,
//         [m.key]: { ...prev[m.key], status: prev[m.key].status === "streaming" ? "done" : prev[m.key].status },
//       }));
//     });
//   };

//   const handleKeyDown = e => {
//     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRun(); }
//   };

//   const handleChange = e => {
//     setInput(e.target.value);
//     const ta = textareaRef.current;
//     if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; }
//   };

//   const handleCopyFinal = async () => {
//     try {
//       await navigator.clipboard.writeText(finalAnswer || "");
//       if (finalCopyBtnRef.current) {
//         finalCopyBtnRef.current.classList.add("copied");
//         finalCopyBtnRef.current.textContent = "✓";
//         setTimeout(() => {
//           finalCopyBtnRef.current.classList.remove("copied");
//           finalCopyBtnRef.current.textContent = "📋";
//         }, 2000);
//       }
//     } catch (err) {
//       console.error("Failed to copy:", err);
//     }
//   };

//   return (
//     <div className="ew-root">

//       {/* ── Header ── */}
//       <div className="ew-header">
//         <div className="ew-header-left">
//           <div className="ew-header-icon">✦</div>
//           <div>
//             <p className="ew-header-title">Ensemble Mode</p>
//             <p className="ew-header-sub">All 4 models · Synthesized by Llama 3.3 70B</p>
//           </div>
//         </div>
//         {phase === "running" && (
//           <button className="ew-stop-btn" onClick={handleStop}>◼ Stop</button>
//         )}
//         {phase === "judging" && (
//           <div className="ew-judging-badge">
//             <span className="ew-pulse" />
//             Synthesizing…
//           </div>
//         )}
//       </div>

//       {/* ── Current prompt ── */}
//       {currentPrompt && (
//         <div className="ew-prompt-bar">
//           <span className="ew-prompt-label">Prompt</span>
//           <span className="ew-prompt-text">"{currentPrompt}"</span>
//         </div>
//       )}

//       {/* ── 2×2 Model Grid ── */}
//       <div className="ew-grid">
//         {MODELS.map(model => (
//           <ModelWindow
//             key={model.key}
//             model={model}
//             content={modelStates[model.key].content}
//             status={modelStates[model.key].status}
//           />
//         ))}
//       </div>

//       {/* ── Final Synthesized Answer ── */}
//       {(phase === "judging" || phase === "done") && (
//         <div className="ew-final" ref={finalRef}>
//           <div className="ew-final-header">
//             <div className="ew-final-icon">🧬</div>
//             <div>
//               <p className="ew-final-title">Synthesized Answer</p>
//               <p className="ew-final-sub">Best response · Judged by Llama 3.3 70B</p>
//             </div>
//             {finalStreaming && <span className="ew-pulse" style={{ marginLeft: "auto" }} />}
//           </div>
//           <div className="ew-final-body">
//             {!finalAnswer && finalStreaming && (
//               <div className="typing-indicator"><span /><span /><span /></div>
//             )}
//             {finalAnswer && (
//               <div className="md">
//                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{finalAnswer}</ReactMarkdown>
//                 {finalStreaming && <span className="cursor-blink">▍</span>}
//               </div>
//             )}
//           </div>
//           {finalAnswer && !finalStreaming && (
//             <button 
//               ref={finalCopyBtnRef}
//               className="copy-btn" 
//               onClick={handleCopyFinal}
//             >
//               📋
//             </button>
//           )}
//         </div>
//       )}

//       {/* ── Input ── */}
//       <div className="ew-input-area">
//         <div className={`ew-input-wrapper ${phase === "running" || phase === "judging" ? "ew-input-disabled" : ""}`}>
//           <textarea
//             ref={textareaRef}
//             className="chat-textarea"
//             placeholder="Ask all 4 models simultaneously…"
//             value={input}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             disabled={phase === "running" || phase === "judging"}
//             rows={1}
//           />
//           <div className="input-actions">
//             {phase === "running" ? (
//               <button className="stop-btn-inline" onClick={handleStop}>◼</button>
//             ) : (
//               <button
//                 className="send-btn"
//                 onClick={handleRun}
//                 disabled={!input.trim() || phase === "judging"}
//               >
//                 ✦
//               </button>
//             )}
//           </div>
//         </div>
//         <p className="input-hint">
//           Sends to all 4 models · Llama 3.3 70B synthesizes final answer
//         </p>
//       </div>

//     </div>
//   );
// }


// src/components/EnsembleChat.jsx
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_BASE } from "../config";

const MODELS = [
  { key: "groq-fast",   label: "Llama 3.1 8B",      badge: "⚡", meta: "Fastest · 128K" },
  { key: "groq-large",  label: "Llama 3.3 70B",      badge: "🧠", meta: "Powerful · 128K" },
  { key: "groq-qwen",   label: "Qwen 3 32B",         badge: "🔮", meta: "Alibaba · 32K"  },
  { key: "groq-llama4", label: "Llama 4 Scout 17B",  badge: "🚀", meta: "Latest · 128K"  },
];

// Stream a single model — returns full text via onChunk / onDone / onError
async function streamModel({ message, model, onChunk, onDone, onError, signal }) {
  try {
    const res = await fetch(`${API_BASE}/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, model }),
      signal,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.response) { full += json.response; onChunk(json.response); }
          if (json.done)      { onDone(full); return; }
          if (json.error)     { onError(json.error); return; }
        } catch {}
      }
    }
    onDone(full);
  } catch (err) {
    if (err.name !== "AbortError") onError(err.message);
  }
}

// Call judge endpoint
async function fetchJudge({ prompt, candidates }) {
  const res = await fetch(`${API_BASE}/ensemble-judge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, candidates }),
  });
  if (!res.ok) throw new Error("Judge failed");
  return res.json(); // { reply }
}

// ─── Individual model window ─────────────────────────────────────────────
function ModelWindow({ model, content, status }) {
  const bottomRef = useRef(null);
  const copyBtnRef = useRef(null);

  useEffect(() => {
    if (status === "streaming") bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content, status]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || "");
      if (copyBtnRef.current) {
        copyBtnRef.current.classList.add("copied");
        copyBtnRef.current.textContent = "✓";
        setTimeout(() => {
          copyBtnRef.current.classList.remove("copied");
          copyBtnRef.current.textContent = "📋";
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const statusLabel = {
    idle: "Ready",
    streaming: "Streaming…",
    done: "Done",
    error: "Failed",
  }[status];

  return (
    <div className="ew-window">
      {/* Window header */}
      <div className="ew-window-header">
        <div className="ew-window-info">
          <span className="ew-window-badge">{model.badge}</span>
          <div>
            <p className="ew-window-name">{model.label}</p>
            <p className="ew-window-meta">{model.meta}</p>
          </div>
        </div>
        <span
          className={`ew-window-status ${
            status === "streaming" ? "ew-streaming" : status === "error" ? "ew-error" : ""
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Window body */}
      <div className="ew-window-body">
        {status === "idle" && (
          <div className="ew-idle">
            <div className="ew-idle-orb">{model.badge}</div>
            <p>Waiting to start…</p>
          </div>
        )}
        {status === "streaming" && !content && (
          <div className="typing-indicator" style={{ padding: "8px 0" }}>
            <span /><span /><span />
          </div>
        )}
        {(status === "streaming" || status === "done") && content && (
          <div className="md ew-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            {status === "streaming" && <span className="cursor-blink">▍</span>}
          </div>
        )}
        {status === "error" && (
          <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>
            ❌ This model failed to respond.
          </p>
        )}
        <div ref={bottomRef} />
      </div>
      
      {content && status === "done" && (
        <button 
          ref={copyBtnRef}
          className="copy-btn" 
          onClick={handleCopy}
        >
          📋
        </button>
      )}
    </div>
  );
}

// ─── Main EnsembleChat component ─────────────────────────────────────────────
export default function EnsembleChat() {
  const [input, setInput]           = useState("");
  const [phase, setPhase]           = useState("idle"); // idle | running | judging | done
  const [modelStates, setModelStates] = useState(
    Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "idle" }]))
  );
  const [finalAnswer, setFinalAnswer] = useState("");
  const [finalStreaming, setFinalStreaming] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [synthExpanded, setSynthExpanded] = useState(false);
  const abortRef = useRef(null);
  const textareaRef = useRef(null);
  const finalRef = useRef(null);
  const finalCopyBtnRef = useRef(null);

  useEffect(() => {
    if (finalAnswer) finalRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [finalAnswer]);

  const updateModel = (key, patch) => {
    setModelStates(prev => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };

  const handleRun = async () => {
    if (!input.trim() || phase === "running" || phase === "judging") return;

    const prompt = input.trim();
    setCurrentPrompt(prompt);
    setInput("");
    setFinalAnswer("");
    setFinalStreaming(false);
    setPhase("running");

    // Reset all windows
    setModelStates(
      Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "streaming" }]))
    );

    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    const candidates = [];

    // Run all 4 in parallel
    await Promise.allSettled(
      MODELS.map(model =>
        new Promise(resolve => {
          streamModel({
            message: prompt,
            model: model.key,
            signal,
            onChunk: token => {
              updateModel(model.key, prev => ({
                content: (prev?.content || "") + token,
                status: "streaming",
              }));
              // need functional update — use ref trick
              setModelStates(prev => ({
                ...prev,
                [model.key]: {
                  ...prev[model.key],
                  content: prev[model.key].content + token,
                  status: "streaming",
                },
              }));
            },
            onDone: full => {
              setModelStates(prev => ({
                ...prev,
                [model.key]: { content: full, status: "done" },
              }));
              candidates.push({ model: model.label, output: full });
              resolve();
            },
            onError: () => {
              setModelStates(prev => ({
                ...prev,
                [model.key]: { ...prev[model.key], status: "error" },
              }));
              resolve();
            },
          });
        })
      )
    );

    if (candidates.length === 0) {
      setPhase("idle");
      return;
    }

    // Judge phase
    setPhase("judging");
    setFinalStreaming(true);

    try {
      const { reply } = await fetchJudge({ prompt, candidates });
      // Simulate streaming the final answer character by character
      let i = 0;
      const interval = setInterval(() => {
        if (i >= reply.length) {
          clearInterval(interval);
          setFinalStreaming(false);
          setPhase("done");
          return;
        }
        const chunk = reply.slice(0, i + 3); // reveal 3 chars at a time
        setFinalAnswer(chunk);
        i += 3;
      }, 12);
    } catch {
      setFinalAnswer("❌ Synthesis failed. Please try again.");
      setFinalStreaming(false);
      setPhase("done");
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setPhase("idle");
    MODELS.forEach(m => {
      setModelStates(prev => ({
        ...prev,
        [m.key]: { ...prev[m.key], status: prev[m.key].status === "streaming" ? "done" : prev[m.key].status },
      }));
    });
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRun(); }
  };

  const handleChange = e => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; }
  };

  const handleToggleExpand = () => {
    console.log('Toggle expand:', !synthExpanded);
    setSynthExpanded(!synthExpanded);
  };

  const handleCopyFinal = async () => {
    try {
      await navigator.clipboard.writeText(finalAnswer || "");
      if (finalCopyBtnRef.current) {
        finalCopyBtnRef.current.classList.add("copied");
        finalCopyBtnRef.current.textContent = "✓";
        setTimeout(() => {
          finalCopyBtnRef.current.classList.remove("copied");
          finalCopyBtnRef.current.textContent = "📋";
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="ew-root">

      {/* ── Header ── */}
      <div className="ew-header">
        <div className="ew-header-left">
          <div className="ew-header-icon">✦</div>
          <div>
            <p className="ew-header-title">Ensemble Mode</p>
            <p className="ew-header-sub">All 4 models · Synthesized by Llama 3.3 70B</p>
          </div>
        </div>
        {phase === "running" && (
          <button className="ew-stop-btn" onClick={handleStop}>◼ Stop</button>
        )}
        {phase === "judging" && (
          <div className="ew-judging-badge">
            <span className="ew-pulse" />
            Synthesizing…
          </div>
        )}
      </div>

      {/* ── Current prompt ── */}
      {currentPrompt && (
        <div className="ew-prompt-bar">
          <span className="ew-prompt-label">Prompt</span>
          <span className="ew-prompt-text">"{currentPrompt}"</span>
        </div>
      )}

      {/* ── 2×2 Model Grid ── */}
      <div className="ew-grid">
        {MODELS.map(model => (
          <ModelWindow
            key={model.key}
            model={model}
            content={modelStates[model.key].content}
            status={modelStates[model.key].status}
          />
        ))}
      </div>

      {/* ── Final Synthesized Answer ── */}
      {(phase === "judging" || phase === "done") && (
        <div 
          className={`ew-final ${synthExpanded ? "expanded" : ""}`} 
          ref={finalRef}
          style={{
            maxHeight: synthExpanded ? '80vh' : '120px',
            transition: 'all 0.3s ease-out'
          }}
        >
          <div className="ew-final-header">
            <div className="ew-final-icon">🧬</div>
            <div>
              <p className="ew-final-title">Synthesized Answer</p>
              <p className="ew-final-sub">Best response · Judged by Llama 3.3 70B</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button 
                className="expand-btn"
                onClick={handleToggleExpand}
                title={synthExpanded ? "Collapse" : "Expand"}
              >
                {synthExpanded ? "▼" : "▲"}
              </button>
              {finalStreaming && <span className="ew-pulse" />}
            </div>
            {finalAnswer && !finalStreaming && (
              <button 
                ref={finalCopyBtnRef}
                className="copy-btn" 
                onClick={handleCopyFinal}
              >
                📋
              </button>
            )}
          </div>
          </div>
          <div className="ew-final-body">
            {!finalAnswer && finalStreaming && (
              <div className="typing-indicator"><span /><span /><span /></div>
            )}
            {finalAnswer && (
              <div className="md">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{finalAnswer}</ReactMarkdown>
                {finalStreaming && <span className="cursor-blink">▍</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="ew-input-area">
        <div className={`ew-input-wrapper ${phase === "running" || phase === "judging" ? "ew-input-disabled" : ""}`}>
          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask all 4 models simultaneously…"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={phase === "running" || phase === "judging"}
            rows={1}
          />
          <div className="input-actions">
            {phase === "running" ? (
              <button className="stop-btn-inline" onClick={handleStop}>◼</button>
            ) : (
              <button
                className="send-btn"
                onClick={handleRun}
                disabled={!input.trim() || phase === "judging"}
              >
                ✦
              </button>
            )}
          </div>
        </div>
        <p className="input-hint">
          Sends to all 4 models · Llama 3.3 70B synthesizes final answer
        </p>
      </div>

    </div>
  );
}
