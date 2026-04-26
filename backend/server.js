// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Message = require("./models/Message");
const { generateResponse, generateStream } = require("./services/modelRouter");
const chatRoutes = require("./routes/chat.routes");

const app = express();

// ================= CONFIG =================
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const DEFAULT_MODEL   = process.env.MODEL || "groq-fast";
const PORT            = process.env.PORT  || 5000;
const MONGO_URI       = process.env.MONGO_URI;

// All model keys that support streaming
const STREAMING_MODELS = ["auto", "groq-fast", "groq-large", "groq-qwen", "groq-llama4"];

// ================= DATABASE =================
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✔ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));

// ================= MIDDLEWARE =================
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json({ limit: "2mb" }));

// ================= ROUTES =================
app.use("/api", chatRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// ADD THIS to backend/server.js  (alongside your existing routes)
// ─────────────────────────────────────────────────────────────────────────────

const { runGroq } = require("./services/providers/groq");

app.post("/api/ensemble-judge", async (req, res) => {
  const { prompt, candidates } = req.body;

  if (!prompt || !candidates || candidates.length === 0) {
    return res.status(400).json({ error: "prompt and candidates required" });
  }

  const judgePrompt = `
You are an expert AI judge evaluating responses from multiple AI models.

User question:
"${prompt}"

Below are the responses from different AI models:

${candidates
  .map((c, i) => `--- Answer ${i + 1} (${c.model}) ---\n${c.output}`)
  .join("\n\n")}

---
Your task:
- Identify most accurate, complete, and well-reasoned answer.
- If multiple answers are strong, synthesize them into one definitive response.
- Do NOT mention the models by name or reference this judging process.
- Return ONLY the final synthesized answer, ready to show the user.
- Use markdown formatting where appropriate.
`;

  try {
    const reply = await runGroq({
      model: "groq-large",
      messages: [
        {
          role: "system",
          content:
            "You are an expert judge. Synthesize the best answer from multiple AI responses without revealing the process.",
        },
        { role: "user", content: judgePrompt },
      ],
    });

    // Persist to MongoDB
    await Message.create({ role: "user",      content: prompt,  sessionId: "ensemble" });
    await Message.create({ role: "assistant", content: reply,   sessionId: "ensemble" });

    res.json({ reply });
  } catch (err) {
    console.error("Judge error:", err);
    res.status(500).json({ error: "Synthesis failed" });
  }
});

// ================= HEALTH =================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    model: DEFAULT_MODEL,
  });
});

// ================= NON-STREAM CHAT =================
app.post("/api/chat", async (req, res) => {
  try {
    const { message, model = DEFAULT_MODEL } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    await Message.create({ role: "user", content: message });

    const reply = await generateResponse({ prompt: message, model });

    await Message.create({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err.message);
    res.status(500).json({ error: err.message || "AI generation failed" });
  }
});

// ================= MODELS =================
app.get("/api/models", (req, res) => {
  res.json({
    default: DEFAULT_MODEL,
    available: [
      { id: "auto",        label: "Auto (Groq Fast)" },
      { id: "groq-fast",   label: "Llama 3.1 8B — Fast" },
      { id: "groq-large",  label: "Llama 3.3 70B — Powerful" },
      { id: "groq-qwen",   label: "Qwen 3 32B — Alibaba" },
      { id: "groq-llama4", label: "Llama 4 Scout — Latest" },
    ],
  });
});

// ================= START =================
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
