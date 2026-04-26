// // frontend/src/components/MessageList.jsx
// import React from 'react';

// const MessageList = ({ messages = [] }) => {
//   if (!messages || !Array.isArray(messages)) {
//     return <div>No messages to display</div>;
//   }

//   return (
//     <div className="message-list">
//       {messages.map((message, index) => (
//         <div key={index} className={`message ${message.role}`}>
//           <div className="message-role">
//             {message.role === 'user' ? 'You' : 'Assistant'}
//           </div>
//           <div className="message-content">
//             {message.content || (message.isStreaming && <span className="typing-indicator">...</span>)}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MessageList;

// src/components/MessageList.jsx
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

const SUGGESTIONS = [
  "Explain quantum entanglement simply",
  "Write a React useEffect hook",
  "What is the Fermi paradox?",
  "Help me debug my Python code",
];

export default function MessageList({ messages = [], loading, onSuggestionClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="messages-area">
        <div className="empty-state">
          <div className="empty-orb">✦</div>
          <h3>Good to meet you.</h3>
          <p>I'm ThinkGPT — your AI thinking partner. Ask me anything, from code to concepts.</p>
          <div className="suggestion-chips">
            {SUGGESTIONS.map(s => (
              <div 
                key={s} 
                className="suggestion-chip"
                onClick={() => onSuggestionClick?.(s)}
                style={{ cursor: "pointer" }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-area">
      {messages.map((msg, i) => (
        <ChatMessage key={i} role={msg.role} content={msg.content} isStreaming={msg.isStreaming} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}