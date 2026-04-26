// src/pages/ChatPage.jsx
import { useRef } from "react";
import { Link } from "react-router-dom";
import MessageList from "../components/MessageList";
import ChatInput   from "../components/ChatInput";
import RightPanel  from "../components/RightPanel";
import { useChatStream } from "../hooks/useChatStream";

const MODEL_LABELS = {
  "auto":        "Auto (Groq Fast)",
  "groq-fast":   "Llama 3.1 8B — Fast",
  "groq-large":  "Llama 3.3 70B — Powerful",
  "groq-qwen":   "Qwen 3 32B — Alibaba",
  "groq-llama4": "Llama 4 Scout — Latest",
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

  const handleLoadSession = (sessionId, sessionMessages) => {
    loadSession(sessionId, sessionMessages);
  };

  const handleSuggestionClick = (suggestion) => {
    chatInputRef.current?.prefill?.(suggestion);
  };

  const handleSidebarHistoryClick = (item) => {
    chatInputRef.current?.prefill?.(item);
  };

  return (
    <div className="chat-layout">

      {/* ── LEFT SIDEBAR ── */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2>💬 Quick Prompts</h2>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-list">
            {SIDEBAR_HISTORY.map((item, index) => (
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
        </div>

        <div className="sidebar-header">
          <h2>🔗 Pages</h2>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-list">
            <Link to="/" className="sidebar-link">🏠 Home</Link>
            <Link to="/ensemble" className="sidebar-link">⚡ Ensemble</Link>
            <Link to="/about" className="sidebar-link">ℹ️ About</Link>
            <Link to="/features" className="sidebar-link">✨ Features</Link>
          </div>
        </div>
      </aside>

      {/* ── MAIN CHAT AREA ── */}
      <main className="chat-main">
        <MessageList messages={messages} />
        <ChatInput
          ref={chatInputRef}
          onSend={sendMessage}
          onStop={stopStreaming}
          disabled={loading}
          placeholder="Ask anything..."
        />
      </main>

      {/* ── RIGHT PANEL ── */}
      <RightPanel
        model={model}
        onModelChange={setModel}
        modelLabels={MODEL_LABELS}
        onQuickPrompt={handleQuickPrompt}
        onLoadSession={handleLoadSession}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
}
