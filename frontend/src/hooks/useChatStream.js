

// // frontend/src/hooks/useChatStream.js
// import { useState, useRef } from "react";
// import { streamChat, sendChat } from "../services/api";

// export const useChatStream = () => {
//   const [messages, setMessages] = useState([]);
//   const [model, setModel] = useState("auto");
//   const [loading, setLoading] = useState(false);

//   const controllerRef = useRef(null);

//   const append = (msg) =>
//     setMessages((prev) => [...prev, msg]);

//   const updateAssistant = (chunk) => {
//     setMessages((prev) => {
//       const copy = [...prev];
//       const last = copy.length - 1;

//       if (!copy[last] || copy[last].role !== "assistant") return prev;

//       copy[last] = {
//         ...copy[last],
//         content: (copy[last].content || "") + chunk,
//       };

//       return copy;
//     });
//   };

//   const isStreamingModel =
//     model === "auto" ||
//     model === "local" ||
//     model.includes(":");

//   const sendMessage = async (text) => {
//     if (!text.trim()) return;

//     append({ role: "user", content: text });
//     append({ role: "assistant", content: "" });

//     setLoading(true);

//     try {
//       if (isStreamingModel) {
//         // ✅ STREAMING MODE
//         controllerRef.current = await streamChat(
//           text,
//           model,
//           (chunk) => {
//             if (chunk.done) {
//               setLoading(false);
//               return;
//             }

//             if (chunk.error) {
//               updateAssistant("❌ " + chunk.error);
//               setLoading(false);
//               return;
//             }

//             if (chunk.response) {
//               updateAssistant(chunk.response);
//             }
//           },
//           (err) => {
//             updateAssistant("❌ " + err.message);
//             setLoading(false);
//           }
//         );
//       } else {
//         // ✅ NON-STREAM (HF MODELS)
//         const res = await sendChat(text, model);
//         updateAssistant(res.reply);
//         setLoading(false);
//       }
//     } catch (err) {
//       updateAssistant("❌ " + err.message);
//       setLoading(false);
//     }
//   };

//   const stopStreaming = () => {
//     controllerRef.current?.abort();
//     setLoading(false);
//   };

//   return {
//     messages,
//     model,
//     setModel,
//     loading,
//     sendMessage,
//     stopStreaming,
//   };
// };


// src/hooks/useChatStream.js

import { useState, useRef, useEffect } from "react";

import {
  streamChat,
  sendChat,
  ensureGuestSession,
  getSessionMessages,
} from "../services/api";

const STREAMING_MODELS = [
  "auto",
  "groq-fast",
  "groq-large",
  "groq-qwen",
];

const SESSION_STORAGE_KEY = "thinkgpt.activeSessionId";

function createSessionId() {
  return crypto.randomUUID();
}

function getInitialSessionId() {
  const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (existing) return existing;

  const newId = createSessionId();
  sessionStorage.setItem(SESSION_STORAGE_KEY, newId);

  return newId;
}

export const useChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState("groq-fast");
  const [sessionId, setSessionId] = useState(getInitialSessionId);
  const [loading, setLoading] = useState(false);
  const [sessionsVersion, setSessionsVersion] = useState(0);

  const controllerRef = useRef(null);
  const requestIdRef = useRef(0);
  const initialSessionIdRef = useRef(sessionId);

  // Keep the active session ID in this browser tab.
  useEffect(() => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }, [sessionId]);

  // Restore the current conversation after a page refresh.
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        await ensureGuestSession();

        const history = await getSessionMessages(
          initialSessionIdRef.current
        );

        if (!cancelled) {
          setMessages(history);
        }
      } catch (error) {
        console.error("Failed to restore conversation:", error.message);
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateLast = (value, replace = false) => {
    setMessages((previous) => {
      const copy = [...previous];
      const last = copy.length - 1;

      if (last < 0 || copy[last].role !== "assistant") {
        return previous;
      }

      const oldContent = copy[last].content || "";

      copy[last] = {
        ...copy[last],
        content: replace ? value : oldContent + value,
      };

      return copy;
    });
  };

  const finishLast = () => {
    setMessages((previous) => {
      const copy = [...previous];
      const last = copy.length - 1;

      if (last < 0 || copy[last].role !== "assistant") {
        return previous;
      }

      copy[last] = {
        ...copy[last],
        isStreaming: false,
      };

      return copy;
    });
  };

  const sendMessage = async (text) => {
    const cleanText = text.trim();

    if (!cleanText || loading) return;

    const activeSessionId = sessionId;
    const requestId = ++requestIdRef.current;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: cleanText,
      },
      {
        role: "assistant",
        content: "",
        isStreaming: true,
      },
    ]);

    setLoading(true);

    const isStreaming = STREAMING_MODELS.includes(model);

    try {
      if (isStreaming) {
        // IMPORTANT: No await here.
        // Controller must be available immediately for Stop Generation.
        controllerRef.current = streamChat(
          cleanText,
          model,
          activeSessionId,

          (chunk) => {
            if (requestId !== requestIdRef.current) return;

            if (chunk.token) {
              updateLast(chunk.token);
            }

            if (chunk.done) {
              if (typeof chunk.response === "string") {
                updateLast(chunk.response, true);
              }

              finishLast();
            }

            if (chunk.error) {
              updateLast(`\n\n❌ ${chunk.error}`);
              finishLast();
            }
          },

          (error) => {
            if (requestId !== requestIdRef.current) return;

            updateLast(`❌ ${error.message}`);
            finishLast();
          },

          () => {
            if (requestId !== requestIdRef.current) return;

            setLoading(false);
            finishLast();
            setSessionsVersion((version) => version + 1);
            controllerRef.current = null;
          }
        );

      } else {
        const response = await sendChat(
          cleanText,
          model,
          activeSessionId
        );

        if (requestId !== requestIdRef.current) return;

        updateLast(response.reply || "No response.", true);
        finishLast();

        setLoading(false);
        setSessionsVersion((version) => version + 1);
      }

    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      updateLast(`❌ ${error.message}`);
      finishLast();

      setLoading(false);
      setSessionsVersion((version) => version + 1);
    }
  };

  // Start a fresh conversation without reloading the application.
  const newChat = () => {
    requestIdRef.current += 1;

    controllerRef.current?.abort();
    controllerRef.current = null;

    const newId = createSessionId();

    sessionStorage.setItem(SESSION_STORAGE_KEY, newId);

    setSessionId(newId);
    setMessages([]);
    setLoading(false);
  };

  // Restore a selected conversation.
  const loadSession = (selectedSessionId, sessionMessages) => {
    requestIdRef.current += 1;

    controllerRef.current?.abort();
    controllerRef.current = null;

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      selectedSessionId
    );

    setSessionId(selectedSessionId);
    setMessages(sessionMessages);
    setLoading(false);
  };

  // Cancel current generation.
  const stopStreaming = () => {
    requestIdRef.current += 1;

    controllerRef.current?.abort();
    controllerRef.current = null;

    setLoading(false);
    finishLast();

    setSessionsVersion((version) => version + 1);
  };

  return {
    messages,
    model,
    setModel,
    sessionId,
    loading,
    sessionsVersion,
    sendMessage,
    stopStreaming,
    loadSession,
    newChat,
  };
};
