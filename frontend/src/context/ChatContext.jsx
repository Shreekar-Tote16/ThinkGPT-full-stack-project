// // src/context/ChatContext.jsx
// import React, { createContext } from "react";

// export const ChatContext = createContext(null);

// export const ChatProvider = ({ children }) => {
//   // For now we don't need global state; placeholder for future features
//   return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;
// };

// src/context/ChatContext.jsx
import React, { createContext } from "react";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;
};