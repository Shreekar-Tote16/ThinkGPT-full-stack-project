import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";

import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </StrictMode>
);