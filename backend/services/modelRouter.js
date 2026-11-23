//C:\Users\user\ThinkGPT\backend\services\modelRouter.js
const { runGroq } = require("./providers/groq");
const { runCloudflare } = require("./providers/cloudflare");

// ==========================================
// PROVIDER REGISTRY
// ==========================================

const MODEL_PROVIDERS = {
  "groq-fast": runGroq,
  "groq-large": runGroq,

  "cloudflare-gemma": runCloudflare,
  "cloudflare-glm": runCloudflare,
};

// ==========================================
// PROVIDER RESOLUTION
// ==========================================

function getProvider(model) {
  const provider = MODEL_PROVIDERS[model];

  if (!provider) {
    throw new Error(
      `Unsupported model "${model}". Available models: ${
        Object.keys(MODEL_PROVIDERS).join(", ")
      }`
    );
  }

  return provider;
}

// ==========================================
// MESSAGE NORMALIZATION
// ==========================================

function normalizeMessages({ prompt, messages }) {
  if (Array.isArray(messages) && messages.length > 0) {
    return messages;
  }

  if (typeof prompt === "string" && prompt.trim()) {
    return [
      {
        role: "user",
        content: prompt.trim(),
      },
    ];
  }

  throw new Error("A valid prompt or messages array is required.");
}

// ==========================================
// NORMAL GENERATION
// ==========================================

async function generateResponse({
  prompt,
  messages,
  model = "groq-fast",
  signal,
}) {
  const provider = getProvider(model);

  const normalizedMessages = normalizeMessages({
    prompt,
    messages,
  });

  return provider({
    messages: normalizedMessages,
    model,
    stream: false,
    signal,
  });
}

// ==========================================
// STREAMING GENERATION
// ==========================================

async function generateStream({
  prompt,
  messages,
  model = "groq-fast",
  res,
  onDone,
  signal,
}) {
  if (!res) {
    throw new Error("Express response object is required.");
  }

  if (signal?.aborted) {
    throw new Error("Generation cancelled.");
  }

  const provider = getProvider(model);

  const normalizedMessages = normalizeMessages({
    prompt,
    messages,
  });

  let fullResponse = "";

  try {
    const response = await provider({
      messages: normalizedMessages,
      model,
      stream: true,
      signal,

      onToken: (token) => {
        if (
          signal?.aborted ||
          res.destroyed ||
          res.writableEnded
        ) {
          return;
        }

        fullResponse += token;

        // Existing ThinkGPT NDJSON format.
        res.write(JSON.stringify({ token }) + "\n");
      },
    });

    if (signal?.aborted) {
      return fullResponse;
    }

    if (typeof response === "string") {
      fullResponse = response;
    }

    // Persist the completed message before sending done.
    if (typeof onDone === "function") {
      await onDone(fullResponse);
    }

    if (
      !signal?.aborted &&
      !res.destroyed &&
      !res.writableEnded
    ) {
      res.write(
        JSON.stringify({
          done: true,
          response: fullResponse,
        }) + "\n"
      );
    }

    return fullResponse;

  } catch (error) {
    if (
      signal?.aborted ||
      error.message === "Generation cancelled."
    ) {
      return fullResponse;
    }

    throw error;
  }
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  generateResponse,
  generateStream,
};
