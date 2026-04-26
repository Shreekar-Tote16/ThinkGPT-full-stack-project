// services/ollama.service.js
const axios = require("axios");

const OLLAMA_URL = process.env.OLLAMA_URL;

async function generateResponse({ model, prompt, stream = false }) {
  return axios.post(
    `${OLLAMA_URL}/api/generate`,
    {
      model,
      prompt,
      stream,
    },
    {
      headers: { "Content-Type": "application/json" },
      responseType: stream ? "stream" : "json",
    }
  );
}

module.exports = { generateResponse };
