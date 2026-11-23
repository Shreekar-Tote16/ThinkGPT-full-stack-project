

// // // // // src/components/EnsembleChat.jsx
// // // // import { useState, useRef, useEffect } from "react";
// // // // import ReactMarkdown from "react-markdown";
// // // // import remarkGfm from "remark-gfm";
// // // // import { API_BASE } from "../config";

// // // // const MODELS = [
// // // //   { key: "groq-fast",   label: "Llama 3.1 8B",      badge: "⚡", meta: "Fastest · 128K" },
// // // //   { key: "groq-large",  label: "Llama 3.3 70B",      badge: "🧠", meta: "Powerful · 128K" },
// // // //   { key: "groq-qwen",   label: "Qwen 3 32B",         badge: "🔮", meta: "Alibaba · 32K"  },
// // // // ];

// // // // // Stream a single model — returns full text via onChunk / onDone / onError
// // // // async function streamModel({ message, model, onChunk, onDone, onError, signal }) {
// // // //   try {
// // // //     const res = await fetch(`${API_BASE}/stream`, {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify({ message, model }),
// // // //       signal,
// // // //     });

// // // //     if (!res.ok) throw new Error(`HTTP ${res.status}`);

// // // //     const reader = res.body.getReader();
// // // //     const decoder = new TextDecoder();
// // // //     let buffer = "";
// // // //     let full = "";

// // // //     while (true) {
// // // //       const { done, value } = await reader.read();
// // // //       if (done) break;
// // // //       buffer += decoder.decode(value, { stream: true });
// // // //       const lines = buffer.split("\n");
// // // //       buffer = lines.pop();
// // // //       for (const line of lines) {
// // // //         if (!line.trim()) continue;
// // // //         try {
// // // //           const json = JSON.parse(line);
// // // //           if (json.response) { full += json.response; onChunk(json.response); }
// // // //           if (json.done)      { onDone(full); return; }
// // // //           if (json.error)     { onError(json.error); return; }
// // // //         } catch {}
// // // //       }
// // // //     }
// // // //     onDone(full);
// // // //   } catch (err) {
// // // //     if (err.name !== "AbortError") onError(err.message);
// // // //   }
// // // // }

// // // // // Call judge endpoint
// // // // async function fetchJudge({ prompt, candidates }) {
// // // //   const res = await fetch(`${API_BASE}/ensemble-judge`, {
// // // //     method: "POST",
// // // //     headers: { "Content-Type": "application/json" },
// // // //     body: JSON.stringify({ prompt, candidates }),
// // // //   });
// // // //   if (!res.ok) throw new Error("Judge failed");
// // // //   return res.json(); // { reply }
// // // // }

// // // // // ─── Individual model window ─────────────────────────────────────────────
// // // // function ModelWindow({ model, content, status }) {
// // // //   const bottomRef = useRef(null);
// // // //   const copyBtnRef = useRef(null);

// // // //   useEffect(() => {
// // // //     if (status === "streaming") bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// // // //   }, [content, status]);

// // // //   const handleCopy = async () => {
// // // //     try {
// // // //       await navigator.clipboard.writeText(content || "");
// // // //       if (copyBtnRef.current) {
// // // //         copyBtnRef.current.classList.add("copied");
// // // //         copyBtnRef.current.textContent = "✓";
// // // //         setTimeout(() => {
// // // //           copyBtnRef.current.classList.remove("copied");
// // // //           copyBtnRef.current.textContent = "📋";
// // // //         }, 2000);
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("Failed to copy:", err);
// // // //     }
// // // //   };

// // // //   const statusLabel = {
// // // //     idle: "Ready",
// // // //     streaming: "Streaming…",
// // // //     done: "Done",
// // // //     error: "Failed",
// // // //   }[status];

// // // //   return (
// // // //     <div className="ew-window">
// // // //       {/* Window header */}
// // // //       <div className="ew-window-header">
// // // //         <div className="ew-window-info">
// // // //           <span className="ew-window-badge">{model.badge}</span>
// // // //           <div>
// // // //             <p className="ew-window-name">{model.label}</p>
// // // //             <p className="ew-window-meta">{model.meta}</p>
// // // //           </div>
// // // //         </div>
// // // //         <span
// // // //           className={`ew-window-status ${
// // // //             status === "streaming" ? "ew-streaming" : status === "error" ? "ew-error" : ""
// // // //           }`}
// // // //         >
// // // //           {statusLabel}
// // // //         </span>
// // // //       </div>

// // // //       {/* Window body */}
// // // //       <div className="ew-window-body">
// // // //         {status === "idle" && (
// // // //           <div className="ew-idle">
// // // //             <div className="ew-idle-orb">{model.badge}</div>
// // // //             <p>Waiting to start…</p>
// // // //           </div>
// // // //         )}
// // // //         {status === "streaming" && !content && (
// // // //           <div className="typing-indicator" style={{ padding: "8px 0" }}>
// // // //             <span /><span /><span />
// // // //           </div>
// // // //         )}
// // // //         {(status === "streaming" || status === "done") && content && (
// // // //           <div className="md ew-md">
// // // //             <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
// // // //             {status === "streaming" && <span className="cursor-blink">▍</span>}
// // // //           </div>
// // // //         )}
// // // //         {status === "error" && (
// // // //           <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>
// // // //             ❌ This model failed to respond.
// // // //           </p>
// // // //         )}
// // // //         <div ref={bottomRef} />
// // // //       </div>
      
// // // //       {content && status === "done" && (
// // // //         <button 
// // // //           ref={copyBtnRef}
// // // //           className="copy-btn" 
// // // //           onClick={handleCopy}
// // // //         >
// // // //           📋
// // // //         </button>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // // ─── Main EnsembleChat component ─────────────────────────────────────────────
// // // // export default function EnsembleChat() {
// // // //   const [input, setInput]           = useState("");
// // // //   const [phase, setPhase]           = useState("idle"); // idle | running | judging | done
// // // //   const [modelStates, setModelStates] = useState(
// // // //     Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "idle" }]))
// // // //   );
// // // //   const [finalAnswer, setFinalAnswer] = useState("");
// // // //   const [finalStreaming, setFinalStreaming] = useState(false);
// // // //   const [currentPrompt, setCurrentPrompt] = useState("");
// // // //   const abortRef = useRef(null);
// // // //   const textareaRef = useRef(null);
// // // //   const finalRef = useRef(null);
// // // //   const finalCopyBtnRef = useRef(null);

// // // //   useEffect(() => {
// // // //     if (finalAnswer) finalRef.current?.scrollIntoView({ behavior: "smooth" });
// // // //   }, [finalAnswer]);

// // // //   const updateModel = (key, patch) => {
// // // //     setModelStates(prev => ({
// // // //       ...prev,
// // // //       [key]: { ...prev[key], ...patch },
// // // //     }));
// // // //   };

// // // //   const handleRun = async () => {
// // // //     if (!input.trim() || phase === "running" || phase === "judging") return;

// // // //     const prompt = input.trim();
// // // //     setCurrentPrompt(prompt);
// // // //     setInput("");
// // // //     setFinalAnswer("");
// // // //     setFinalStreaming(false);
// // // //     setPhase("running");

// // // //     // Reset all windows
// // // //     setModelStates(
// // // //       Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "streaming" }]))
// // // //     );

// // // //     abortRef.current = new AbortController();
// // // //     const { signal } = abortRef.current;

// // // //     const candidates = [];

// // // //     // Run all 4 in parallel
// // // //     await Promise.allSettled(
// // // //       MODELS.map(model =>
// // // //         new Promise(resolve => {
// // // //           streamModel({
// // // //             message: prompt,
// // // //             model: model.key,
// // // //             signal,
// // // //             onChunk: token => {
// // // //               updateModel(model.key, prev => ({
// // // //                 content: (prev?.content || "") + token,
// // // //                 status: "streaming",
// // // //               }));
// // // //               // need functional update — use ref trick
// // // //               setModelStates(prev => ({
// // // //                 ...prev,
// // // //                 [model.key]: {
// // // //                   ...prev[model.key],
// // // //                   content: prev[model.key].content + token,
// // // //                   status: "streaming",
// // // //                 },
// // // //               }));
// // // //             },
// // // //             onDone: full => {
// // // //               setModelStates(prev => ({
// // // //                 ...prev,
// // // //                 [model.key]: { content: full, status: "done" },
// // // //               }));
// // // //               candidates.push({ model: model.label, output: full });
// // // //               resolve();
// // // //             },
// // // //             onError: () => {
// // // //               setModelStates(prev => ({
// // // //                 ...prev,
// // // //                 [model.key]: { ...prev[model.key], status: "error" },
// // // //               }));
// // // //               resolve();
// // // //             },
// // // //           });
// // // //         })
// // // //       )
// // // //     );

// // // //     if (candidates.length === 0) {
// // // //       setPhase("idle");
// // // //       return;
// // // //     }

// // // //     // Judge phase
// // // //     setPhase("judging");
// // // //     setFinalStreaming(true);

// // // //     try {
// // // //       const { reply } = await fetchJudge({ prompt, candidates });
// // // //       // Simulate streaming the final answer character by character
// // // //       let i = 0;
// // // //       const interval = setInterval(() => {
// // // //         if (i >= reply.length) {
// // // //           clearInterval(interval);
// // // //           setFinalStreaming(false);
// // // //           setPhase("done");
// // // //           return;
// // // //         }
// // // //         const chunk = reply.slice(0, i + 3); // reveal 3 chars at a time
// // // //         setFinalAnswer(chunk);
// // // //         i += 3;
// // // //       }, 12);
// // // //     } catch {
// // // //       setFinalAnswer("❌ Synthesis failed. Please try again.");
// // // //       setFinalStreaming(false);
// // // //       setPhase("done");
// // // //     }
// // // //   };

// // // //   const handleStop = () => {
// // // //     abortRef.current?.abort();
// // // //     setPhase("idle");
// // // //     MODELS.forEach(m => {
// // // //       setModelStates(prev => ({
// // // //         ...prev,
// // // //         [m.key]: { ...prev[m.key], status: prev[m.key].status === "streaming" ? "done" : prev[m.key].status },
// // // //       }));
// // // //     });
// // // //   };

// // // //   const handleKeyDown = e => {
// // // //     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRun(); }
// // // //   };

// // // //   const handleChange = e => {
// // // //     setInput(e.target.value);
// // // //     const ta = textareaRef.current;
// // // //     if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; }
// // // //   };

// // // //   const handleCopyFinal = async () => {
// // // //     try {
// // // //       await navigator.clipboard.writeText(finalAnswer || "");
// // // //       if (finalCopyBtnRef.current) {
// // // //         finalCopyBtnRef.current.classList.add("copied");
// // // //         finalCopyBtnRef.current.textContent = "✓";
// // // //         setTimeout(() => {
// // // //           finalCopyBtnRef.current.classList.remove("copied");
// // // //           finalCopyBtnRef.current.textContent = "📋";
// // // //         }, 2000);
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("Failed to copy:", err);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="ew-root">

// // // //       {/* ── Header ── */}
// // // //       <div className="ew-header">
// // // //         <div className="ew-header-left">
// // // //           <div className="ew-header-icon">✦</div>
// // // //           <div>
// // // //             <p className="ew-header-title">Ensemble Mode</p>
// // // //             <p className="ew-header-sub">All 4 models · Synthesized by Llama 3.3 70B</p>
// // // //           </div>
// // // //         </div>
// // // //         {phase === "running" && (
// // // //           <button className="ew-stop-btn" onClick={handleStop}>◼ Stop</button>
// // // //         )}
// // // //         {phase === "judging" && (
// // // //           <div className="ew-judging-badge">
// // // //             <span className="ew-pulse" />
// // // //             Synthesizing…
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* ── Current prompt ── */}
// // // //       {currentPrompt && (
// // // //         <div className="ew-prompt-bar">
// // // //           <span className="ew-prompt-label">Prompt</span>
// // // //           <span className="ew-prompt-text">"{currentPrompt}"</span>
// // // //         </div>
// // // //       )}

// // // //       {/* ── 2×2 Model Grid ── */}
// // // //       <div className="ew-grid">
// // // //         {MODELS.map(model => (
// // // //           <ModelWindow
// // // //             key={model.key}
// // // //             model={model}
// // // //             content={modelStates[model.key].content}
// // // //             status={modelStates[model.key].status}
// // // //           />
// // // //         ))}
// // // //       </div>

// // // //       {/* ── Final Synthesized Answer ── */}
// // // //       {(phase === "judging" || phase === "done") && (
// // // //         <div className="ew-final" ref={finalRef}>
// // // //           <div className="ew-final-header">
// // // //             <div className="ew-final-icon">🧬</div>
// // // //             <div>
// // // //               <p className="ew-final-title">Synthesized Answer</p>
// // // //               <p className="ew-final-sub">Best response · Judged by Llama 3.3 70B</p>
// // // //             </div>
// // // //             {finalStreaming && <span className="ew-pulse" style={{ marginLeft: "auto" }} />}
// // // //           </div>
// // // //           <div className="ew-final-body">
// // // //             {!finalAnswer && finalStreaming && (
// // // //               <div className="typing-indicator"><span /><span /><span /></div>
// // // //             )}
// // // //             {finalAnswer && (
// // // //               <div className="md">
// // // //                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{finalAnswer}</ReactMarkdown>
// // // //                 {finalStreaming && <span className="cursor-blink">▍</span>}
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //           {finalAnswer && !finalStreaming && (
// // // //             <button 
// // // //               ref={finalCopyBtnRef}
// // // //               className="copy-btn" 
// // // //               onClick={handleCopyFinal}
// // // //             >
// // // //               📋
// // // //             </button>
// // // //           )}
// // // //         </div>
// // // //       )}

// // // //       {/* ── Input ── */}
// // // //       <div className="ew-input-area">
// // // //         <div className={`ew-input-wrapper ${phase === "running" || phase === "judging" ? "ew-input-disabled" : ""}`}>
// // // //           <textarea
// // // //             ref={textareaRef}
// // // //             className="chat-textarea"
// // // //             placeholder="Ask all 4 models simultaneously…"
// // // //             value={input}
// // // //             onChange={handleChange}
// // // //             onKeyDown={handleKeyDown}
// // // //             disabled={phase === "running" || phase === "judging"}
// // // //             rows={1}
// // // //           />
// // // //           <div className="input-actions">
// // // //             {phase === "running" ? (
// // // //               <button className="stop-btn-inline" onClick={handleStop}>◼</button>
// // // //             ) : (
// // // //               <button
// // // //                 className="send-btn"
// // // //                 onClick={handleRun}
// // // //                 disabled={!input.trim() || phase === "judging"}
// // // //               >
// // // //                 ✦
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //         <p className="input-hint">
// // // //           Sends to all 4 models · Llama 3.3 70B synthesizes final answer
// // // //         </p>
// // // //       </div>

// // // //     </div>
// // // //   );
// // // // }


// // // // src/components/EnsembleChat.jsx
// // // import { useState, useRef, useEffect } from "react";
// // // import ReactMarkdown from "react-markdown";
// // // import remarkGfm from "remark-gfm";
// // // import { API_BASE } from "../config";

// // // const MODELS = [
// // //   { key: "groq-fast",   label: "GPT-OSS 20B",        badge: "⚡", meta: "Fast" },
// // //   { key: "groq-large",  label: "GPT-OSS 120B",       badge: "🧠", meta: "Advanced Reasoning" },
// // //   { key: "groq-qwen",   label: "Qwen 3.8 27B",       badge: "🔮", meta: "Preview" },
// // // ];

// // // // Stream a single model — returns full text via onChunk / onDone / onError
// // // async function streamModel({ message, model, onChunk, onDone, onError, signal }) {
// // //   try {
// // //     const res = await fetch(`${API_BASE}/stream`, {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify({ message, model }),
// // //       signal,
// // //     });

// // //     if (!res.ok) throw new Error(`HTTP ${res.status}`);

// // //     const reader = res.body.getReader();
// // //     const decoder = new TextDecoder();
// // //     let buffer = "";
// // //     let full = "";

// // //     while (true) {
// // //       const { done, value } = await reader.read();
// // //       if (done) break;
// // //       buffer += decoder.decode(value, { stream: true });
// // //       const lines = buffer.split("\n");
// // //       buffer = lines.pop();
// // //       for (const line of lines) {
// // //         if (!line.trim()) continue;
// // //         try {
// // //           const json = JSON.parse(line);
// // //           if (json.response) { full += json.response; onChunk(json.response); }
// // //           if (json.done)      { onDone(full); return; }
// // //           if (json.error)     { onError(json.error); return; }
// // //         } catch {}
// // //       }
// // //     }
// // //     onDone(full);
// // //   } catch (err) {
// // //     if (err.name !== "AbortError") onError(err.message);
// // //   }
// // // }

// // // // Call judge endpoint
// // // async function fetchJudge({ prompt, candidates }) {
// // //   const res = await fetch(`${API_BASE}/ensemble-judge`, {
// // //     method: "POST",
// // //     headers: { "Content-Type": "application/json" },
// // //     body: JSON.stringify({ prompt, candidates }),
// // //   });
// // //   if (!res.ok) throw new Error("Judge failed");
// // //   return res.json(); // { reply }
// // // }

// // // // ─── Individual model window ─────────────────────────────────────────────
// // // function ModelWindow({ model, content, status }) {
// // //   const bottomRef = useRef(null);
// // //   const copyBtnRef = useRef(null);

// // //   useEffect(() => {
// // //     if (status === "streaming") bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [content, status]);

// // //   const handleCopy = async () => {
// // //     try {
// // //       await navigator.clipboard.writeText(content || "");
// // //       if (copyBtnRef.current) {
// // //         copyBtnRef.current.classList.add("copied");
// // //         copyBtnRef.current.textContent = "✓";
// // //         setTimeout(() => {
// // //           copyBtnRef.current.classList.remove("copied");
// // //           copyBtnRef.current.textContent = "📋";
// // //         }, 2000);
// // //       }
// // //     } catch (err) {
// // //       console.error("Failed to copy:", err);
// // //     }
// // //   };

// // //   const statusLabel = {
// // //     idle: "Ready",
// // //     streaming: "Streaming…",
// // //     done: "Done",
// // //     error: "Failed",
// // //   }[status];

// // //   return (
// // //     <div className="ew-window">
// // //       {/* Window header */}
// // //       <div className="ew-window-header">
// // //         <div className="ew-window-info">
// // //           <span className="ew-window-badge">{model.badge}</span>
// // //           <div>
// // //             <p className="ew-window-name">{model.label}</p>
// // //             <p className="ew-window-meta">{model.meta}</p>
// // //           </div>
// // //         </div>
// // //         <span
// // //           className={`ew-window-status ${
// // //             status === "streaming" ? "ew-streaming" : status === "error" ? "ew-error" : ""
// // //           }`}
// // //         >
// // //           {statusLabel}
// // //         </span>
// // //       </div>

// // //       {/* Window body */}
// // //       <div className="ew-window-body">
// // //         {status === "idle" && (
// // //           <div className="ew-idle">
// // //             <div className="ew-idle-orb">{model.badge}</div>
// // //             <p>Waiting to start…</p>
// // //           </div>
// // //         )}
// // //         {status === "streaming" && !content && (
// // //           <div className="typing-indicator" style={{ padding: "8px 0" }}>
// // //             <span /><span /><span />
// // //           </div>
// // //         )}
// // //         {(status === "streaming" || status === "done") && content && (
// // //           <div className="md ew-md">
// // //             <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
// // //             {status === "streaming" && <span className="cursor-blink">▍</span>}
// // //           </div>
// // //         )}
// // //         {status === "error" && (
// // //           <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>
// // //             ❌ This model failed to respond.
// // //           </p>
// // //         )}
// // //         <div ref={bottomRef} />
// // //       </div>
      
// // //       {content && status === "done" && (
// // //         <button 
// // //           ref={copyBtnRef}
// // //           className="copy-btn" 
// // //           onClick={handleCopy}
// // //         >
// // //           📋
// // //         </button>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ─── Main EnsembleChat component ─────────────────────────────────────────────
// // // export default function EnsembleChat() {
// // //   const [input, setInput]           = useState("");
// // //   const [phase, setPhase]           = useState("idle"); // idle | running | judging | done
// // //   const [modelStates, setModelStates] = useState(
// // //     Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "idle" }]))
// // //   );
// // //   const [finalAnswer, setFinalAnswer] = useState("");
// // //   const [finalStreaming, setFinalStreaming] = useState(false);
// // //   const [currentPrompt, setCurrentPrompt] = useState("");
// // //   const [synthExpanded, setSynthExpanded] = useState(false);
// // //   const abortRef = useRef(null);
// // //   const textareaRef = useRef(null);
// // //   const finalRef = useRef(null);
// // //   const finalCopyBtnRef = useRef(null);

// // //   useEffect(() => {
// // //     if (finalAnswer) finalRef.current?.scrollIntoView({ behavior: "smooth" });
// // //   }, [finalAnswer]);

// // //   const updateModel = (key, patch) => {
// // //     setModelStates(prev => ({
// // //       ...prev,
// // //       [key]: { ...prev[key], ...patch },
// // //     }));
// // //   };

// // //   const handleRun = async () => {
// // //     if (!input.trim() || phase === "running" || phase === "judging") return;

// // //     const prompt = input.trim();
// // //     setCurrentPrompt(prompt);
// // //     setInput("");
// // //     setFinalAnswer("");
// // //     setFinalStreaming(false);
// // //     setPhase("running");

// // //     // Reset all windows
// // //     setModelStates(
// // //       Object.fromEntries(MODELS.map(m => [m.key, { content: "", status: "streaming" }]))
// // //     );

// // //     abortRef.current = new AbortController();
// // //     const { signal } = abortRef.current;

// // //     const candidates = [];

// // //     // Run all 4 in parallel
// // //     await Promise.allSettled(
// // //       MODELS.map(model =>
// // //         new Promise(resolve => {
// // //           streamModel({
// // //             message: prompt,
// // //             model: model.key,
// // //             signal,
// // //             onChunk: token => {
// // //               updateModel(model.key, prev => ({
// // //                 content: (prev?.content || "") + token,
// // //                 status: "streaming",
// // //               }));
// // //               // need functional update — use ref trick
// // //               setModelStates(prev => ({
// // //                 ...prev,
// // //                 [model.key]: {
// // //                   ...prev[model.key],
// // //                   content: prev[model.key].content + token,
// // //                   status: "streaming",
// // //                 },
// // //               }));
// // //             },
// // //             onDone: full => {
// // //               setModelStates(prev => ({
// // //                 ...prev,
// // //                 [model.key]: { content: full, status: "done" },
// // //               }));
// // //               candidates.push({ model: model.label, output: full });
// // //               resolve();
// // //             },
// // //             onError: () => {
// // //               setModelStates(prev => ({
// // //                 ...prev,
// // //                 [model.key]: { ...prev[model.key], status: "error" },
// // //               }));
// // //               resolve();
// // //             },
// // //           });
// // //         })
// // //       )
// // //     );

// // //     if (candidates.length === 0) {
// // //       setPhase("idle");
// // //       return;
// // //     }

// // //     // Judge phase
// // //     setPhase("judging");
// // //     setFinalStreaming(true);

// // //     try {
// // //       const { reply } = await fetchJudge({ prompt, candidates });
// // //       // Simulate streaming the final answer character by character
// // //       let i = 0;
// // //       const interval = setInterval(() => {
// // //         if (i >= reply.length) {
// // //           clearInterval(interval);
// // //           setFinalStreaming(false);
// // //           setPhase("done");
// // //           return;
// // //         }
// // //         const chunk = reply.slice(0, i + 3); // reveal 3 chars at a time
// // //         setFinalAnswer(chunk);
// // //         i += 3;
// // //       }, 12);
// // //     } catch {
// // //       setFinalAnswer("❌ Synthesis failed. Please try again.");
// // //       setFinalStreaming(false);
// // //       setPhase("done");
// // //     }
// // //   };

// // //   const handleStop = () => {
// // //     abortRef.current?.abort();
// // //     setPhase("idle");
// // //     MODELS.forEach(m => {
// // //       setModelStates(prev => ({
// // //         ...prev,
// // //         [m.key]: { ...prev[m.key], status: prev[m.key].status === "streaming" ? "done" : prev[m.key].status },
// // //       }));
// // //     });
// // //   };

// // //   const handleKeyDown = e => {
// // //     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleRun(); }
// // //   };

// // //   const handleChange = e => {
// // //     setInput(e.target.value);
// // //     const ta = textareaRef.current;
// // //     if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; }
// // //   };

// // //   const handleToggleExpand = () => {
// // //     console.log('Toggle expand:', !synthExpanded);
// // //     setSynthExpanded(!synthExpanded);
// // //   };

// // //   const handleCopyFinal = async () => {
// // //     try {
// // //       await navigator.clipboard.writeText(finalAnswer || "");
// // //       if (finalCopyBtnRef.current) {
// // //         finalCopyBtnRef.current.classList.add("copied");
// // //         finalCopyBtnRef.current.textContent = "✓";
// // //         setTimeout(() => {
// // //           finalCopyBtnRef.current.classList.remove("copied");
// // //           finalCopyBtnRef.current.textContent = "📋";
// // //         }, 2000);
// // //       }
// // //     } catch (err) {
// // //       console.error("Failed to copy:", err);
// // //     }
// // //   };

// // //   return (
// // //     <div className="ew-root">

// // //       {/* ── Header ── */}
// // //       <div className="ew-header">
// // //         <div className="ew-header-left">
// // //           <div className="ew-header-icon">✦</div>
// // //           <div>
// // //             <p className="ew-header-title">Ensemble Mode</p>
// // //             <p className="ew-header-sub">All 3 models · Synthesized by GPT-OSS 120B</p>
// // //           </div>
// // //         </div>
// // //         {phase === "running" && (
// // //           <button className="ew-stop-btn" onClick={handleStop}>◼ Stop</button>
// // //         )}
// // //         {phase === "judging" && (
// // //           <div className="ew-judging-badge">
// // //             <span className="ew-pulse" />
// // //             Synthesizing…
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* ── Current prompt ── */}
// // //       {currentPrompt && (
// // //         <div className="ew-prompt-bar">
// // //           <span className="ew-prompt-label">Prompt</span>
// // //           <span className="ew-prompt-text">"{currentPrompt}"</span>
// // //         </div>
// // //       )}

// // //       {/* ── 2×2 Model Grid ── */}
// // //       <div className="ew-grid">
// // //         {MODELS.map(model => (
// // //           <ModelWindow
// // //             key={model.key}
// // //             model={model}
// // //             content={modelStates[model.key].content}
// // //             status={modelStates[model.key].status}
// // //           />
// // //         ))}
// // //       </div>

// // //       {/* ── Final Synthesized Answer ── */}
// // //       {(phase === "judging" || phase === "done") && (
// // //         <div 
// // //           className={`ew-final ${synthExpanded ? "expanded" : ""}`} 
// // //           ref={finalRef}
// // //           style={{
// // //             maxHeight: synthExpanded ? '80vh' : '120px',
// // //             transition: 'all 0.3s ease-out'
// // //           }}
// // //         >
// // //           <div className="ew-final-header">
// // //             <div className="ew-final-icon">🧬</div>
// // //             <div>
// // //               <p className="ew-final-title">Synthesized Answer</p>
// // //               <p className="ew-final-sub">Best response · Judged by GPT-OSS 120B</p>
// // //             </div>
// // //             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// // //             <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
// // //               <button 
// // //                 className="expand-btn"
// // //                 onClick={handleToggleExpand}
// // //                 title={synthExpanded ? "Collapse" : "Expand"}
// // //               >
// // //                 {synthExpanded ? "▼" : "▲"}
// // //               </button>
// // //               {finalStreaming && <span className="ew-pulse" />}
// // //             </div>
// // //             {finalAnswer && !finalStreaming && (
// // //               <button 
// // //                 ref={finalCopyBtnRef}
// // //                 className="copy-btn" 
// // //                 onClick={handleCopyFinal}
// // //               >
// // //                 📋
// // //               </button>
// // //             )}
// // //           </div>
// // //           </div>
// // //           <div className="ew-final-body">
// // //             {!finalAnswer && finalStreaming && (
// // //               <div className="typing-indicator"><span /><span /><span /></div>
// // //             )}
// // //             {finalAnswer && (
// // //               <div className="md">
// // //                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{finalAnswer}</ReactMarkdown>
// // //                 {finalStreaming && <span className="cursor-blink">▍</span>}
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* ── Input ── */}
// // //       <div className="ew-input-area">
// // //         <div className={`ew-input-wrapper ${phase === "running" || phase === "judging" ? "ew-input-disabled" : ""}`}>
// // //           <textarea
// // //             ref={textareaRef}
// // //             className="chat-textarea"
// // //             placeholder="Ask all 4 models simultaneously…"
// // //             value={input}
// // //             onChange={handleChange}
// // //             onKeyDown={handleKeyDown}
// // //             disabled={phase === "running" || phase === "judging"}
// // //             rows={1}
// // //           />
// // //           <div className="input-actions">
// // //             {phase === "running" ? (
// // //               <button className="stop-btn-inline" onClick={handleStop}>◼</button>
// // //             ) : (
// // //               <button
// // //                 className="send-btn"
// // //                 onClick={handleRun}
// // //                 disabled={!input.trim() || phase === "judging"}
// // //               >
// // //                 ✦
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>
// // //         <p className="input-hint">
// // //           Sends to all 3 models · GPT-OSS 120B synthesizes final answer
// // //         </p>
// // //       </div>

// // //     </div>
// // //   );
// // // }



// // import { useState, useRef, useEffect } from "react";
// // import ReactMarkdown from "react-markdown";
// // import remarkGfm from "remark-gfm";
// // import { API_BASE } from "../config";
// // import { ensureGuestSession } from "../services/api";

// // const MODELS = [
// //   {
// //     key: "groq-fast",
// //     label: "GPT-OSS 20B",
// //     badge: "⚡",
// //     meta: "Fast",
// //   },
// //   {
// //     key: "groq-large",
// //     label: "GPT-OSS 120B",
// //     badge: "🧠",
// //     meta: "Advanced Reasoning",
// //   },
// //   {
// //     key: "groq-qwen",
// //     label: "Qwen 3.8 27B",
// //     badge: "🔮",
// //     meta: "Preview",
// //   },
// // ];

// // // ================= STREAM INDIVIDUAL MODEL =================

// // async function streamModel({
// //   message,
// //   model,
// //   sessionId,
// //   onChunk,
// //   onDone,
// //   onError,
// //   signal,
// // }) {
// //   let fullResponse = "";
// //   let completed = false;

// //   try {
// //     const res = await fetch(`${API_BASE}/stream`, {
// //       method: "POST",
// //       credentials: "include",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({
// //         message,
// //         model,
// //         sessionId,

// //         // Individual ensemble candidates are not
// //         // persisted separately. The judge saves the final conversation.
// //         persist: false,
// //       }),
// //       signal,
// //     });

// //     if (!res.ok) {
// //       const errorText = await res.text();
// //       throw new Error(errorText || `HTTP ${res.status}`);
// //     }

// //     if (!res.body) {
// //       throw new Error("Streaming response is unavailable.");
// //     }

// //     const reader = res.body.getReader();
// //     const decoder = new TextDecoder();

// //     let buffer = "";

// //     const processLine = (line) => {
// //       if (!line.trim()) return;

// //       const data = JSON.parse(line);

// //       if (data.error) {
// //         throw new Error(data.error);
// //       }

// //       // Process token-by-token responses.
// //       if (typeof data.token === "string" && data.token) {
// //         fullResponse += data.token;
// //         onChunk?.(data.token);
// //       }

// //       // Support final-response-only payloads as well.
// //       if (data.done) {
// //         if (!fullResponse && typeof data.response === "string") {
// //           fullResponse = data.response;
// //           onChunk?.(data.response);
// //         }

// //         completed = true;
// //         onDone?.(fullResponse);
// //       }
// //     };

// //     while (true) {
// //       if (signal?.aborted) break;

// //       const { done, value } = await reader.read();

// //       if (done) break;

// //       buffer += decoder.decode(value, {
// //         stream: true,
// //       });

// //       const lines = buffer.split("\n");
// //       buffer = lines.pop() || "";

// //       for (const line of lines) {
// //         processLine(line);
// //       }
// //     }

// //     // Process any remaining decoder output.
// //     buffer += decoder.decode();

// //     if (buffer.trim() && !signal?.aborted) {
// //       processLine(buffer);
// //     }

// //     if (signal?.aborted) {
// //       return null;
// //     }

// //     // Handle servers that close without sending a done event.
// //     if (!completed) {
// //       completed = true;
// //       onDone?.(fullResponse);
// //     }

// //     return fullResponse;

// //   } catch (error) {
// //     if (error.name === "AbortError" || signal?.aborted) {
// //       return null;
// //     }

// //     onError?.(error.message);

// //     return null;
// //   }
// // }

// // // ================= ENSEMBLE JUDGE =================

// // async function fetchJudge({
// //   prompt,
// //   candidates,
// //   sessionId,
// //   signal,
// // }) {
// //   const res = await fetch(`${API_BASE}/ensemble-judge`, {
// //     method: "POST",
// //     credentials: "include",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({
// //       prompt,
// //       candidates,
// //       sessionId,
// //     }),
// //     signal,
// //   });

// //   if (!res.ok) {
// //     const errorText = await res.text();
// //     throw new Error(errorText || "Ensemble synthesis failed");
// //   }

// //   return res.json();
// // }

// // // ================= INDIVIDUAL MODEL WINDOW =================

// // function ModelWindow({ model, content, status }) {
// //   const bottomRef = useRef(null);
// //   const copyBtnRef = useRef(null);
// //   const copyTimeoutRef = useRef(null);

// //   useEffect(() => {
// //     if (status === "streaming") {
// //       bottomRef.current?.scrollIntoView({
// //         behavior: "smooth",
// //       });
// //     }
// //   }, [content, status]);

// //   useEffect(() => {
// //     return () => {
// //       clearTimeout(copyTimeoutRef.current);
// //     };
// //   }, []);

// //   const handleCopy = async () => {
// //     try {
// //       await navigator.clipboard.writeText(content || "");

// //       if (copyBtnRef.current) {
// //         copyBtnRef.current.classList.add("copied");
// //         copyBtnRef.current.textContent = "✓";

// //         clearTimeout(copyTimeoutRef.current);

// //         copyTimeoutRef.current = setTimeout(() => {
// //           if (copyBtnRef.current) {
// //             copyBtnRef.current.classList.remove("copied");
// //             copyBtnRef.current.textContent = "📋";
// //           }
// //         }, 2000);
// //       }
// //     } catch (error) {
// //       console.error("Failed to copy:", error);
// //     }
// //   };

// //   const statusLabel = {
// //     idle: "Ready",
// //     streaming: "Streaming…",
// //     done: "Done",
// //     error: "Failed",
// //   }[status];

// //   return (
// //     <div className="ew-window">

// //       {/* Window header */}

// //       <div className="ew-window-header">

// //         <div className="ew-window-info">

// //           <span className="ew-window-badge">
// //             {model.badge}
// //           </span>

// //           <div>
// //             <p className="ew-window-name">
// //               {model.label}
// //             </p>

// //             <p className="ew-window-meta">
// //               {model.meta}
// //             </p>
// //           </div>

// //         </div>

// //         <span
// //           className={`ew-window-status ${
// //             status === "streaming"
// //               ? "ew-streaming"
// //               : status === "error"
// //                 ? "ew-error"
// //                 : ""
// //           }`}
// //         >
// //           {statusLabel}
// //         </span>

// //       </div>

// //       {/* Window body */}

// //       <div className="ew-window-body">

// //         {status === "idle" && (
// //           <div className="ew-idle">
// //             <div className="ew-idle-orb">
// //               {model.badge}
// //             </div>

// //             <p>Waiting to start…</p>
// //           </div>
// //         )}

// //         {status === "streaming" && !content && (
// //           <div
// //             className="typing-indicator"
// //             style={{ padding: "8px 0" }}
// //           >
// //             <span />
// //             <span />
// //             <span />
// //           </div>
// //         )}

// //         {(status === "streaming" || status === "done") &&
// //           content && (
// //             <div className="md ew-md">

// //               <ReactMarkdown remarkPlugins={[remarkGfm]}>
// //                 {content}
// //               </ReactMarkdown>

// //               {status === "streaming" && (
// //                 <span className="cursor-blink">▍</span>
// //               )}

// //             </div>
// //           )}

// //         {status === "error" && (
// //           <p
// //             style={{
// //               color: "var(--danger)",
// //               fontSize: "0.82rem",
// //             }}
// //           >
// //             ❌ This model failed to respond.
// //           </p>
// //         )}

// //         <div ref={bottomRef} />

// //       </div>

// //       {content && status === "done" && (
// //         <button
// //           ref={copyBtnRef}
// //           className="copy-btn"
// //           onClick={handleCopy}
// //         >
// //           📋
// //         </button>
// //       )}

// //     </div>
// //   );
// // }

// // // ================= MAIN ENSEMBLE CHAT =================

// // export default function EnsembleChat({ sessionId }) {
// //   const [input, setInput] = useState("");
// //   const [phase, setPhase] = useState("idle");

// //   const [modelStates, setModelStates] = useState(
// //     Object.fromEntries(
// //       MODELS.map((model) => [
// //         model.key,
// //         {
// //           content: "",
// //           status: "idle",
// //         },
// //       ])
// //     )
// //   );

// //   const [finalAnswer, setFinalAnswer] = useState("");
// //   const [finalStreaming, setFinalStreaming] = useState(false);
// //   const [currentPrompt, setCurrentPrompt] = useState("");
// //   const [synthExpanded, setSynthExpanded] = useState(false);

// //   const abortRef = useRef(null);
// //   const textareaRef = useRef(null);
// //   const finalRef = useRef(null);
// //   const finalCopyBtnRef = useRef(null);
// //   const finalIntervalRef = useRef(null);
// //   const finalCopyTimeoutRef = useRef(null);
// //   const runIdRef = useRef(0);

// //   useEffect(() => {
// //     if (finalAnswer) {
// //       finalRef.current?.scrollIntoView({
// //         behavior: "smooth",
// //       });
// //     }
// //   }, [finalAnswer]);

// //   // Clean up active requests and timers when leaving Ensemble Mode.
// //   useEffect(() => {
// //     return () => {
// //       runIdRef.current += 1;

// //       abortRef.current?.abort();

// //       clearInterval(finalIntervalRef.current);
// //       clearTimeout(finalCopyTimeoutRef.current);
// //     };
// //   }, []);

// //   // Update individual model window.
// //   const updateModel = (key, patch) => {
// //     setModelStates((previous) => ({
// //       ...previous,
// //       [key]: {
// //         ...previous[key],
// //         ...patch,
// //       },
// //     }));
// //   };

// //   // ================= RUN ENSEMBLE =================

// //   const handleRun = async () => {
// //     if (
// //       !input.trim() ||
// //       phase === "running" ||
// //       phase === "judging"
// //     ) {
// //       return;
// //     }

// //     if (!sessionId) {
// //       setFinalAnswer("❌ Conversation session is unavailable. Start a new conversation.");
// //       setPhase("done");
// //       return;
// //     }

// //     const prompt = input.trim();
// //     const runId = ++runIdRef.current;

// //     setCurrentPrompt(prompt);
// //     setInput("");
// //     setFinalAnswer("");
// //     setFinalStreaming(false);
// //     setSynthExpanded(false);

// //     clearInterval(finalIntervalRef.current);

// //     setPhase("running");

// //     // Reset all model windows.
// //     setModelStates(
// //       Object.fromEntries(
// //         MODELS.map((model) => [
// //           model.key,
// //           {
// //             content: "",
// //             status: "streaming",
// //           },
// //         ])
// //       )
// //     );

// //     const controller = new AbortController();

// //     abortRef.current = controller;

// //     const { signal } = controller;

// //     try {
// //       // Establish the guest cookie before parallel requests.
// //       // This prevents simultaneous first requests from creating
// //       // different guest identities.
// //       await ensureGuestSession();

// //       if (signal.aborted || runId !== runIdRef.current) {
// //         return;
// //       }

// //       // Run all three models concurrently.
// //       const results = await Promise.all(
// //         MODELS.map(async (model) => {
// //           const output = await streamModel({
// //             message: prompt,
// //             model: model.key,
// //             sessionId,
// //             signal,

// //             onChunk: (token) => {
// //               if (runId !== runIdRef.current) return;

// //               setModelStates((previous) => ({
// //                 ...previous,
// //                 [model.key]: {
// //                   ...previous[model.key],
// //                   content: previous[model.key].content + token,
// //                   status: "streaming",
// //                 },
// //               }));
// //             },

// //             onDone: (full) => {
// //               if (runId !== runIdRef.current) return;

// //               updateModel(model.key, {
// //                 content: full,
// //                 status: "done",
// //               });
// //             },

// //             onError: (error) => {
// //               if (runId !== runIdRef.current) return;

// //               console.error(
// //                 `${model.label} failed:`,
// //                 error
// //               );

// //               updateModel(model.key, {
// //                 status: "error",
// //               });
// //             },
// //           });

// //           if (!output?.trim()) return null;

// //           return {
// //             model: model.label,
// //             output,
// //           };
// //         })
// //       );

// //       if (signal.aborted || runId !== runIdRef.current) {
// //         return;
// //       }

// //       const candidates = results.filter(Boolean);

// //       // No models returned a usable response.
// //       if (candidates.length === 0) {
// //         setFinalAnswer(
// //           "❌ All models failed to respond. Please try again."
// //         );

// //         setFinalStreaming(false);
// //         setPhase("done");

// //         return;
// //       }

// //       // ================= JUDGE PHASE =================

// //       setPhase("judging");
// //       setFinalStreaming(true);

// //       const result = await fetchJudge({
// //         prompt,
// //         candidates,
// //         sessionId,
// //         signal,
// //       });

// //       if (signal.aborted || runId !== runIdRef.current) {
// //         return;
// //       }

// //       const reply = result.reply;

// //       if (!reply || typeof reply !== "string") {
// //         throw new Error("The judge returned an empty response.");
// //       }

// //       // Preserve the existing animated final-answer effect.
// //       let index = 0;

// //       finalIntervalRef.current = setInterval(() => {
// //         if (runId !== runIdRef.current) {
// //           clearInterval(finalIntervalRef.current);
// //           return;
// //         }

// //         if (index >= reply.length) {
// //           clearInterval(finalIntervalRef.current);
// //           finalIntervalRef.current = null;

// //           setFinalStreaming(false);
// //           setPhase("done");

// //           return;
// //         }

// //         const chunk = reply.slice(0, index + 3);

// //         setFinalAnswer(chunk);

// //         index += 3;
// //       }, 12);

// //     } catch (error) {
// //       if (error.name === "AbortError" || signal.aborted) {
// //         return;
// //       }

// //       console.error("Ensemble error:", error);

// //       if (runId === runIdRef.current) {
// //         setFinalAnswer(
// //           `❌ Synthesis failed: ${error.message}`
// //         );

// //         setFinalStreaming(false);
// //         setPhase("done");
// //       }

// //     } finally {
// //       if (runId === runIdRef.current && !finalIntervalRef.current) {
// //         abortRef.current = null;
// //       }
// //     }
// //   };

// //   // ================= STOP ENSEMBLE =================

// //   const handleStop = () => {
// //     runIdRef.current += 1;

// //     abortRef.current?.abort();
// //     abortRef.current = null;

// //     clearInterval(finalIntervalRef.current);
// //     finalIntervalRef.current = null;

// //     // Preserve the partial response, if one exists.
// //     setModelStates((previous) => {
// //       const updated = {};

// //       for (const model of MODELS) {
// //         const current = previous[model.key];

// //         updated[model.key] = {
// //           ...current,
// //           status:
// //             current.status === "streaming"
// //               ? "done"
// //               : current.status,
// //         };
// //       }

// //       return updated;
// //     });

// //     setFinalStreaming(false);

// //     setPhase(
// //       finalAnswer ? "done" : "idle"
// //     );
// //   };

// //   // ================= KEYBOARD HANDLING =================

// //   const handleKeyDown = (event) => {
// //     if (event.key === "Enter" && !event.shiftKey) {
// //       event.preventDefault();
// //       handleRun();
// //     }
// //   };

// //   const handleChange = (event) => {
// //     setInput(event.target.value);

// //     const textarea = textareaRef.current;

// //     if (textarea) {
// //       textarea.style.height = "auto";

// //       textarea.style.height =
// //         Math.min(textarea.scrollHeight, 160) + "px";
// //     }
// //   };

// //   // ================= EXPAND FINAL ANSWER =================

// //   const handleToggleExpand = () => {
// //     setSynthExpanded((previous) => !previous);
// //   };

// //   // ================= COPY FINAL ANSWER =================

// //   const handleCopyFinal = async () => {
// //     try {
// //       await navigator.clipboard.writeText(
// //         finalAnswer || ""
// //       );

// //       if (finalCopyBtnRef.current) {
// //         finalCopyBtnRef.current.classList.add("copied");
// //         finalCopyBtnRef.current.textContent = "✓";

// //         clearTimeout(finalCopyTimeoutRef.current);

// //         finalCopyTimeoutRef.current = setTimeout(() => {
// //           if (finalCopyBtnRef.current) {
// //             finalCopyBtnRef.current.classList.remove("copied");
// //             finalCopyBtnRef.current.textContent = "📋";
// //           }
// //         }, 2000);
// //       }

// //     } catch (error) {
// //       console.error("Failed to copy:", error);
// //     }
// //   };

// //   // ================= RENDER =================

// //   return (
// //     <div className="ew-root">

// //       {/* ── Header ── */}

// //       <div className="ew-header">

// //         <div className="ew-header-left">

// //           <div className="ew-header-icon">✦</div>

// //           <div>
// //             <p className="ew-header-title">
// //               Ensemble Mode
// //             </p>

// //             <p className="ew-header-sub">
// //               All 3 models · Synthesized by GPT-OSS 120B
// //             </p>
// //           </div>

// //         </div>

// //         {(phase === "running" || phase === "judging") && (
// //           <button
// //             className="ew-stop-btn"
// //             onClick={handleStop}
// //           >
// //             ◼ Stop
// //           </button>
// //         )}

// //         {phase === "judging" && (
// //           <div className="ew-judging-badge">
// //             <span className="ew-pulse" />
// //             Synthesizing…
// //           </div>
// //         )}

// //       </div>

// //       {/* ── Current prompt ── */}

// //       {currentPrompt && (
// //         <div className="ew-prompt-bar">

// //           <span className="ew-prompt-label">
// //             Prompt
// //           </span>

// //           <span className="ew-prompt-text">
// //             "{currentPrompt}"
// //           </span>

// //         </div>
// //       )}

// //       {/* ── Model Grid ── */}

// //       <div className="ew-grid">

// //         {MODELS.map((model) => (
// //           <ModelWindow
// //             key={model.key}
// //             model={model}
// //             content={modelStates[model.key].content}
// //             status={modelStates[model.key].status}
// //           />
// //         ))}

// //       </div>

// //       {/* ── Final Synthesized Answer ── */}

// //       {(phase === "judging" || phase === "done") && (

// //         <div
// //           className={`ew-final ${
// //             synthExpanded ? "expanded" : ""
// //           }`}
// //           ref={finalRef}
// //           style={{
// //             maxHeight: synthExpanded ? "80vh" : "120px",
// //             transition: "all 0.3s ease-out",
// //           }}
// //         >

// //           <div className="ew-final-header">

// //             <div className="ew-final-icon">
// //               🧬
// //             </div>

// //             <div>
// //               <p className="ew-final-title">
// //                 Synthesized Answer
// //               </p>

// //               <p className="ew-final-sub">
// //                 Best response · Judged by GPT-OSS 120B
// //               </p>
// //             </div>

// //             <div
// //               style={{
// //                 display: "flex",
// //                 justifyContent: "space-between",
// //                 alignItems: "center",
// //               }}
// //             >

// //               <div
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   gap: "12px",
// //                 }}
// //               >

// //                 <button
// //                   className="expand-btn"
// //                   onClick={handleToggleExpand}
// //                   title={synthExpanded ? "Collapse" : "Expand"}
// //                 >
// //                   {synthExpanded ? "▼" : "▲"}
// //                 </button>

// //                 {finalStreaming && (
// //                   <span className="ew-pulse" />
// //                 )}

// //               </div>

// //               {finalAnswer && !finalStreaming && (
// //                 <button
// //                   ref={finalCopyBtnRef}
// //                   className="copy-btn"
// //                   onClick={handleCopyFinal}
// //                 >
// //                   📋
// //                 </button>
// //               )}

// //             </div>

// //           </div>

// //           <div className="ew-final-body">

// //             {!finalAnswer && finalStreaming && (
// //               <div className="typing-indicator">
// //                 <span />
// //                 <span />
// //                 <span />
// //               </div>
// //             )}

// //             {finalAnswer && (
// //               <div className="md">

// //                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
// //                   {finalAnswer}
// //                 </ReactMarkdown>

// //                 {finalStreaming && (
// //                   <span className="cursor-blink">▍</span>
// //                 )}

// //               </div>
// //             )}

// //           </div>

// //         </div>

// //       )}

// //       {/* ── Input ── */}

// //       <div className="ew-input-area">

// //         <div
// //           className={`ew-input-wrapper ${
// //             phase === "running" || phase === "judging"
// //               ? "ew-input-disabled"
// //               : ""
// //           }`}
// //         >

// //           <textarea
// //             ref={textareaRef}
// //             className="chat-textarea"
// //             placeholder="Ask all 3 models simultaneously…"
// //             value={input}
// //             onChange={handleChange}
// //             onKeyDown={handleKeyDown}
// //             disabled={
// //               phase === "running" || phase === "judging"
// //             }
// //             rows={1}
// //           />

// //           <div className="input-actions">

// //             {phase === "running" ? (

// //               <button
// //                 className="stop-btn-inline"
// //                 onClick={handleStop}
// //               >
// //                 ◼
// //               </button>

// //             ) : (

// //               <button
// //                 className="send-btn"
// //                 onClick={handleRun}
// //                 disabled={
// //                   !input.trim() || phase === "judging"
// //                 }
// //               >
// //                 ✦
// //               </button>

// //             )}

// //           </div>

// //         </div>

// //         <p className="input-hint">
// //           Sends to all 3 models · GPT-OSS 120B synthesizes final answer
// //         </p>

// //       </div>

// //     </div>
// //   );
// // }

// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { API_BASE } from "../config";
// import { ensureGuestSession } from "../services/api";

// // These IDs must match the active model IDs exposed by GET /api/models.
// const MODELS = [
//   {
//     key: "groq-fast",
//     label: "GPT-OSS 20B",
//     badge: "⚡",
//     meta: "Groq · Fast",
//   },
//   {
//     key: "groq-large",
//     label: "GPT-OSS 120B",
//     badge: "🧠",
//     meta: "Groq · Advanced Reasoning",
//   },
//   {
//     key: "cloudflare-gemma",
//     label: "Gemma 4 26B A4B",
//     badge: "💎",
//     meta: "Cloudflare · General Reasoning",
//   },
//   {
//     key: "cloudflare-glm",
//     label: "GLM 4.7 Flash",
//     badge: "✨",
//     meta: "Cloudflare · Fast Reasoning",
//   },
// ];

// function createInitialModelStates(status = "idle") {
//   return Object.fromEntries(
//     MODELS.map((model) => [
//       model.key,
//       {
//         content: "",
//         status,
//       },
//     ])
//   );
// }

// // ================= STREAM INDIVIDUAL MODEL =================

// async function streamModel({
//   message,
//   model,
//   sessionId,
//   onChunk,
//   onDone,
//   onError,
//   signal,
// }) {
//   let fullResponse = "";
//   let completed = false;
//   let reader;

//   try {
//     const res = await fetch(`${API_BASE}/stream`, {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         message,
//         model,
//         sessionId,
//         // Candidate answers are not stored individually. The judge endpoint
//         // is responsible for saving the prompt and final synthesized answer.
//         persist: false,
//       }),
//       signal,
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(errorText || `HTTP ${res.status}`);
//     }

//     if (!res.body) {
//       throw new Error("Streaming response is unavailable.");
//     }

//     reader = res.body.getReader();
//     const decoder = new TextDecoder();
//     let buffer = "";

//     const processLine = (rawLine) => {
//       let line = rawLine.trim();
//       if (!line) return;

//       // Accept both the project's NDJSON format and standard SSE data lines.
//       if (line.startsWith("data:")) {
//         line = line.slice(5).trim();
//       }
//       if (!line || line === "[DONE]") return;

//       const data = JSON.parse(line);

//       if (data.error) {
//         throw new Error(data.error);
//       }

//       if (typeof data.token === "string" && data.token) {
//         fullResponse += data.token;
//         onChunk?.(data.token);
//       }

//       if (data.done) {
//         // Support a server that sends the complete response only in its done
//         // event, as well as the normal token-by-token stream.
//         if (!fullResponse && typeof data.response === "string") {
//           fullResponse = data.response;
//           if (fullResponse) onChunk?.(fullResponse);
//         }

//         completed = true;
//         onDone?.(fullResponse);
//       }
//     };

//     while (true) {
//       if (signal?.aborted) break;

//       const { done, value } = await reader.read();
//       if (done) break;

//       buffer += decoder.decode(value, { stream: true });
//       const lines = buffer.split("\n");
//       buffer = lines.pop() || "";

//       for (const line of lines) {
//         processLine(line);
//       }
//     }

//     buffer += decoder.decode();
//     if (buffer.trim() && !signal?.aborted) {
//       processLine(buffer);
//     }

//     if (signal?.aborted) return null;

//     // Some compatible streaming endpoints close without a separate done line.
//     if (!completed) {
//       completed = true;
//       onDone?.(fullResponse);
//     }

//     return fullResponse;
//   } catch (error) {
//     if (error.name === "AbortError" || signal?.aborted) {
//       return null;
//     }

//     onError?.(error.message || "Unknown model error");
//     return null;
//   } finally {
//     if (reader) {
//       try {
//         reader.releaseLock();
//       } catch {
//         // The stream may already have released or cancelled its reader.
//       }
//     }
//   }
// }

// // ================= ENSEMBLE JUDGE =================

// async function fetchJudge({ prompt, candidates, sessionId, signal }) {
//   const res = await fetch(`${API_BASE}/ensemble-judge`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       prompt,
//       candidates,
//       sessionId,
//     }),
//     signal,
//   });

//   if (!res.ok) {
//     let errorMessage = "Ensemble synthesis failed";
//     try {
//       const errorData = await res.json();
//       errorMessage = errorData.error || errorData.message || errorMessage;
//     } catch {
//       const errorText = await res.text().catch(() => "");
//       if (errorText) errorMessage = errorText;
//     }
//     throw new Error(errorMessage);
//   }

//   return res.json();
// }

// // ================= INDIVIDUAL MODEL WINDOW =================

// function ModelWindow({ model, content, status }) {
//   const bodyRef = useRef(null);
//   const copyBtnRef = useRef(null);
//   const copyTimeoutRef = useRef(null);

//   // Keep the newest streamed text visible inside this model's own panel. This
//   // avoids scrollIntoView moving the entire page while four models stream.
//   useEffect(() => {
//     if (status === "streaming" && bodyRef.current) {
//       bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
//     }
//   }, [content, status]);

//   useEffect(() => {
//     return () => clearTimeout(copyTimeoutRef.current);
//   }, []);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(content || "");

//       if (copyBtnRef.current) {
//         copyBtnRef.current.classList.add("copied");
//         copyBtnRef.current.textContent = "✓";
//         clearTimeout(copyTimeoutRef.current);

//         copyTimeoutRef.current = setTimeout(() => {
//           if (copyBtnRef.current) {
//             copyBtnRef.current.classList.remove("copied");
//             copyBtnRef.current.textContent = "📋";
//           }
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("Failed to copy model response:", error);
//     }
//   };

//   const statusLabel = {
//     idle: "Ready",
//     streaming: "Streaming…",
//     done: "Done",
//     error: "Failed",
//   }[status] || "Ready";

//   return (
//     <div className="ew-window">
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
//             status === "streaming"
//               ? "ew-streaming"
//               : status === "error"
//                 ? "ew-error"
//                 : ""
//           }`}
//         >
//           {statusLabel}
//         </span>

//         {content && (
//           <button
//             ref={copyBtnRef}
//             className="copy-btn"
//             onClick={handleCopy}
//             type="button"
//             title={`Copy ${model.label} response`}
//             aria-label={`Copy ${model.label} response`}
//           >
//             📋
//           </button>
//         )}
//       </div>

//       <div
//         className="ew-window-body"
//         ref={bodyRef}
//         style={{ overflowY: "auto", minHeight: 0 }}
//       >
//         {status === "idle" && (
//           <div className="ew-idle">
//             <div className="ew-idle-orb">{model.badge}</div>
//             <p>Waiting to start…</p>
//           </div>
//         )}

//         {status === "streaming" && !content && (
//           <div className="typing-indicator" style={{ padding: "8px 0" }}>
//             <span />
//             <span />
//             <span />
//           </div>
//         )}

//         {(status === "streaming" || status === "done" || status === "error") &&
//           content && (
//             <div className="md ew-md">
//               <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                 {content}
//               </ReactMarkdown>
//               {status === "streaming" && (
//                 <span className="cursor-blink">▍</span>
//               )}
//             </div>
//           )}

//         {status === "error" && !content && (
//           <p
//             style={{
//               color: "var(--danger)",
//               fontSize: "0.82rem",
//             }}
//           >
//             ❌ This model failed to respond.
//           </p>
//         )}

//         {status === "error" && content && (
//           <p
//             style={{
//               color: "var(--danger)",
//               fontSize: "0.78rem",
//               marginTop: "12px",
//             }}
//           >
//             Response ended early because this model encountered an error.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// // ================= MAIN ENSEMBLE CHAT =================

// export default function EnsembleChat({ sessionId }) {
//   const [input, setInput] = useState("");
//   const [phase, setPhase] = useState("idle");
//   const [modelStates, setModelStates] = useState(() =>
//     createInitialModelStates()
//   );

//   const [finalAnswer, setFinalAnswer] = useState("");
//   const [finalStreaming, setFinalStreaming] = useState(false);
//   const [currentPrompt, setCurrentPrompt] = useState("");
//   //const [synthExpanded, setSynthExpanded] = useState(false);

//   const abortRef = useRef(null);
//   const textareaRef = useRef(null);
//   //const finalBodyRef = useRef(null);
//   const finalSectionRef = useRef(null);
//   const finalCopyBtnRef = useRef(null);
//   const finalIntervalRef = useRef(null);
//   const finalCopyTimeoutRef = useRef(null);
//   const runIdRef = useRef(0);
//   const previousSessionIdRef = useRef(sessionId);

//   // Reset Ensemble Mode when the user switches to another conversation.
//   useEffect(() => {
//     if (previousSessionIdRef.current === sessionId) return;
//     previousSessionIdRef.current = sessionId;

//     runIdRef.current += 1;
//     abortRef.current?.abort();
//     abortRef.current = null;
//     clearInterval(finalIntervalRef.current);
//     finalIntervalRef.current = null;

//     setInput("");
//     setPhase("idle");
//     setModelStates(createInitialModelStates());
//     setFinalAnswer("");
//     setFinalStreaming(false);
//     setCurrentPrompt("");
//     setSynthExpanded(false);
//   }, [sessionId]);

//   // Clean up active requests and timers when leaving Ensemble Mode.
//   useEffect(() => {
//     return () => {
//       runIdRef.current += 1;
//       abortRef.current?.abort();
//       clearInterval(finalIntervalRef.current);
//       clearTimeout(finalCopyTimeoutRef.current);
//     };
//   }, []);

//   const updateModel = (key, patch) => {
//     setModelStates((previous) => ({
//       ...previous,
//       [key]: {
//         ...previous[key],
//         ...patch,
//       },
//     }));
//   };

//   // ================= RUN ENSEMBLE =================

//   const handleRun = async () => {
//     if (!input.trim() || phase === "running" || phase === "judging") {
//       return;
//     }

//     if (!sessionId) {
//       setFinalAnswer(
//         "❌ Conversation session is unavailable. Start a new conversation."
//       );
//       setPhase("done");
//       return;
//     }

//     const prompt = input.trim();
//     const runId = ++runIdRef.current;

//     setCurrentPrompt(prompt);
//     setInput("");
//     setFinalAnswer("");
//     setFinalStreaming(false);
//     setSynthExpanded(false);
//     clearInterval(finalIntervalRef.current);
//     finalIntervalRef.current = null;
//     setPhase("running");
//     setModelStates(createInitialModelStates("streaming"));

//     const controller = new AbortController();
//     abortRef.current = controller;
//     const { signal } = controller;

//     try {
//       // Establish the guest cookie once before starting parallel model calls.
//       await ensureGuestSession();

//       if (signal.aborted || runId !== runIdRef.current) return;

//       // Run all four providers concurrently. Candidate streams use persist:false
//       // so the judge endpoint stores only one user prompt and one final answer.
//       const results = await Promise.all(
//         MODELS.map(async (model) => {
//           const output = await streamModel({
//             message: prompt,
//             model: model.key,
//             sessionId,
//             signal,
//             onChunk: (token) => {
//               if (runId !== runIdRef.current) return;

//               setModelStates((previous) => ({
//                 ...previous,
//                 [model.key]: {
//                   ...previous[model.key],
//                   content: previous[model.key].content + token,
//                   status: "streaming",
//                 },
//               }));
//             },
//             onDone: (full) => {
//               if (runId !== runIdRef.current) return;
//               updateModel(model.key, {
//                 content: full,
//                 status: "done",
//               });
//             },
//             onError: (error) => {
//               if (runId !== runIdRef.current) return;
//               console.error(`${model.label} failed:`, error);
//               updateModel(model.key, { status: "error" });
//             },
//           });

//           if (!output?.trim()) return null;
//           return {
//             model: model.label,
//             output,
//           };
//         })
//       );

//       if (signal.aborted || runId !== runIdRef.current) return;

//       const candidates = results.filter(Boolean);

//       if (candidates.length === 0) {
//         setFinalAnswer("❌ All four models failed to respond. Please try again.");
//         setFinalStreaming(false);
//         setPhase("done");
//         return;
//       }

//       // ================= JUDGE PHASE =================

//       setPhase("judging");
//       setFinalStreaming(true);

//       const result = await fetchJudge({
//         prompt,
//         candidates,
//         sessionId,
//         signal,
//       });

//       if (signal.aborted || runId !== runIdRef.current) return;

//       const reply = result?.reply;
//       if (typeof reply !== "string" || !reply.trim()) {
//         throw new Error("The judge returned an empty response.");
//       }

//       // Keep the existing type-on animation for the synthesized answer.
//       let index = 0;
//       finalIntervalRef.current = setInterval(() => {
//         if (runId !== runIdRef.current) {
//           clearInterval(finalIntervalRef.current);
//           finalIntervalRef.current = null;
//           return;
//         }

//         if (index >= reply.length) {
//           clearInterval(finalIntervalRef.current);
//           finalIntervalRef.current = null;
//           abortRef.current = null;
//           setFinalStreaming(false);
//           setPhase("done");
//           return;
//         }

//         const nextIndex = Math.min(index + 3, reply.length);
//         setFinalAnswer(reply.slice(0, nextIndex));
//         index = nextIndex;
//       }, 12);
//     } catch (error) {
//       if (error.name === "AbortError" || signal.aborted) return;

//       console.error("Ensemble error:", error);
//       if (runId === runIdRef.current) {
//         setFinalAnswer(`❌ Synthesis failed: ${error.message}`);
//         setFinalStreaming(false);
//         setPhase("done");
//       }
//     } finally {
//       if (runId === runIdRef.current && !finalIntervalRef.current) {
//         abortRef.current = null;
//       }
//     }
//   };

//   // ================= STOP ENSEMBLE =================

//   const handleStop = () => {
//     runIdRef.current += 1;
//     abortRef.current?.abort();
//     abortRef.current = null;

//     clearInterval(finalIntervalRef.current);
//     finalIntervalRef.current = null;

//     // Keep any text already received from each provider visible and copyable.
//     setModelStates((previous) => {
//       const updated = {};
//       for (const model of MODELS) {
//         const current = previous[model.key];
//         updated[model.key] = {
//           ...current,
//           status: current.status === "streaming" ? "done" : current.status,
//         };
//       }
//       return updated;
//     });

//     setFinalStreaming(false);
//     setPhase(finalAnswer ? "done" : "idle");
//   };

//   // ================= KEYBOARD HANDLING =================

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleRun();
//     }
//   };

//   const handleChange = (event) => {
//     setInput(event.target.value);
//     const textarea = textareaRef.current;

//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
//     }
//   };

//   // ================= EXPAND FINAL ANSWER =================

//   // const handleToggleExpand = () => {
//   //   setSynthExpanded((previous) => !previous);
//   // };

//   // // Keep the latest synthesized text visible inside its own response area.
//   // useEffect(() => {
//   //   if (finalStreaming && finalBodyRef.current) {
//   //     finalBodyRef.current.scrollTop = finalBodyRef.current.scrollHeight;
//   //   }
//   // }, [finalAnswer, finalStreaming]);
// // Jump directly to the synthesized answer.
// const handleJumpToFinal = () => {
//   finalSectionRef.current?.scrollIntoView({
//     behavior: "smooth",
//     block: "start",
//   });
// };
//   // ================= COPY FINAL ANSWER =================

//   const handleCopyFinal = async () => {
//     try {
//       await navigator.clipboard.writeText(finalAnswer || "");

//       if (finalCopyBtnRef.current) {
//         finalCopyBtnRef.current.classList.add("copied");
//         finalCopyBtnRef.current.textContent = "✓";
//         clearTimeout(finalCopyTimeoutRef.current);

//         finalCopyTimeoutRef.current = setTimeout(() => {
//           if (finalCopyBtnRef.current) {
//             finalCopyBtnRef.current.classList.remove("copied");
//             finalCopyBtnRef.current.textContent = "📋";
//           }
//         }, 2000);
//       }
//     } catch (error) {
//       console.error("Failed to copy synthesized answer:", error);
//     }
//   };

//   // ================= RENDER =================

//   return (
//     <div className="ew-root">
//       <div className="ew-header">
//         <div className="ew-header-left">
//           <div className="ew-header-icon">✦</div>
//           <div>
//             <p className="ew-header-title">Ensemble Mode</p>
//             <p className="ew-header-sub">
//               All 4 models · Synthesized by GPT-OSS 120B
//             </p>
//           </div>
//         </div>

//         {(phase === "running" || phase === "judging") && (
//           <button className="ew-stop-btn" onClick={handleStop} type="button">
//             ◼ Stop
//           </button>
//         )}

//         {phase === "judging" && (
//           <div className="ew-judging-badge">
//             <span className="ew-pulse" />
//             Synthesizing…
//           </div>
//         )}
//       </div>

//       {currentPrompt && (
//         <div className="ew-prompt-bar">
//           <span className="ew-prompt-label">Prompt</span>
//           <span className="ew-prompt-text">"{currentPrompt}"</span>
//         </div>
//       )}
// <div className="ew-scroll-area">
//       <div className="ew-grid">
//         {MODELS.map((model) => (
//           <ModelWindow
//             key={model.key}
//             model={model}
//             content={modelStates[model.key].content}
//             status={modelStates[model.key].status}
//           />
//         ))}
//       </div>

//       {(phase === "judging" || phase === "done") && (
//         <div
//           className={`ew-final ${synthExpanded ? "expanded" : ""}`}
//           style={{
//             maxHeight: synthExpanded ? "80vh" : "120px",
//             transition: "all 0.3s ease-out",
//           }}
//         >
//           <div className="ew-final-header">
//             <div className="ew-final-icon">🧬</div>
//             <div>
//               <p className="ew-final-title">Synthesized Answer</p>
//               <p className="ew-final-sub">
//                 Best response · Judged by GPT-OSS 120B
//               </p>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "12px",
//                 }}
//               >
//                 <button
//                   className="expand-btn"
//                   onClick={handleToggleExpand}
//                   title={synthExpanded ? "Collapse" : "Expand"}
//                   type="button"
//                 >
//                   {synthExpanded ? "▼" : "▲"}
//                 </button>
//                 {finalStreaming && <span className="ew-pulse" />}
//               </div>

//               {finalAnswer && !finalStreaming && (
//                 <button
//                   ref={finalCopyBtnRef}
//                   className="copy-btn"
//                   onClick={handleCopyFinal}
//                   type="button"
//                   title="Copy synthesized answer"
//                   aria-label="Copy synthesized answer"
//                 >
//                   📋
//                 </button>
//               )}
//             </div>
//           </div>

//           <div
//             className="ew-final-body"
//             ref={finalBodyRef}
//             style={{ overflowY: "auto", minHeight: 0 }}
//           >
//             {!finalAnswer && finalStreaming && (
//               <div className="typing-indicator">
//                 <span />
//                 <span />
//                 <span />
//               </div>
//             )}

//             {finalAnswer && (
//               <div className="md">
//                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
//                   {finalAnswer}
//                 </ReactMarkdown>
//                 {finalStreaming && <span className="cursor-blink">▍</span>}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="ew-input-area">
//         <div
//           className={`ew-input-wrapper ${
//             phase === "running" || phase === "judging"
//               ? "ew-input-disabled"
//               : ""
//           }`}
//         >
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
//               <button
//                 className="stop-btn-inline"
//                 onClick={handleStop}
//                 type="button"
//                 title="Stop generation"
//               >
//                 ◼
//               </button>
//             ) : (
//               <button
//                 className="send-btn"
//                 onClick={handleRun}
//                 disabled={!input.trim() || phase === "judging"}
//                 type="button"
//                 title="Run all four models"
//               >
//                 ✦
//               </button>
//             )}
//           </div>
//         </div>

//         <p className="input-hint">
//           Sends to all 4 models · GPT-OSS 120B synthesizes the final answer
//         </p>
//       </div>
//     </div>
//   );
// }



import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { API_BASE } from "../config";
import { ensureGuestSession } from "../services/api";

// These IDs must match the active model IDs exposed by GET /api/models.
const MODELS = [
  {
    key: "groq-fast",
    label: "GPT-OSS 20B",
    badge: "",
    meta: "Groq · Fast",
  },
  {
    key: "groq-large",
    label: "GPT-OSS 120B",
    badge: "",
    meta: "Groq · Advanced Reasoning",
  },
  {
    key: "cloudflare-gemma",
    label: "Gemma 4 26B A4B",
    badge: "",
    meta: "Cloudflare · General Reasoning",
  },
  {
    key: "cloudflare-glm",
    label: "GLM 4.7 Flash",
    badge: "",
    meta: "Cloudflare · Fast Reasoning",
  },
];

function createInitialModelStates(status = "idle") {
  return Object.fromEntries(
    MODELS.map((model) => [
      model.key,
      {
        content: "",
        status,
      },
    ])
  );
}

// ============================================================
// STREAM INDIVIDUAL MODEL
// ============================================================

async function streamModel({
  message,
  model,
  sessionId,
  onChunk,
  onDone,
  onError,
  signal,
}) {
  let fullResponse = "";
  let completed = false;
  let reader;

  try {
    const res = await fetch(`${API_BASE}/stream`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        model,
        sessionId,

        // Individual model answers are not saved separately.
        // The judge endpoint saves the prompt and final answer.
        persist: false,
      }),
      signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `HTTP ${res.status}`);
    }

    if (!res.body) {
      throw new Error("Streaming response is unavailable.");
    }

    reader = res.body.getReader();

    const decoder = new TextDecoder();
    let buffer = "";

    const processLine = (rawLine) => {
      let line = rawLine.trim();

      if (!line) return;

      // Support both NDJSON and SSE data lines.
      if (line.startsWith("data:")) {
        line = line.slice(5).trim();
      }

      if (!line || line === "[DONE]") return;

      const data = JSON.parse(line);

      if (data.error) {
        throw new Error(data.error);
      }

      if (typeof data.token === "string" && data.token) {
        fullResponse += data.token;
        onChunk?.(data.token);
      }

      if (data.done) {
        // Support endpoints returning the complete response
        // only in the final done event.
        if (!fullResponse && typeof data.response === "string") {
          fullResponse = data.response;

          if (fullResponse) {
            onChunk?.(fullResponse);
          }
        }

        completed = true;
        onDone?.(fullResponse);
      }
    };

    while (true) {
      if (signal?.aborted) break;

      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, {
        stream: true,
      });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        processLine(line);
      }
    }

    buffer += decoder.decode();

    if (buffer.trim() && !signal?.aborted) {
      processLine(buffer);
    }

    if (signal?.aborted) {
      return null;
    }

    // Some compatible streaming endpoints close without
    // sending a separate done event.
    if (!completed) {
      completed = true;
      onDone?.(fullResponse);
    }

    return fullResponse;
  } catch (error) {
    if (error.name === "AbortError" || signal?.aborted) {
      return null;
    }

    onError?.(error.message || "Unknown model error");

    return null;
  } finally {
    if (reader) {
      try {
        reader.releaseLock();
      } catch {
        // The reader may already have been released.
      }
    }
  }
}

// ============================================================
// ENSEMBLE JUDGE
// ============================================================

async function fetchJudge({
  prompt,
  candidates,
  sessionId,
  signal,
}) {
  const res = await fetch(`${API_BASE}/ensemble-judge`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      candidates,
      sessionId,
    }),
    signal,
  });

  if (!res.ok) {
    let errorMessage = "Ensemble synthesis failed";

    try {
      const errorData = await res.json();

      errorMessage =
        errorData.error ||
        errorData.message ||
        errorMessage;
    } catch {
      // The response may not contain valid JSON.
    }

    throw new Error(errorMessage);
  }

  return res.json();
}

// ============================================================
// INDIVIDUAL MODEL WINDOW
// ============================================================

function ModelWindow({ model, content, status }) {
  const bodyRef = useRef(null);
  const copyBtnRef = useRef(null);
  const copyTimeoutRef = useRef(null);

  // Automatically scroll inside the individual model window
  // while its response is streaming.
  useEffect(() => {
    if (status === "streaming" && bodyRef.current) {
      bodyRef.current.scrollTop =
        bodyRef.current.scrollHeight;
    }
  }, [content, status]);

  useEffect(() => {
    return () => {
      clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || "");

      if (copyBtnRef.current) {
        copyBtnRef.current.classList.add("copied");
        copyBtnRef.current.textContent = "✓";

        clearTimeout(copyTimeoutRef.current);

        copyTimeoutRef.current = setTimeout(() => {
          if (copyBtnRef.current) {
            copyBtnRef.current.classList.remove("copied");
            copyBtnRef.current.textContent = "📋";
          }
        }, 2000);
      }
    } catch (error) {
      console.error(
        "Failed to copy model response:",
        error
      );
    }
  };

  const statusLabel = {
    idle: "Ready",
    streaming: "Streaming…",
    done: "Done",
    error: "Failed",
  }[status] || "Ready";

  return (
    <div className="ew-window">

      {/* MODEL HEADER */}
      <div className="ew-window-header">

        <div className="ew-window-info">
          <span className="ew-window-badge">
            {model.badge}
          </span>

          <div>
            <p className="ew-window-name">
              {model.label}
            </p>

            <p className="ew-window-meta">
              {model.meta}
            </p>
          </div>
        </div>

        <span
          className={`ew-window-status ${
            status === "streaming"
              ? "ew-streaming"
              : status === "error"
                ? "ew-error"
                : ""
          }`}
        >
          {statusLabel}
        </span>

        {content && (
          <button
            ref={copyBtnRef}
            className="copy-btn"
            onClick={handleCopy}
            type="button"
            title={`Copy ${model.label} response`}
            aria-label={`Copy ${model.label} response`}
          >
            📋
          </button>
        )}

      </div>

      {/* MODEL RESPONSE — INDEPENDENT SCROLL */}
      <div
        className="ew-window-body"
        ref={bodyRef}
      >

        {status === "idle" && (
          <div className="ew-idle">
            <div className="ew-idle-orb">
              {model.badge}
            </div>

            <p>Waiting to start…</p>
          </div>
        )}

        {status === "streaming" && !content && (
          <div
            className="typing-indicator"
            style={{ padding: "8px 0" }}
          >
            <span />
            <span />
            <span />
          </div>
        )}

        {(status === "streaming" ||
          status === "done" ||
          status === "error") &&
          content && (
            <div className="md ew-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>

              {status === "streaming" && (
                <span className="cursor-blink">
                  ▍
                </span>
              )}
            </div>
          )}

        {status === "error" && !content && (
          <p
            style={{
              color: "var(--danger)",
              fontSize: "0.82rem",
            }}
          >
            ❌ This model failed to respond.
          </p>
        )}

        {status === "error" && content && (
          <p
            style={{
              color: "var(--danger)",
              fontSize: "0.78rem",
              marginTop: "12px",
            }}
          >
            Response ended early because this model
            encountered an error.
          </p>
        )}

      </div>
    </div>
  );
}

// ============================================================
// MAIN ENSEMBLE CHAT
// ============================================================

export default function EnsembleChat({
  sessionId,
  onConversationSaved,
}) {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState("idle");

  const [modelStates, setModelStates] = useState(() =>
    createInitialModelStates()
  );

  const [finalAnswer, setFinalAnswer] = useState("");
  const [finalStreaming, setFinalStreaming] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const abortRef = useRef(null);
  const textareaRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const finalSectionRef = useRef(null);
  const finalCopyBtnRef = useRef(null);
  const finalIntervalRef = useRef(null);
  const finalCopyTimeoutRef = useRef(null);
  const runIdRef = useRef(0);
  const previousSessionIdRef = useRef(sessionId);

  // ==========================================================
  // RESET WHEN USER SWITCHES CONVERSATIONS
  // ==========================================================

  useEffect(() => {
    if (previousSessionIdRef.current === sessionId) {
      return;
    }

    previousSessionIdRef.current = sessionId;

    runIdRef.current += 1;

    abortRef.current?.abort();
    abortRef.current = null;

    clearInterval(finalIntervalRef.current);
    finalIntervalRef.current = null;

    setInput("");
    setPhase("idle");
    setModelStates(createInitialModelStates());
    setFinalAnswer("");
    setFinalStreaming(false);
    setCurrentPrompt("");

    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [sessionId]);

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      runIdRef.current += 1;

      abortRef.current?.abort();

      clearInterval(finalIntervalRef.current);
      clearTimeout(finalCopyTimeoutRef.current);
    };
  }, []);

  // ==========================================================
  // UPDATE INDIVIDUAL MODEL
  // ==========================================================

  const updateModel = (key, patch) => {
    setModelStates((previous) => ({
      ...previous,
      [key]: {
        ...previous[key],
        ...patch,
      },
    }));
  };

  // ==========================================================
  // RUN ENSEMBLE
  // ==========================================================

  const handleRun = async () => {
    if (
      !input.trim() ||
      phase === "running" ||
      phase === "judging"
    ) {
      return;
    }

    if (!sessionId) {
      setFinalAnswer(
        "❌ Conversation session is unavailable. Start a new conversation."
      );

      setPhase("done");
      return;
    }

    const prompt = input.trim();
    const runId = ++runIdRef.current;

    setCurrentPrompt(prompt);
    setInput("");
    setFinalAnswer("");
    setFinalStreaming(false);

    clearInterval(finalIntervalRef.current);
    finalIntervalRef.current = null;

    setPhase("running");
    setModelStates(
      createInitialModelStates("streaming")
    );

    // Start each new run at the top of the model grid.
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }

    const controller = new AbortController();

    abortRef.current = controller;

    const { signal } = controller;

    try {
      // Establish the guest cookie before starting parallel requests.
      // The auth cookie is also preserved for registered users.
      await ensureGuestSession();

      if (signal.aborted || runId !== runIdRef.current) {
        return;
      }

      // Run all four providers concurrently.
      // Candidate streams use persist:false so the judge endpoint
      // saves only the original prompt and synthesized answer.
      const results = await Promise.all(
        MODELS.map(async (model) => {
          const output = await streamModel({
            message: prompt,
            model: model.key,
            sessionId,
            signal,

            onChunk: (token) => {
              if (runId !== runIdRef.current) return;

              setModelStates((previous) => ({
                ...previous,
                [model.key]: {
                  ...previous[model.key],
                  content:
                    previous[model.key].content + token,
                  status: "streaming",
                },
              }));
            },

            onDone: (full) => {
              if (runId !== runIdRef.current) return;

              updateModel(model.key, {
                content: full,
                status: "done",
              });
            },

            onError: (error) => {
              if (runId !== runIdRef.current) return;

              console.error(
                `${model.label} failed:`,
                error
              );

              updateModel(model.key, {
                status: "error",
              });
            },
          });

          if (!output?.trim()) {
            return null;
          }

          return {
            model: model.label,
            output,
          };
        })
      );

      if (signal.aborted || runId !== runIdRef.current) {
        return;
      }

      const candidates = results.filter(Boolean);

      if (candidates.length === 0) {
        setFinalAnswer(
          "❌ All four models failed to respond. Please try again."
        );

        setFinalStreaming(false);
        setPhase("done");
        return;
      }

      // ======================================================
      // JUDGE PHASE
      // ======================================================

      setPhase("judging");
      setFinalStreaming(true);

      const result = await fetchJudge({
        prompt,
        candidates,
        sessionId,
        signal,
      });

      if (signal.aborted || runId !== runIdRef.current) {
        return;
      }

      const reply = result?.reply;

      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error(
          "The judge returned an empty response."
        );
      }

      // The backend has saved the prompt and synthesized answer.
      // Refresh the left conversation history.
      try {
        onConversationSaved?.();
      } catch (error) {
        console.error(
          "Could not refresh conversation history:",
          error
        );
      }

      // ======================================================
      // TYPE-ON ANIMATION FOR SYNTHESIZED ANSWER
      // ======================================================

      let index = 0;

      finalIntervalRef.current = setInterval(() => {
        if (runId !== runIdRef.current) {
          clearInterval(finalIntervalRef.current);
          finalIntervalRef.current = null;
          return;
        }

        if (index >= reply.length) {
          clearInterval(finalIntervalRef.current);
          finalIntervalRef.current = null;

          abortRef.current = null;

          setFinalStreaming(false);
          setPhase("done");

          return;
        }

        const nextIndex = Math.min(
          index + 3,
          reply.length
        );

        setFinalAnswer(
          reply.slice(0, nextIndex)
        );

        index = nextIndex;
      }, 12);

    } catch (error) {
      if (
        error.name === "AbortError" ||
        signal.aborted
      ) {
        return;
      }

      console.error("Ensemble error:", error);

      if (runId === runIdRef.current) {
        setFinalAnswer(
          `❌ Synthesis failed: ${error.message}`
        );

        setFinalStreaming(false);
        setPhase("done");
      }
    } finally {
      if (
        runId === runIdRef.current &&
        !finalIntervalRef.current
      ) {
        abortRef.current = null;
      }
    }
  };

  // ==========================================================
  // STOP ENSEMBLE
  // ==========================================================

  const handleStop = () => {
    runIdRef.current += 1;

    abortRef.current?.abort();
    abortRef.current = null;

    clearInterval(finalIntervalRef.current);
    finalIntervalRef.current = null;

    // Preserve any partial responses already received.
    setModelStates((previous) => {
      const updated = {};

      for (const model of MODELS) {
        const current = previous[model.key];

        updated[model.key] = {
          ...current,
          status:
            current.status === "streaming"
              ? "done"
              : current.status,
        };
      }

      return updated;
    });

    setFinalStreaming(false);

    setPhase(
      finalAnswer ? "done" : "idle"
    );
  };

  // ==========================================================
  // KEYBOARD HANDLING
  // ==========================================================

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleRun();
    }
  };

  const handleChange = (event) => {
    setInput(event.target.value);

    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";

      textarea.style.height = `${Math.min(
        textarea.scrollHeight,
        160
      )}px`;
    }
  };

  // ==========================================================
  // JUMP TO SYNTHESIZED ANSWER
  // ==========================================================

  const handleJumpToFinal = () => {
    finalSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // ==========================================================
  // COPY SYNTHESIZED ANSWER
  // ==========================================================

  const handleCopyFinal = async () => {
    try {
      await navigator.clipboard.writeText(
        finalAnswer || ""
      );

      if (finalCopyBtnRef.current) {
        finalCopyBtnRef.current.classList.add("copied");
        finalCopyBtnRef.current.textContent = "✓";

        clearTimeout(finalCopyTimeoutRef.current);

        finalCopyTimeoutRef.current = setTimeout(() => {
          if (finalCopyBtnRef.current) {
            finalCopyBtnRef.current.classList.remove("copied");
            finalCopyBtnRef.current.textContent = "📋";
          }
        }, 2000);
      }
    } catch (error) {
      console.error(
        "Failed to copy synthesized answer:",
        error
      );
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="ew-root">

      {/* ====================================================
          ENSEMBLE HEADER
      ==================================================== */}

      <div className="ew-header">

        <div className="ew-header-left">
          <div className="ew-header-icon">✦</div>

          <div>
            <p className="ew-header-title">
              Ensemble Mode
            </p>

            <p className="ew-header-sub">
              All 4 models · Synthesized by GPT-OSS 120B
            </p>
          </div>
        </div>

        {(phase === "running" || phase === "judging") && (
          <button
            className="ew-stop-btn"
            onClick={handleStop}
            type="button"
          >
            ◼ Stop
          </button>
        )}

        {phase === "judging" && (
          <div className="ew-judging-badge">
            <span className="ew-pulse" />
            Synthesizing…
          </div>
        )}

      </div>

      {/* ====================================================
          CURRENT PROMPT
      ==================================================== */}

      {currentPrompt && (
        <div className="ew-prompt-bar">
          <span className="ew-prompt-label">
            Prompt
          </span>

          <span className="ew-prompt-text">
            "{currentPrompt}"
          </span>
        </div>
      )}

      {/* ====================================================
          SCROLLABLE CONTENT AREA

          The model grid and synthesized answer are inside
          this container. The input stays outside it.
      ==================================================== */}

      <div
        className="ew-scroll-area"
        ref={scrollAreaRef}
      >

        {/* ==================================================
            FOUR MODEL RESPONSES — 2 × 2 GRID
        ================================================== */}

        <div className="ew-grid">

          {MODELS.map((model) => (
            <ModelWindow
              key={model.key}
              model={model}
              content={modelStates[model.key].content}
              status={modelStates[model.key].status}
            />
          ))}

        </div>

        {/* ==================================================
            FULL SYNTHESIZED ANSWER
        ================================================== */}

        {(phase === "judging" || phase === "done") && (
          <div
            className="ew-final"
            ref={finalSectionRef}
          >

            {/* SYNTHESIZED ANSWER HEADER */}

            <div className="ew-final-header">

              <div className="ew-final-icon">
                🧬
              </div>

              <div>
                <p className="ew-final-title">
                  Synthesized Answer
                </p>

                <p className="ew-final-sub">
                  Best response · Judged by GPT-OSS 120B
                </p>
              </div>

              <div className="ew-final-actions">

                <button
                  className="expand-btn"
                  onClick={handleJumpToFinal}
                  title="Scroll to synthesized answer"
                  type="button"
                >
                  ↓
                </button>

                {finalStreaming && (
                  <span className="ew-pulse" />
                )}

                {finalAnswer && !finalStreaming && (
                  <button
                    ref={finalCopyBtnRef}
                    className="copy-btn"
                    onClick={handleCopyFinal}
                    type="button"
                    title="Copy synthesized answer"
                    aria-label="Copy synthesized answer"
                  >
                    📋
                  </button>
                )}

              </div>

            </div>

            {/* COMPLETE SYNTHESIZED RESPONSE */}

            <div className="ew-final-body">

              {!finalAnswer && finalStreaming && (
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              )}

              {finalAnswer && (
                <div className="md">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {finalAnswer}
                  </ReactMarkdown>

                  {finalStreaming && (
                    <span className="cursor-blink">
                      ▍
                    </span>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* ====================================================
          FIXED INPUT AREA
      ==================================================== */}

      <div className="ew-input-area">

        <div
          className={`ew-input-wrapper ${
            phase === "running" || phase === "judging"
              ? "ew-input-disabled"
              : ""
          }`}
        >

          <textarea
            ref={textareaRef}
            className="chat-textarea"
            placeholder="Ask all 4 models simultaneously…"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={
              phase === "running" ||
              phase === "judging"
            }
            rows={1}
          />

          <div className="input-actions">

            {phase === "running" ? (
              <button
                className="stop-btn-inline"
                onClick={handleStop}
                type="button"
                title="Stop generation"
              >
                ◼
              </button>
            ) : (
              <button
                className="send-btn"
                onClick={handleRun}
                disabled={
                  !input.trim() ||
                  phase === "judging"
                }
                type="button"
                title="Run all four models"
              >
                ✦
              </button>
            )}

          </div>
        </div>

        <p className="input-hint">
          Sends to all 4 models · GPT-OSS 120B synthesizes the final answer
        </p>

      </div>

    </div>
  );
}
