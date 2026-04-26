
// src/services/api.js
// // frontend/src/services/api.js
// import { API_BASE } from "../config";

// export const sendChat = async (message, model) => {
//   const res = await fetch(`${API_BASE}/chat`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message, model }),
//   });

//   if (!res.ok) throw new Error(await res.text());
//   return await res.json();
// };

// export const streamChat = async (message, model, onChunk, onError) => {
//   const controller = new AbortController();
//   let buffer = '';
  
//   try {
//     const res = await fetch(`${API_BASE}/stream?prompt=${encodeURIComponent(message)}&model=${model}`, {
//       signal: controller.signal,
//     });

//     if (!res.ok) {
//       const error = await res.text();
//       throw new Error(error);
//     }

//     const reader = res.body.getReader();
//     const decoder = new TextDecoder();
    
//     const processChunk = async () => {
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) {
//           // Handle any remaining buffered data
//           if (buffer.trim()) {
//             try {
//               const data = JSON.parse(buffer);
//               onChunk(data);
//             } catch (e) {
//               console.warn('Incomplete JSON in final chunk:', buffer);
//             }
//           }
//           onChunk({ done: true });
//           return;
//         }

//         // Decode and process the chunk
//         const chunk = decoder.decode(value, { stream: true });
//         buffer += chunk;

//         // Process complete lines
//         const lines = buffer.split('\n');
//         buffer = lines.pop(); // Keep the last incomplete line in buffer

//         for (const line of lines) {
//           if (!line.trim()) continue;
//           try {
//             const data = JSON.parse(line);
//             onChunk(data);
//           } catch (e) {
//             console.warn('Invalid JSON chunk:', line);
//           }
//         }
//       }
//     };

//     await processChunk();
//   } catch (error) {
//     if (error.name !== 'AbortError') {
//       onError?.(error);
//     }
//   }

//   return controller;
// };






// // frontend/src/services/api.js
// import { API_BASE } from "../config";

// export const sendChat = async (message, model) => {
//   const res = await fetch(`${API_BASE}/chat`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message, model }),
//   });

//   if (!res.ok) throw new Error(await res.text());
//   return await res.json();
// };

// export const streamChat = async (message, model, onChunk, onError) => {
//   const controller = new AbortController();
//   let buffer = "";

//   try {
//     const res = await fetch(`${API_BASE}/stream`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ message, model }),
//       signal: controller.signal,
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(errorText);
//     }

//     const reader = res.body.getReader();
//     const decoder = new TextDecoder();

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       buffer += decoder.decode(value, { stream: true });

//       const lines = buffer.split("\n");
//       buffer = lines.pop();

//       for (const line of lines) {
//         if (!line.trim()) continue;
//         try {
//           const json = JSON.parse(line);
//           onChunk(json);
//         } catch (e) {
//           console.warn("Invalid JSON chunk:", line);
//         }
//       }
//     }
//   } catch (error) {
//     if (error.name !== "AbortError") {
//       onError?.(error);
//     }
//   }

//   return controller;
// };


// frontend/src/services/api.js
import { API_BASE } from "../config";

export const sendChat = async (message, model) => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, model }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return await res.json();
};

export const streamChat = async (message, model, onChunk, onError) => {
  const controller = new AbortController();
  let buffer = "";

  try {
    const res = await fetch(`${API_BASE}/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, model }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          onChunk(json);
        } catch {
          console.warn("Invalid JSON chunk:", line);
        }
      }
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      onError?.(error);
    }
  }

  return controller;
};

// Get list of conversation sessions
export const getSessions = async () => {
  const res = await fetch(`${API_BASE}/sessions`);
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  
  return await res.json();
};

// Get messages for a specific session
export const getSessionMessages = async (sessionId) => {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/messages`);
  
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  
  return await res.json();
};
