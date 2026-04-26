const axios = require("axios");

const HF_TOKEN = process.env.HF_API_KEY;

const HF_MODELS = {
  gemma: "google/gemma-2b-it",
  mistral: "mistralai/Mistral-7B-Instruct-v0.2",
  zephyr: "HuggingFaceH4/zephyr-7b-beta"
};

async function callHFModel({ model, messages, temperature = 0.7, max_tokens = 512 }) {
  const hfModel = HF_MODELS[model];
  if (!hfModel) throw new Error(`Unsupported HF model: ${model}`);

  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: hfModel,
        messages,
        temperature,
        max_tokens
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        timeout: 120000
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0].message) {
      throw new Error("Invalid response format from HF Router");
    }

    return response.data.choices[0].message.content;

  return response.data[0]?.generated_text || "No response";
}

module.exports = { callHFModel };
