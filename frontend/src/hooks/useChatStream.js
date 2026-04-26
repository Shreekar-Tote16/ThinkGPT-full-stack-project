

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
import { useState, useRef } from "react";
import { streamChat, sendChat } from "../services/api";

// All current models support Groq streaming
const STREAMING_MODELS = ["auto", "groq-fast", "groq-large", "groq-qwen", "groq-llama4"];

export const useChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [model, setModel]       = useState("groq-fast");
  const [loading, setLoading]   = useState(false);
  const controllerRef           = useRef(null);

  const append = (msg) =>
    setMessages(prev => [...prev, msg]);

  const updateLast = (chunk) => {
    setMessages(prev => {
      const copy = [...prev];
      const last = copy.length - 1;
      if (last < 0 || copy[last].role !== "assistant") return prev;
      copy[last] = { ...copy[last], content: (copy[last].content || "") + chunk };
      return copy;
    });
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    append({ role: "user",      content: text });
    append({ role: "assistant", content: "", isStreaming: true });
    setLoading(true);

    const isStreaming = STREAMING_MODELS.includes(model);

    try {
      if (isStreaming) {
        controllerRef.current = await streamChat(
          text,
          model,
          (chunk) => {
            if (chunk.done)     { setLoading(false); return; }
            if (chunk.error)    { updateLast("❌ " + chunk.error); setLoading(false); return; }
            if (chunk.token)    { updateLast(chunk.token); }
            if (chunk.response) { updateLast(chunk.response); }
          },
          (err) => {
            updateLast("❌ " + err.message);
            setLoading(false);
          }
        );
      } else {
        // Fallback non-streaming (future models)
        const res = await sendChat(text, model);
        setMessages(prev => {
          const copy = [...prev];
          const last = copy.length - 1;
          if (last >= 0 && copy[last].role === "assistant") {
            copy[last] = { ...copy[last], content: res.reply || "No response.", isStreaming: false };
          }
          return copy;
        });
        setLoading(false);
      }
    } catch (err) {
      updateLast("❌ " + err.message);
      setLoading(false);
    }
  };

  const stopStreaming = () => {
    controllerRef.current?.abort?.();
    setLoading(false);
  };

  const loadSession = (sessionId, sessionMessages) => {
    setMessages(sessionMessages);
  };

  return { messages, model, setModel, loading, sendMessage, stopStreaming, loadSession };
};