// // // //C:\Users\user\ThinkGPT\backend\routes\chat.routes.js
// // // const express = require("express");
// // // const router = express.Router();

// // // const Message = require("../models/Message");
// // // const { decideModel } = require("../services/router.service");
// // // const { generateResponse } = require("../services/modelRouter");
// // // const { generateStream } = require("../services/modelRouter");

// // // // NON-STREAM CHAT
// // // // router.post("/chat", async (req, res) => {
// // // //   try {
// // // //     const { message, model: userModel } = req.body;

// // // //     const finalModel = decideModel({ message, userModel });

// // // //     await Message.create({ role: "user", content: message });

// // // //     const resp = await generateResponse({
// // // //       model: finalModel,
// // // //       prompt: message,
// // // //       stream: false,
// // // //     });

// // // //     const aiText = resp.data.response;

// // // //     await Message.create({ role: "assistant", content: aiText });

// // // //     res.json({
// // // //       reply: aiText,
// // // //       modelUsed: finalModel,
// // // //     });
// // // //   } catch (err) {
// // // //     console.error(err.message);
// // // //     res.status(500).json({ error: "AI error" });
// // // //   }
// // // // });
// // // const aiText = await generateResponse({
// // //   model: finalModel,
// // //   prompt: message.trim(),
// // // });

// // // router.post("/chat", async (req, res) => {
// // //   try {
// // //     const {
// // //       message,
// // //       model: userModel = "groq-fast",
// // //       sessionId
// // //     } = req.body;

// // //     if (!message?.trim()) {
// // //       return res.status(400).json({
// // //         error: "Message required"
// // //       });
// // //     }

// // //     // Resolve the selected model
// // //     const finalModel = decideModel({
// // //       message,
// // //       userModel
// // //     });

// // //     // Save user message
// // //     await Message.create({
// // //       role: "user",
// // //       content: message.trim(),
// // //       sessionId
// // //     });

// // //     // Generate response using the new Groq model router
// // //     const aiText = await generateResponse({
// // //       model: finalModel,
// // //       prompt: message.trim()
// // //     });

// // //     // Save assistant response
// // //     await Message.create({
// // //       role: "assistant",
// // //       content: aiText,
// // //       sessionId
// // //     });

// // //     res.json({
// // //       reply: aiText,
// // //       modelUsed: finalModel
// // //     });

// // //   } catch (err) {
// // //     console.error("Chat error:", err.message);

// // //     res.status(500).json({
// // //       error: err.message || "AI generation failed"
// // //     });
// // //   }
// // // });

// // // // STREAM CHAT
// // // router.post("/stream", async (req, res) => {
// // //   const { message, model = "groq-fast" } = req.body;

// // //   if (!message?.trim()) {
// // //     return res.status(400).json({ error: "Message required" });
// // //   }

// // //   console.log(`📡 Streaming [${model}]:`, message.slice(0, 60));

// // //   // Set headers for streaming
// // //   res.writeHead(200, {
// // //     'Content-Type': 'text/plain',
// // //     'Transfer-Encoding': 'chunked',
// // //     'Access-Control-Allow-Origin': '*',
// // //     'Access-Control-Allow-Headers': 'Cache-Control'
// // //   });

// // //   try {
// // //     await Message.create({ role: "user", content: message });

// // //     await generateStream({
// // //       prompt: message,
// // //       model,
// // //       res,
// // //       onDone: async (text) => {
// // //         if (text) {
// // //           await Message.create({ role: "assistant", content: text });
// // //         }
// // //       },
// // //     });
// // //     res.end();
// // //   } catch (err) {
// // //     console.error("❌ Streaming error:", err.message);
// // //     if (!res.headersSent) {
// // //       res.status(500).json({ error: err.message || "Streaming failed" });
// // //     }
// // //   }
// // // });

// // // // GET SESSIONS LIST
// // // router.get("/sessions", async (req, res) => {
// // //   try {
// // //     const sessions = await Message.aggregate([
// // //       {
// // //         $group: {
// // //           _id: "$sessionId",
// // //           lastMessage: { $last: "$content" },
// // //           lastTimestamp: { $last: "$createdAt" },
// // //           messageCount: { $sum: 1 }
// // //         }
// // //       },
// // //       {
// // //         $project: {
// // //           sessionId: "$_id",
// // //           title: { $substr: ["$lastMessage", 0, 50] },
// // //           lastMessage: 1,
// // //           timestamp: "$lastTimestamp",
// // //           messageCount: 1,
// // //           _id: 0
// // //         }
// // //       },
// // //       { $sort: { timestamp: -1 } },
// // //       { $limit: 20 }
// // //     ]);

// // //     const formattedSessions = sessions.map(session => ({
// // //       id: session.sessionId,
// // //       title: session.title.length < 50 ? session.title : session.title + "...",
// // //       preview: session.lastMessage,
// // //       time: formatRelativeTime(session.timestamp),
// // //       messageCount: session.messageCount
// // //     }));

// // //     res.json(formattedSessions);
// // //   } catch (err) {
// // //     console.error("Error fetching sessions:", err.message);
// // //     res.status(500).json({ error: "Failed to fetch sessions" });
// // //   }
// // // });

// // // // GET SESSION MESSAGES
// // // router.get("/sessions/:sessionId/messages", async (req, res) => {
// // //   try {
// // //     const { sessionId } = req.params;
// // //     const messages = await Message.find({ sessionId })
// // //       .sort({ createdAt: 1 })
// // //       .lean();

// // //     const formattedMessages = messages.map(msg => ({
// // //       role: msg.role,
// // //       content: msg.content,
// // //       timestamp: msg.createdAt
// // //     }));

// // //     res.json(formattedMessages);
// // //   } catch (err) {
// // //     console.error("Error fetching session messages:", err.message);
// // //     res.status(500).json({ error: "Failed to fetch session messages" });
// // //   }
// // // });

// // // // Helper function to format relative time
// // // function formatRelativeTime(date) {
// // //   const now = new Date();
// // //   const diff = now - new Date(date);
// // //   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
// // //   const hours = Math.floor(diff / (1000 * 60 * 60));
// // //   const minutes = Math.floor(diff / (1000 * 60));

// // //   if (days > 0) return days === 1 ? "Yesterday" : `${days} days ago`;
// // //   if (hours > 0) return `${hours} hours ago`;
// // //   if (minutes > 0) return `${minutes} minutes ago`;
// // //   return "Just now";
// // // }

// // // module.exports = router;

// // //C:\Users\user\ThinkGPT\backend\routes\chat.routes.js
// // const express = require("express");
// // const router = express.Router();

// // const Message = require("../models/Message");
// // const { decideModel } = require("../services/router.service");
// // const {
// //   generateResponse,
// //   generateStream,
// // } = require("../services/modelRouter");

// // const SESSION_ID_REGEX =
// //   /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// // function validSessionId(sessionId) {
// //   return (
// //     typeof sessionId === "string" &&
// //     SESSION_ID_REGEX.test(sessionId)
// //   );
// // }

// // function formatRelativeTime(date) {
// //   const diff = Math.max(0, Date.now() - new Date(date).getTime());

// //   const days = Math.floor(diff / 86400000);
// //   const hours = Math.floor(diff / 3600000);
// //   const minutes = Math.floor(diff / 60000);

// //   if (days > 0) return days === 1 ? "Yesterday" : `${days} days ago`;
// //   if (hours > 0) return `${hours} hours ago`;
// //   if (minutes > 0) return `${minutes} minutes ago`;

// //   return "Just now";
// // }

// // function validateChatRequest(req, res) {
// //   const { message, sessionId } = req.body;

// //   if (typeof message !== "string" || !message.trim()) {
// //     res.status(400).json({ error: "Message required" });
// //     return false;
// //   }

// //   if (message.length > 20000) {
// //     res.status(413).json({ error: "Message is too long" });
// //     return false;
// //   }

// //   if (!validSessionId(sessionId)) {
// //     res.status(400).json({ error: "Invalid session ID" });
// //     return false;
// //   }

// //   return true;
// // }

// // // ================= NORMAL CHAT =================

// // router.post("/chat", async (req, res) => {
// //   try {
// //     if (!validateChatRequest(req, res)) return;

// //     const { message, sessionId, model = "groq-fast" } = req.body;

// //     const finalModel = decideModel({
// //       message,
// //       userModel: model,
// //     });

// //     await Message.create({
// //       guestId: req.guestId,
// //       sessionId,
// //       role: "user",
// //       content: message.trim(),
// //     });

// //     // Uses Groq modelRouter, not Ollama.
// //     const reply = await generateResponse({
// //       prompt: message.trim(),
// //       model: finalModel,
// //     });

// //     await Message.create({
// //       guestId: req.guestId,
// //       sessionId,
// //       role: "assistant",
// //       content: reply,
// //     });

// //     res.json({
// //       reply,
// //       modelUsed: finalModel,
// //       sessionId,
// //     });
// //   } catch (error) {
// //     console.error("Chat error:", error.message);

// //     res.status(500).json({
// //       error: error.message || "AI generation failed",
// //     });
// //   }
// // });

// // // ================= STREAMING CHAT =================

// // router.post("/stream", async (req, res) => {
// //   if (!validateChatRequest(req, res)) return;

// //   const {
// //   message,
// //   sessionId,
// //   model = "groq-fast",
// //   persist = true,
// // } = req.body;

// // const shouldPersist = persist !== false;

// //   let finalModel;

// //   try {
// //     finalModel = decideModel({
// //       message,
// //       userModel: model,
// //     });
// //   } catch (error) {
// //     return res.status(400).json({ error: error.message });
// //   }

// //   console.log(`Streaming [${finalModel}]:`, message.slice(0, 60));

// //   res.status(200).set({
// //     "Content-Type": "application/x-ndjson; charset=utf-8",
// //     "Cache-Control": "no-cache, no-store, no-transform",
// //     "X-Accel-Buffering": "no",
// //   });

// //   res.flushHeaders?.();

// //   const abortController = new AbortController();

// //   // Stop upstream generation when the visitor disconnects.
// //   res.on("close", () => {
// //     if (!res.writableEnded) {
// //       abortController.abort();
// //     }
// //   });

// //   try {
// // if (shouldPersist) {
// //   await Message.create({
// //     guestId: req.guestId,
// //     sessionId,
// //     role: "user",
// //     content: message.trim(),
// //   });
// // }

// //     await generateStream({
// //       prompt: message.trim(),
// //       model: finalModel,
// //       res,
// //       signal: abortController.signal,

// //       onDone: async (text) => {
// //   if (shouldPersist && text && !abortController.signal.aborted) {
// //     await Message.create({
// //       guestId: req.guestId,
// //       sessionId,
// //       role: "assistant",
// //       content: text,
// //     });
// //   }
// // },
// //     });
// //   } catch (error) {
// //     console.error("Streaming error:", error.message);

// //     if (
// //       !abortController.signal.aborted &&
// //       !res.destroyed &&
// //       !res.writableEnded
// //     ) {
// //       res.write(
// //         JSON.stringify({ error: error.message || "Streaming failed" }) + "\n"
// //       );
// //     }
// //   } finally {
// //     if (!res.destroyed && !res.writableEnded) {
// //       res.end();
// //     }
// //   }
// // });

// // // ================= GET GUEST SESSIONS =================

// // router.get("/sessions", async (req, res) => {
// //   try {
// //     const sessions = await Message.aggregate([
// //       {
// //         $match: { guestId: req.guestId },
// //       },
// //       {
// //         $sort: { createdAt: 1, _id: 1 },
// //       },
// //       {
// //         $group: {
// //           _id: "$sessionId",
// //           title: { $first: "$content" },
// //           lastMessage: { $last: "$content" },
// //           timestamp: { $last: "$createdAt" },
// //           messageCount: { $sum: 1 },
// //         },
// //       },
// //       {
// //         $sort: { timestamp: -1 },
// //       },
// //       {
// //         $limit: 30,
// //       },
// //     ]);

// //     res.json(
// //       sessions.map((session) => ({
// //         id: session._id,
// //         title: (session.title || "New conversation").slice(0, 50),
// //         preview: (session.lastMessage || "").slice(0, 100),
// //         time: formatRelativeTime(session.timestamp),
// //         messageCount: session.messageCount,
// //       }))
// //     );
// //   } catch (error) {
// //     console.error("Session list error:", error.message);

// //     res.status(500).json({
// //       error: "Failed to fetch sessions",
// //     });
// //   }
// // });

// // // ================= GET SESSION MESSAGES =================

// // router.get("/sessions/:sessionId/messages", async (req, res) => {
// //   try {
// //     const { sessionId } = req.params;

// //     if (!validSessionId(sessionId)) {
// //       return res.status(400).json({ error: "Invalid session ID" });
// //     }

// //     // Both guestId and sessionId are mandatory filters.
// //     const messages = await Message.find({
// //       guestId: req.guestId,
// //       sessionId,
// //     })
// //       .sort({ createdAt: 1 })
// //       .select("role content createdAt")
// //       .lean();

// //     res.json(
// //       messages.map((msg) => ({
// //         role: msg.role,
// //         content: msg.content,
// //         timestamp: msg.createdAt,
// //       }))
// //     );
// //   } catch (error) {
// //     console.error("Session messages error:", error.message);

// //     res.status(500).json({
// //       error: "Failed to fetch session messages",
// //     });
// //   }
// // });

// // module.exports = router;

// //C:\Users\user\ThinkGPT\backend\routes\chat.routes.js
// const express = require("express");
// const router = express.Router();

// const Message = require("../models/Message");
// const { decideModel } = require("../services/router.service");
// const {
//   getOwnerFilter,
//   loadConversationHistory,
//   buildConversationMessages,
// } = require("../utils/conversationContext");
// const {
//   generateResponse,
//   generateStream,
// } = require("../services/modelRouter");

// const SESSION_ID_REGEX =
//   /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// // ==========================================
// // OWNERSHIP HELPERS
// // ==========================================

// // A registered user accesses messages using userId.
// // A guest accesses only unclaimed messages belonging
// // to their verified guest identity.

// // function getOwnerFilter(req) {
// //   if (req.user && req.user._id) {
// //     return {
// //       userId: req.user._id,
// //     };
// //   }

// //   return {
// //     guestId: req.guestId,
// //     userId: null,
// //   };
// // }

// // Every new message keeps the guest identity for continuity.
// // Registered-user messages additionally receive userId.

// function getOwnerFields(req) {
//   return {
//     guestId: req.guestId,
//     userId: req.user?._id || null,
//   };
// }

// // ==========================================
// // VALIDATION
// // ==========================================

// function validSessionId(sessionId) {
//   return (
//     typeof sessionId === "string" &&
//     SESSION_ID_REGEX.test(sessionId)
//   );
// }

// function validateChatRequest(req, res) {
//   const { message, sessionId } = req.body || {};

//   if (
//     typeof message !== "string" ||
//     !message.trim()
//   ) {
//     res.status(400).json({
//       error: "Message required.",
//     });

//     return false;
//   }

//   if (message.length > 20000) {
//     res.status(413).json({
//       error: "Message is too long.",
//     });

//     return false;
//   }

//   if (!validSessionId(sessionId)) {
//     res.status(400).json({
//       error: "Invalid session ID.",
//     });

//     return false;
//   }

//   return true;
// }

// // ==========================================
// // TIME FORMATTER
// // ==========================================

// function formatRelativeTime(date) {
//   const diff = Math.max(
//     0,
//     Date.now() - new Date(date).getTime()
//   );

//   const days = Math.floor(diff / 86400000);
//   const hours = Math.floor(diff / 3600000);
//   const minutes = Math.floor(diff / 60000);

//   if (days > 0) {
//     return days === 1 ? "Yesterday" : `${days} days ago`;
//   }

//   if (hours > 0) {
//     return `${hours} hours ago`;
//   }

//   if (minutes > 0) {
//     return `${minutes} minutes ago`;
//   }

//   return "Just now";
// }

// // ==========================================
// // NORMAL CHAT
// // POST /api/chat
// // ==========================================

// router.post("/chat", async (req, res) => {
//   try {
//     if (!validateChatRequest(req, res)) {
//       return;
//     }

//     const {
//       message,
//       sessionId,
//       model = "groq-fast",
//     } = req.body;

//     const finalModel = decideModel({
//       message,
//       userModel: model,
//     });

// const ownerFields = getOwnerFields(req);

// // Load previous messages BEFORE saving the current prompt.
// const history = await loadConversationHistory(
//   req,
//   sessionId
// );

// // Prepare system instructions + previous conversation + current prompt.
// const messages = buildConversationMessages(
//   history,
//   message.trim()
// );

// // Save the new user message.
// await Message.create({
//   ...ownerFields,
//   sessionId,
//   role: "user",
//   content: message.trim(),
// });

// // Generate using the entire conversation.
// const reply = await generateResponse({
//   messages,
//   model: finalModel,
// });

// if (
//   typeof reply !== "string" ||
//   !reply.trim()
// ) {
//   throw new Error("The AI returned an empty response.");
// }

// // Save assistant response.
// await Message.create({
//   ...ownerFields,
//   sessionId,
//   role: "assistant",
//   content: reply,
// });

// return res.json({
//   reply,
//   modelUsed: finalModel,
//   sessionId,
// });

//   } catch (error) {
//     console.error("Chat error:", error.message);

//     if (
//       res.headersSent ||
//       res.writableEnded ||
//       res.destroyed
//     ) {
//       return;
//     }

//     return res.status(500).json({
//       error: error.message || "AI generation failed.",
//     });
//   }
// });

// // ==========================================
// // STREAMING CHAT
// // POST /api/stream
// // ==========================================

// router.post("/stream", async (req, res) => {
//   if (!validateChatRequest(req, res)) {
//     return;
//   }

//   const {
//     message,
//     sessionId,
//     model = "groq-fast",
//     persist = true,
//   } = req.body;

//   // Ensemble candidates use persist:false.
//   const shouldPersist = persist !== false;

//   let finalModel;

//   // try {
//   //   finalModel = decideModel({
//   //     message,
//   //     userModel: model,
//   //   });
//   try {
//   // Fetch previous conversation before saving the current prompt.
//   const history = await loadConversationHistory(
//     req,
//     sessionId
//   );

//   const messages = buildConversationMessages(
//     history,
//     message.trim()
//   );

//   // Save the current prompt only for normal chat requests.
//   // Ensemble candidate calls use persist:false.
//   if (shouldPersist) {
//     await Message.create({
//       ...ownerFields,
//       sessionId,
//       role: "user",
//       content: message.trim(),
//     });
//   }

//   if (
//     abortController.signal.aborted ||
//     res.destroyed
//   ) {
//     return;
//   }

//   console.log(
//     `Streaming [${finalModel}] for ${
//       req.user ? "registered user" : "guest"
//     }:`,
//     message.slice(0, 60)
//   );

//   res.status(200).set({
//     "Content-Type": "application/x-ndjson; charset=utf-8",
//     "Cache-Control": "no-cache, no-store, no-transform",
//     "X-Accel-Buffering": "no",
//   });

//   res.flushHeaders?.();

//   streamingStarted = true;

//   await generateStream({
//     messages,
//     model: finalModel,
//     res,
//     signal: abortController.signal,

//     onDone: async (text) => {
//       if (
//         shouldPersist &&
//         typeof text === "string" &&
//         text.trim() &&
//         !abortController.signal.aborted
//       ) {
//         await Message.create({
//           ...ownerFields,
//           sessionId,
//           role: "assistant",
//           content: text,
//         });
//       }
//     },
//   });

// } catch (error) {
//   // Keep your existing catch and finally blocks unchanged.
//     return res.status(400).json({
//       error: error.message,
//     });
//   }

//   const ownerFields = getOwnerFields(req);

//   const abortController = new AbortController();

//   let streamingStarted = false;

//   // Stop upstream generation if the browser disconnects.
//   res.on("close", () => {
//     if (!res.writableEnded) {
//       abortController.abort();
//     }
//   });

//   try {
//     // Persist the user prompt before sending streaming headers.
//     // This allows database errors to return a normal HTTP error.

//     if (shouldPersist) {
//       await Message.create({
//         ...ownerFields,
//         sessionId,
//         role: "user",
//         content: message.trim(),
//       });
//     }

//     if (
//       abortController.signal.aborted ||
//       res.destroyed
//     ) {
//       return;
//     }

//     console.log(
//       `Streaming [${finalModel}] for ${
//         req.user ? "registered user" : "guest"
//       }:`,
//       message.slice(0, 60)
//     );

//     res.status(200).set({
//       "Content-Type": "application/x-ndjson; charset=utf-8",
//       "Cache-Control": "no-cache, no-store, no-transform",
//       "X-Accel-Buffering": "no",
//     });

//     res.flushHeaders?.();

//     streamingStarted = true;

//     await generateStream({
//       prompt: message.trim(),
//       model: finalModel,
//       res,
//       signal: abortController.signal,

//       onDone: async (text) => {
//         // Candidate streams are intentionally not persisted.
//         if (
//           shouldPersist &&
//           typeof text === "string" &&
//           text.trim() &&
//           !abortController.signal.aborted
//         ) {
//           await Message.create({
//             ...ownerFields,
//             sessionId,
//             role: "assistant",
//             content: text,
//           });
//         }
//       },
//     });

//   } catch (error) {
//     console.error("Streaming error:", error.message);

//     if (
//       abortController.signal.aborted ||
//       res.destroyed ||
//       res.writableEnded
//     ) {
//       return;
//     }

//     if (!streamingStarted) {
//       return res.status(500).json({
//         error: error.message || "Streaming failed.",
//       });
//     }

//     // Headers have already been sent, so return the error
//     // in the existing NDJSON stream format.
//     res.write(
//       JSON.stringify({
//         error: error.message || "Streaming failed.",
//       }) + "\n"
//     );

//   } finally {
//     if (
//       streamingStarted &&
//       !res.destroyed &&
//       !res.writableEnded
//     ) {
//       res.end();
//     }
//   }
// });

// // ==========================================
// // GET CONVERSATION LIST
// // GET /api/sessions
// // ==========================================

// router.get("/sessions", async (req, res) => {
//   try {
//     const ownerFilter = getOwnerFilter(req);

//     const sessions = await Message.aggregate([
//       {
//         $match: ownerFilter,
//       },
//       {
//         $sort: {
//           createdAt: 1,
//           _id: 1,
//         },
//       },
//       {
//         $group: {
//           _id: "$sessionId",

//           // First message becomes conversation title.
//           title: {
//             $first: {
//               $cond: [
//                 { $eq: ["$role", "user"] },
//                 "$content",
//                 "New conversation",
//               ],
//             },
//           },

//           lastMessage: {
//             $last: "$content",
//           },

//           timestamp: {
//             $last: "$createdAt",
//           },

//           messageCount: {
//             $sum: 1,
//           },
//         },
//       },
//       {
//         $sort: {
//           timestamp: -1,
//         },
//       },
//       {
//         $limit: 50,
//       },
//     ]);

//     return res.json(
//       sessions.map((session) => ({
//         id: session._id,

//         title: (
//           session.title || "New conversation"
//         ).slice(0, 70),

//         preview: (
//           session.lastMessage || ""
//         ).slice(0, 120),

//         time: formatRelativeTime(session.timestamp),

//         messageCount: session.messageCount,
//       }))
//     );

//   } catch (error) {
//     console.error(
//       "Session list error:",
//       error.message
//     );

//     return res.status(500).json({
//       error: "Failed to fetch conversations.",
//     });
//   }
// });

// // ==========================================
// // GET CONVERSATION MESSAGES
// // GET /api/sessions/:sessionId/messages
// // ==========================================

// router.get(
//   "/sessions/:sessionId/messages",
//   async (req, res) => {
//     try {
//       const { sessionId } = req.params;

//       if (!validSessionId(sessionId)) {
//         return res.status(400).json({
//           error: "Invalid session ID.",
//         });
//       }

//       const ownerFilter = getOwnerFilter(req);

//       // Ownership and session ID must both match.
//       const messages = await Message.find({
//         ...ownerFilter,
//         sessionId,
//       })
//         .sort({
//           createdAt: 1,
//           _id: 1,
//         })
//         .select("role content createdAt")
//         .lean();

//       return res.json(
//         messages.map((msg) => ({
//           role: msg.role,
//           content: msg.content,
//           timestamp: msg.createdAt,
//         }))
//       );

//     } catch (error) {
//       console.error(
//         "Session messages error:",
//         error.message
//       );

//       return res.status(500).json({
//         error: "Failed to fetch conversation messages.",
//       });
//     }
//   }
// );

// module.exports = router;


const express = require("express");
const router = express.Router();

const Message = require("../models/Message");

const { decideModel } = require("../services/router.service");

const {
  generateResponse,
  generateStream,
} = require("../services/modelRouter");

const {
  getOwnerFilter,
  loadConversationHistory,
  buildConversationMessages,
} = require("../utils/conversationContext");

const SESSION_ID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ==========================================
// OWNERSHIP HELPERS
// ==========================================

// Every new message keeps the verified guest identity.
// Registered-user messages additionally receive userId.

function getOwnerFields(req) {
  return {
    guestId: req.guestId,
    userId: req.user?._id || null,
  };
}

// ==========================================
// VALIDATION
// ==========================================

function validSessionId(sessionId) {
  return (
    typeof sessionId === "string" &&
    SESSION_ID_REGEX.test(sessionId)
  );
}

function validateChatRequest(req, res) {
  const { message, sessionId } = req.body || {};

  if (
    typeof message !== "string" ||
    !message.trim()
  ) {
    res.status(400).json({
      error: "Message required.",
    });

    return false;
  }

  if (message.length > 20000) {
    res.status(413).json({
      error: "Message is too long.",
    });

    return false;
  }

  if (!validSessionId(sessionId)) {
    res.status(400).json({
      error: "Invalid session ID.",
    });

    return false;
  }

  return true;
}

// ==========================================
// TIME FORMATTER
// ==========================================

function formatRelativeTime(date) {
  const diff = Math.max(
    0,
    Date.now() - new Date(date).getTime()
  );

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor(diff / 60000);

  if (days > 0) {
    return days === 1 ? "Yesterday" : `${days} days ago`;
  }

  if (hours > 0) {
    return `${hours} hours ago`;
  }

  if (minutes > 0) {
    return `${minutes} minutes ago`;
  }

  return "Just now";
}

// ==========================================
// NORMAL CHAT
// POST /api/chat
// ==========================================

router.post("/chat", async (req, res) => {
  try {
    if (!validateChatRequest(req, res)) {
      return;
    }

    const {
      message,
      sessionId,
      model = "groq-fast",
    } = req.body;

    const finalModel = decideModel({
      message,
      userModel: model,
    });

    const ownerFields = getOwnerFields(req);

    // IMPORTANT:
    // Load previous history before saving the current prompt.
    const history = await loadConversationHistory(
      req,
      sessionId
    );

    const messages = buildConversationMessages(
      history,
      message.trim()
    );

    // Save the current user message.
    await Message.create({
      ...ownerFields,
      sessionId,
      role: "user",
      content: message.trim(),
    });

    // Generate using the full conversation context.
    const reply = await generateResponse({
      messages,
      model: finalModel,
    });

    if (
      typeof reply !== "string" ||
      !reply.trim()
    ) {
      throw new Error("The AI returned an empty response.");
    }

    // Save assistant response.
    await Message.create({
      ...ownerFields,
      sessionId,
      role: "assistant",
      content: reply,
    });

    return res.json({
      reply,
      modelUsed: finalModel,
      sessionId,
    });

  } catch (error) {
    console.error("Chat error:", error.message);

    if (
      res.headersSent ||
      res.writableEnded ||
      res.destroyed
    ) {
      return;
    }

    return res.status(500).json({
      error: error.message || "AI generation failed.",
    });
  }
});

// ==========================================
// STREAMING CHAT
// POST /api/stream
// ==========================================

router.post("/stream", async (req, res) => {
  if (!validateChatRequest(req, res)) {
    return;
  }

  const {
    message,
    sessionId,
    model = "groq-fast",
    persist = true,
  } = req.body;

  // Ensemble candidate streams use persist:false.
  const shouldPersist = persist !== false;

  let finalModel;

  try {
    finalModel = decideModel({
      message,
      userModel: model,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }

  const ownerFields = getOwnerFields(req);

  const abortController = new AbortController();

  let streamingStarted = false;

  // Cancel generation if the browser disconnects.
  res.on("close", () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
  });

  try {
    // Load conversation history BEFORE saving the current prompt.
    const history = await loadConversationHistory(
      req,
      sessionId
    );

    const messages = buildConversationMessages(
      history,
      message.trim()
    );

    // Normal chat saves the current user message.
    // Ensemble candidate requests do not save duplicates.
    if (shouldPersist) {
      await Message.create({
        ...ownerFields,
        sessionId,
        role: "user",
        content: message.trim(),
      });
    }

    if (
      abortController.signal.aborted ||
      res.destroyed
    ) {
      return;
    }

    console.log(
      `Streaming [${finalModel}] for ${
        req.user ? "registered user" : "guest"
      }:`,
      message.slice(0, 60)
    );

    res.status(200).set({
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      "X-Accel-Buffering": "no",
    });

    res.flushHeaders?.();

    streamingStarted = true;

    await generateStream({
      messages,
      model: finalModel,
      res,
      signal: abortController.signal,

      onDone: async (text) => {
        // Save only normal chat assistant responses.
        if (
          shouldPersist &&
          typeof text === "string" &&
          text.trim() &&
          !abortController.signal.aborted
        ) {
          await Message.create({
            ...ownerFields,
            sessionId,
            role: "assistant",
            content: text,
          });
        }
      },
    });

  } catch (error) {
    console.error("Streaming error:", error.message);

    if (
      abortController.signal.aborted ||
      res.destroyed ||
      res.writableEnded
    ) {
      return;
    }

    if (!streamingStarted) {
      return res.status(500).json({
        error: error.message || "Streaming failed.",
      });
    }

    // Headers are already sent. Return the error as NDJSON.
    res.write(
      JSON.stringify({
        error: error.message || "Streaming failed.",
      }) + "\n"
    );

  } finally {
    if (
      streamingStarted &&
      !res.destroyed &&
      !res.writableEnded
    ) {
      res.end();
    }
  }
});

// ==========================================
// GET CONVERSATION LIST
// GET /api/sessions
// ==========================================

router.get("/sessions", async (req, res) => {
  try {
    const ownerFilter = getOwnerFilter(req);

    const sessions = await Message.aggregate([
      {
        $match: ownerFilter,
      },
      {
        $sort: {
          createdAt: 1,
          _id: 1,
        },
      },
      {
        $group: {
          _id: "$sessionId",

          title: {
            $first: {
              $cond: [
                { $eq: ["$role", "user"] },
                "$content",
                "New conversation",
              ],
            },
          },

          lastMessage: {
            $last: "$content",
          },

          timestamp: {
            $last: "$createdAt",
          },

          messageCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          timestamp: -1,
        },
      },
      {
        $limit: 50,
      },
    ]);

    return res.json(
      sessions.map((session) => ({
        id: session._id,

        title: (
          session.title || "New conversation"
        ).slice(0, 70),

        preview: (
          session.lastMessage || ""
        ).slice(0, 120),

        time: formatRelativeTime(session.timestamp),

        messageCount: session.messageCount,
      }))
    );

  } catch (error) {
    console.error(
      "Session list error:",
      error.message
    );

    return res.status(500).json({
      error: "Failed to fetch conversations.",
    });
  }
});

// ==========================================
// GET CONVERSATION MESSAGES
// GET /api/sessions/:sessionId/messages
// ==========================================

router.get(
  "/sessions/:sessionId/messages",
  async (req, res) => {
    try {
      const { sessionId } = req.params;

      if (!validSessionId(sessionId)) {
        return res.status(400).json({
          error: "Invalid session ID.",
        });
      }

      const ownerFilter = getOwnerFilter(req);

      // Only return messages belonging to this owner
      // and the requested conversation.
      const messages = await Message.find({
        ...ownerFilter,
        sessionId,
      })
        .sort({
          createdAt: 1,
          _id: 1,
        })
        .select("role content createdAt")
        .lean();

      return res.json(
        messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
        }))
      );

    } catch (error) {
      console.error(
        "Session messages error:",
        error.message
      );

      return res.status(500).json({
        error: "Failed to fetch conversation messages.",
      });
    }
  }
);

module.exports = router;
