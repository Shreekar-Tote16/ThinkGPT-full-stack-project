const Message = require("../models/Message");

async function loadSessionMessages(sessionId, limit = 10) {
  const messages = await Message.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(limit);

  return messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
}

module.exports = { loadSessionMessages };
