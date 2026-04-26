

// backend/services/providers/groq.js
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Verified ACTIVE Groq models — cross-checked against official deprecation page Feb 2026
const GROQ_MODELS = {
  "groq-fast":    "llama-3.1-8b-instant",                     // Meta — fast & lightweight
  "groq-large":   "llama-3.3-70b-versatile",                  // Meta — powerful general purpose
  "groq-qwen":    "qwen/qwen3-32b",                           // Alibaba Qwen 3 32B
  "groq-llama4":  "meta-llama/llama-4-scout-17b-16e-instruct", // Meta Llama 4 Scout — latest
};

async function runGroq({ messages, model = "groq-fast", stream = false, onToken }) {
  const selectedModel = GROQ_MODELS[model];

  if (!selectedModel) {
    throw new Error(
      `Unsupported Groq model key: "${model}". Valid keys: ${Object.keys(GROQ_MODELS).join(", ")}`
    );
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required and cannot be empty");
  }

  try {
    if (stream) {
      if (typeof onToken !== "function") {
        throw new Error("onToken callback is required for streaming");
      }

      const streamRes = await groq.chat.completions.create({
        messages,
        model: selectedModel,
        stream: true,
      });

      let fullResponse = "";
      for await (const chunk of streamRes) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (token) {
          fullResponse += token;
          onToken(token);
        }
      }
      return fullResponse;
    }

    // Non-streaming
    const res = await groq.chat.completions.create({
      messages,
      model: selectedModel,
    });
    return res.choices[0]?.message?.content || "";

  } catch (error) {
    console.error("Groq API Error:", error.message);

    if (error.status === 401) {
      throw new Error("Invalid Groq API key. Check your GROQ_API_KEY in .env");
    }
    if (error.status === 429) {
      throw new Error("Groq rate limit exceeded. Please try again later.");
    }
    if (error.status === 400 && error.message.includes("decommissioned")) {
      throw new Error(`Model decommissioned. Update GROQ_MODELS in groq.js`);
    }

    throw new Error(`Groq API error: ${error.message}`);
  }
}

module.exports = { runGroq };