// src/components/LoadingDots.jsx
// Typing indicator is now handled inside ChatMessage bubbles.
// This component is kept as a standalone fallback if needed elsewhere.
export default function LoadingDots() {
  return (
    <div className="typing-indicator" style={{ padding: "8px 16px" }}>
      <span /><span /><span />
    </div>
  );
}