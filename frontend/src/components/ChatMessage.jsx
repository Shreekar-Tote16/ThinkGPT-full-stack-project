


// // src/components/ChatMessage.jsx
// export default function ChatMessage({ role, content, isStreaming }) {
//   const isUser      = role === "user";
//   const isError     = content?.startsWith("❌");
//   const isEmpty     = !content && !isStreaming;

//   return (
//     <div className={`message-item ${role}`}>
//       <div className="message-avatar">
//         {isUser ? "U" : "T"}
//       </div>
//       <div className="message-content-wrap">
//         <span className="message-role-label">
//           {isUser ? "You" : "ThinkGPT"}
//         </span>
//         <div className={`message-bubble ${isError ? "error" : ""}`}>
//           {isEmpty && isStreaming ? (
//             <div className="typing-indicator">
//               <span /><span /><span />
//             </div>
//           ) : (
//             content || (
// src/components/ChatMessage.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef } from "react";

export default function ChatMessage({ role, content, isStreaming }) {
  const isUser  = role === "user";
  const isError = content?.startsWith("❌");
  const copyBtnRef = useRef(null);

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

  return (
    <div className={`message-item ${role} message-wrapper`}>
      <div className="message-avatar">{isUser ? "U" : "T"}</div>

      <div className="message-content-wrap">
        <span className="message-role-label">
          {isUser ? "You" : "ThinkGPT"}
        </span>

        <div className={`message-bubble ${isError ? "error" : ""}`}>
          {!content && isStreaming ? (
            <div className="typing-indicator">
              <span /><span /><span />
            </div>
          ) : isUser ? (
            // User messages: plain text, no markdown needed
            <span>{content}</span>
          ) : (
            // Assistant messages: full markdown rendering
            <div className="md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || ""}
              </ReactMarkdown>
              {isStreaming && content && (
                <span className="cursor-blink">▍</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {!isUser && content && !isStreaming && (
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