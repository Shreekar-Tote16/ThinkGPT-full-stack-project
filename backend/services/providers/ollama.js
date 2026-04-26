//C:\Users\user\ThinkGPT\backend\services\providers\ollama.js
const axios = require("axios");

async function runOllama({ messages, model = "qwen2.5:0.5b", stream = false, onToken }) {
  const prompt = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const payload = {
    model,
    prompt,
    stream,
  };

  const res = await axios.post(
    `${process.env.OLLAMA_URL}/api/generate`,
    payload,
    { responseType: stream ? "stream" : "json" }
  );

  // NON-STREAM
  if (!stream) {
    return res.data.response;
  }

  // STREAM
  return new Promise((resolve, reject) => {
    res.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.response) {
            onToken(json.response);
          }
        } catch {}
      }
    });

    res.data.on("end", resolve);
    res.data.on("error", reject);
  });
}

module.exports = { runOllama };
