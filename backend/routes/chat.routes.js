const express = require("express");
const router = express.Router();

const Message = require("../models/Message");
const { decideModel } = require("../services/router.service");
const { generateResponse } = require("../services/ollama.service");
const { generateStream } = require("../services/modelRouter");

// NON-STREAM CHAT
router.post("/chat", async (req, res) => {
  try {
    const { message, model: userModel } = req.body;

    const finalModel = decideModel({ message, userModel });

    await Message.create({ role: "user", content: message });

    const resp = await generateResponse({
      model: finalModel,
      prompt: message,
      stream: false,
    });

    const aiText = resp.data.response;

    await Message.create({ role: "assistant", content: aiText });

    res.json({
      reply: aiText,
      modelUsed: finalModel,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "AI error" });
  }
});

// STREAM CHAT
router.post("/stream", async (req, res) => {
  const { message, model = "groq-fast" } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message required" });
  }

  console.log(`📡 Streaming [${model}]:`, message.slice(0, 60));

  // Set headers for streaming
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  try {
    await Message.create({ role: "user", content: message });

    await generateStream({
      prompt: message,
      model,
      res,
      onDone: async (text) => {
        if (text) {
          await Message.create({ role: "assistant", content: text });
        }
      },
    });
    res.end();
  } catch (err) {
    console.error("❌ Streaming error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || "Streaming failed" });
    }
  }
});

// GET SESSIONS LIST
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await Message.aggregate([
      {
        $group: {
          _id: "$sessionId",
          lastMessage: { $last: "$content" },
          lastTimestamp: { $last: "$createdAt" },
          messageCount: { $sum: 1 }
        }
      },
      {
        $project: {
          sessionId: "$_id",
          title: { $substr: ["$lastMessage", 0, 50] },
          lastMessage: 1,
          timestamp: "$lastTimestamp",
          messageCount: 1,
          _id: 0
        }
      },
      { $sort: { timestamp: -1 } },
      { $limit: 20 }
    ]);

    const formattedSessions = sessions.map(session => ({
      id: session.sessionId,
      title: session.title.length < 50 ? session.title : session.title + "...",
      preview: session.lastMessage,
      time: formatRelativeTime(session.timestamp),
      messageCount: session.messageCount
    }));

    res.json(formattedSessions);
  } catch (err) {
    console.error("Error fetching sessions:", err.message);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

// GET SESSION MESSAGES
router.get("/sessions/:sessionId/messages", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await Message.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.createdAt
    }));

    res.json(formattedMessages);
  } catch (err) {
    console.error("Error fetching session messages:", err.message);
    res.status(500).json({ error: "Failed to fetch session messages" });
  }
});

// Helper function to format relative time
function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return days === 1 ? "Yesterday" : `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return "Just now";
}

module.exports = router;
