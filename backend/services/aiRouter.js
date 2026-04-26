// services/aiRouter.js
const { detectIntent } = require("../router/intentRouter");
const { callHFModel } = require("./providers/hfProvider");
const { callGroqModel } = require("./providers/groqProvider");

async function routeAndGenerate({
  prompt,
  userSelectedModel = null,
  history = [],
}) {
  // If user manually selected a model → override routing
  let routing;
  if (userSelectedModel) {
    routing = {
      intent: "manual",
      model: userSelectedModel,
      reason: "User-selected model",
    };
  } else {
    routing = detectIntent(prompt);
  }

  try {
    // HF first
    const response = await callHFModel({
      model: routing.model,
      prompt,
      history,
    });

    return {
      content: response,
      meta: routing,
      provider: "huggingface",
    };
  } catch (err) {
    console.warn("HF failed, falling back to Groq:", err.message);

    // Groq fallback
    const response = await callGroqModel({
      prompt,
      history,
    });

    return {
      content: response,
      meta: routing,
      provider: "groq",
    };
  }
}

module.exports = { routeAndGenerate };
