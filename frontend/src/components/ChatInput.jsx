// // // src/components/ChatInput.jsx
// // import { useState } from "react";

// // export default function ChatInput({ sendMessage, loading }) {
// //   const [input, setInput] = useState("");

// //   const onSubmit = (e) => {
// //     e.preventDefault();
// //     if (!input.trim()) return;
// //     sendMessage(input.trim());
// //     setInput("");
// //   };

// //   return (
// //     <form className="chat-input" onSubmit={onSubmit}>
// //       <input
// //         type="text"
// //         placeholder="Type your message..."
// //         value={input}
// //         onChange={(e) => setInput(e.target.value)}
// //         disabled={loading}
// //         onKeyDown={(e) => {
// //           if (e.key === "Enter" && !e.shiftKey) {
// //             onSubmit(e);
// //           }
// //         }}
// //       />
// //       <button type="submit" disabled={loading || !input.trim()}>
// //         Send
// //       </button>
// //     </form>
// //   );
// // }

// // src/components/ChatInput.jsx
// import { useState, useRef } from "react";

// export default function ChatInput({ sendMessage, stopStreaming, loading }) {
//   const [input, setInput] = useState("");
//   const textareaRef = useRef(null);

//   const handleSubmit = () => {
//     if (!input.trim() || loading) return;
//     sendMessage(input.trim());
//     setInput("");
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   const handleInput = (e) => {
//     setInput(e.target.value);
//     // Auto-resize
//     const ta = textareaRef.current;
//     if (ta) {
//       ta.style.height = "auto";
//       ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
//     }
//   };

//   return (
//     <div className="chat-input-area">
//       <div className="input-wrapper">
//         <textarea
//           ref={textareaRef}
//           className="chat-textarea"
//           placeholder="Ask ThinkGPT anything…"
//           value={input}
//           onChange={handleInput}
//           onKeyDown={handleKeyDown}
//           disabled={loading}
//           rows={1}
//         />
//         <div className="input-actions">
//           {loading ? (
//             <button className="stop-btn-inline" onClick={stopStreaming} title="Stop generation">
//               ◼
//             </button>
//           ) : (
//             <button
//               className="send-btn"
//               onClick={handleSubmit}
//               disabled={!input.trim()}
//               title="Send message"
//             >
//               ↑
//             </button>
//           )}
//         </div>
//       </div>
//       <p className="input-hint">
//         Enter to send · Shift+Enter for new line · ThinkGPT can make mistakes
//       </p>
//     </div>
//   );
// }

// src/components/ChatInput.jsx
import { useState, useRef, forwardRef, useImperativeHandle } from "react";

const ChatInput = forwardRef(function ChatInput({ sendMessage, stopStreaming, loading }, ref) {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Expose prefill() so parent (ChatPage) can pre-fill from quick prompts
  useImperativeHandle(ref, () => ({
    prefill(text) {
      setInput(text);
      setTimeout(() => {
        const ta = textareaRef.current;
        if (ta) {
          ta.style.height = "auto";
          ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
          ta.focus();
          ta.setSelectionRange(text.length, text.length);
        }
      }, 0);
    },
  }));

  const handleSubmit = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className="chat-input-area">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Ask ThinkGPT anything…"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={1}
        />
        <div className="input-actions">
          {loading ? (
            <button className="stop-btn-inline" onClick={stopStreaming} title="Stop generation">
              ◼
            </button>
          ) : (
            <button
              className="send-btn"
              onClick={handleSubmit}
              disabled={!input.trim()}
              title="Send message"
            >
              ↑
            </button>
          )}
        </div>
      </div>
      <p className="input-hint">
        Enter to send · Shift+Enter for new line · ThinkGPT can make mistakes
      </p>
    </div>
  );
});

export default ChatInput;