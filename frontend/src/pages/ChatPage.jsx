// src/pages/ChatPage.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import MessageList from "../components/MessageList";
import ChatInput   from "../components/ChatInput";
import RightPanel  from "../components/RightPanel";
import EnsembleChat from "../components/EnsembleChat";
import { useChatStream } from "../hooks/useChatStream";

const MODEL_LABELS = {
  "auto":        "Auto (Groq Fast)",
  "groq-fast":   "Llama 3.1 8B — Fast",
  "groq-large":  "Llama 3.3 70B — Powerful",
  "groq-qwen":   "Qwen 3 32B — Alibaba",
  "groq-llama4": "Llama 4 Scout — Latest",
  "ensemble":    "✦ Ensemble — All 4 Models",
};

const SIDEBAR_HISTORY = [
  "Explain quantum entanglement",
  "Write a React component",
  "Debug my Python script",
  "Plan a healthy weekly menu",
  "Summarize climate report",
];

export default function ChatPage() {
  const { messages, model, setModel, loading, sendMessage, stopStreaming, loadSession } = useChatStream();
  const chatInputRef = useRef(null);

  const handleQuickPrompt = (promptText) => {
    chatInputRef.current?.prefill?.(promptText);
  };

  const handleSuggestionClick = (suggestion) => {
    chatInputRef.current?.prefill?.(suggestion);
  };

  const handleSidebarHistoryClick = (item) => {
    chatInputRef.current?.prefill?.(item);
  };

  const handleLoadSession = (sessionId, sessionMessages) => {
    // Load the session messages into the chat
    console.log('Loading session:', sessionId, 'with', sessionMessages?.length, 'messages');
    loadSession(sessionId, sessionMessages);  // Actually call the hook function!
  };

  // ── When ensemble mode is active, swap out main area ──────────────────
  const isEnsemble = model === "ensemble";

  return (
    <div className="chat-layout">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="chat-sidebar">
        <Link to="/" className="sidebar-logo">
          <div className="logo-icon">T</div>
          ThinkGPT
        </Link>

        <button className="new-chat-btn" onClick={() => window.location.reload()}>
          <span>+</span> New conversation
        </button>

        <p className="sidebar-section-label">Recent</p>
        <div className="history-list">
          {SIDEBAR_HISTORY.map(item => (
            <div 
              key={item} 
              className="history-item"
              onClick={() => handleSidebarHistoryClick(item)}
              style={{ cursor: "pointer" }}
            >
              💬 {item}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <span className="sidebar-model-label">Active model</span>
          <select
            className="sidebar-model-select"
            value={model}
            onChange={e => setModel(e.target.value)}
          >
            <optgroup label="Auto">
              <option value="auto">Auto (Groq Fast)</option>
            </optgroup>
            <optgroup label="Groq Cloud">
              <option value="groq-fast">Llama 3.1 8B — Fast</option>
              <option value="groq-large">Llama 3.3 70B — Powerful</option>
              <option value="groq-qwen">Qwen 3 32B — Alibaba</option>
              <option value="groq-llama4">Llama 4 Scout — Latest</option>
            </optgroup>
            <optgroup label="Special">
              <option value="ensemble">✦ Ensemble — All 4 Models</option>
            </optgroup>
          </select>
        </div>
      </aside>

      {/* ── MAIN AREA — swaps between normal chat and ensemble ── */}
      {isEnsemble ? (

        // ── ENSEMBLE VIEW ──────────────────────────────────────────────────
        <EnsembleChat />

      ) : (

        // ── NORMAL CHAT VIEW ───────────────────────────────────────────────
        <main className="chat-main">
          <div className="chat-header">
            <div className="chat-header-model">
              <div className="model-dot" />
              {MODEL_LABELS[model] || model}
            </div>
            <div className="chat-header-actions">
              <Link to="/"><button className="icon-btn" title="Home">⌂</button></Link>
            </div>
          </div>

          <MessageList messages={messages} loading={loading} onSuggestionClick={handleSuggestionClick} />

          <ChatInput
            ref={chatInputRef}
            sendMessage={sendMessage}
            stopStreaming={stopStreaming}
            loading={loading}
          />
        </main>
      )}

      {/* ── RIGHT PANEL — hidden in ensemble (not enough space) ── */}
      {!isEnsemble && (
        <RightPanel
          messages={messages}
          model={model}
          onQuickPrompt={handleQuickPrompt}
          onSuggestionClick={handleSuggestionClick}
          onLoadSession={handleLoadSession}
        />
      )}
    </div>
  );
}