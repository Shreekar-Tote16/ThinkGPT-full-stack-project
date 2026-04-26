// src/components/RightPanel.jsx
import { useState, useEffect } from "react";
import { getSessions, getSessionMessages } from "../services/api";

const QUICK_PROMPTS = [
  { icon: "⚡", label: "Explain a concept", prompt: "Explain the concept of " },
  { icon: "🐛", label: "Debug my code",     prompt: "Help me debug this code:\n\n" },
  { icon: "✍️", label: "Write a function",  prompt: "Write a function that " },
  { icon: "📋", label: "Summarize this",    prompt: "Summarize the following:\n\n" },
];

const MODEL_INFO = {
  "auto":        { name: "Auto",              tokens: "8K",   speed: "Fastest", badge: "⚡" },
  "groq-fast":   { name: "Llama 3.1 8B",      tokens: "128K", speed: "Fastest", badge: "⚡" },
  "groq-large":  { name: "Llama 3.3 70B",     tokens: "128K", speed: "Fast",    badge: "🧠" },
  "groq-qwen":   { name: "Qwen 3 32B",        tokens: "32K",  speed: "Fast",    badge: "🔮" },
  "groq-llama4": { name: "Llama 4 Scout 17B", tokens: "128K", speed: "Fast",    badge: "🚀" },
};

export default function RightPanel({ messages = [], model = "groq-fast", onQuickPrompt, onLoadSession, onSuggestionClick }) {
  const [tab, setTab] = useState("history");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const info = MODEL_INFO[model] || MODEL_INFO["groq-fast"];

  // Fetch sessions on component mount
  useEffect(() => {
    console.log('RightPanel mounted, testing sessions...');
    const fetchSessions = async () => {
      try {
        console.log('Calling getSessions...');
        const sessionData = await getSessions();
        console.log('Sessions response:', sessionData);
        setSessions(sessionData);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Handle session click
  const handleSessionClick = async (sessionId) => {
    try {
      const sessionMessages = await getSessionMessages(sessionId);
      onLoadSession?.(sessionId, sessionMessages);
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const formattedSessions = sessions.map(session => ({
    id: session._id,
    title: session.title?.length < 50 ? session.title : session.title.substring(0, 47) + "...",
    preview: session.lastMessage?.length < 100 ? session.lastMessage : session.lastMessage?.substring(0, 97) + "...",
    messageCount: session.messageCount || 0
  }));

  const wordCount = messages
    .filter(m => m.role === "assistant")
    .reduce((acc, m) => acc + (m.content?.split(" ").length || 0), 0);

  const msgCount = messages.filter(m => m.role === "user").length;

  return (
    <aside className="right-panel">

      {/* ── TABS ── */}
      <div className="rp-tabs">
        <button
          className={`rp-tab ${tab === "history" ? "active" : ""}`}
          onClick={() => setTab("history")}
        >
          History
        </button>
        <button
          className={`rp-tab ${tab === "info" ? "active" : ""}`}
          onClick={() => setTab("info")}
        >
          Session
        </button>
      </div>

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div className="rp-content">
          <p className="rp-section-label">Recent chats</p>

          <div className="rp-history-list">
            {loading ? (
              <div className="rp-history-loading">Loading conversations...</div>
            ) : sessions.length === 0 ? (
              <div className="rp-history-empty">No conversations yet</div>
            ) : (
              sessions.map(s => (
                <div 
                  key={s.id} 
                  className="rp-history-item"
                  onClick={() => handleSessionClick(s.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="rp-history-icon">💬</div>
                  <div className="rp-history-body">
                    <p className="rp-history-title">{s.title}</p>
                    <p className="rp-history-preview">{s.preview}</p>
                  </div>
                  <span className="rp-history-time">{s.time}</span>
                </div>
              ))
            )}
          </div>

          <p className="rp-section-label" style={{ marginTop: 24 }}>Quick prompts</p>
          <div className="rp-quick-prompts">
            {QUICK_PROMPTS.map(q => (
              <button
                key={q.label}
                className="rp-quick-btn"
                onClick={() => onQuickPrompt?.(q.prompt)}
              >
                <span>{q.icon}</span>
                {q.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── SESSION TAB ── */}
      {tab === "info" && (
        <div className="rp-content">
          <p className="rp-section-label">Active model</p>
          <div className="rp-model-card">
            <div className="rp-model-badge">{info.badge}</div>
            <div>
              <p className="rp-model-name">{info.name}</p>
              <p className="rp-model-meta">via Groq LPU · {info.speed}</p>
            </div>
          </div>

          <div className="rp-stats-grid">
            <div className="rp-stat">
              <span className="rp-stat-num">{info.tokens}</span>
              <span className="rp-stat-label">Context window</span>
            </div>
            <div className="rp-stat">
              <span className="rp-stat-num">{msgCount}</span>
              <span className="rp-stat-label">Messages sent</span>
            </div>
            <div className="rp-stat">
              <span className="rp-stat-num">{wordCount}</span>
              <span className="rp-stat-label">Words generated</span>
            </div>
            <div className="rp-stat">
              <span className="rp-stat-num">&lt;1s</span>
              <span className="rp-stat-label">Avg latency</span>
            </div>
          </div>

          <p className="rp-section-label" style={{ marginTop: 24 }}>Tips</p>
          <div className="rp-tips">
            <div className="rp-tip">
              <span className="rp-tip-icon">💡</span>
              <p>Use <strong>Shift+Enter</strong> to add a new line without sending.</p>
            </div>
            <div className="rp-tip">
              <span className="rp-tip-icon">🔀</span>
              <p>Switch models mid-conversation for different perspectives.</p>
            </div>
            <div className="rp-tip">
              <span className="rp-tip-icon">🧠</span>
              <p>Llama 3.3 70B is best for complex reasoning and long tasks.</p>
            </div>
          </div>
        </div>
      )}

    </aside>
  );
}