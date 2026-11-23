
// backend/services/providers/cloudflare.js

// ==========================================
// CLOUDFLARE WORKERS AI MODEL REGISTRY
// ==========================================

const CLOUDFLARE_MODELS = {
  "cloudflare-gemma": "@cf/google/gemma-4-26b-a4b-it",
  "cloudflare-glm": "@cf/zai-org/glm-4.7-flash",
};

// ==========================================
// CONFIGURATION
// ==========================================

function getCloudflareConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID is missing.");
  }

  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is missing.");
  }

  return {
    accountId,
    apiToken,
    endpoint:
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/chat/completions`,
  };
}

// ==========================================
// MESSAGE VALIDATION
// ==========================================

function prepareMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required.");
  }

  const validRoles = new Set([
    "system",
    "user",
    "assistant",
  ]);

  const normalized = messages.map((message) => {
    let role = message.role;

    if (role === "model") {
      role = "assistant";
    }

    if (!validRoles.has(role)) {
      throw new Error(`Unsupported message role: ${role}`);
    }

    if (typeof message.content !== "string") {
      throw new Error("Message content must be a string.");
    }

    return {
      role,
      content: message.content,
    };
  });

  if (!normalized.some((message) => message.role === "user")) {
    throw new Error("At least one user message is required.");
  }

  return normalized;
}

// ==========================================
// API ERROR HANDLING
// ==========================================

async function readCloudflareError(response) {
  const raw = await response.text();

  try {
    const data = JSON.parse(raw);

    const messages = Array.isArray(data.errors)
      ? data.errors.map((item) => item.message).filter(Boolean)
      : [];

    return (
      messages.join("; ") ||
      data.error?.message ||
      data.message ||
      raw ||
      `HTTP ${response.status}`
    );
  } catch {
    return raw || `HTTP ${response.status}`;
  }
}

function formatCloudflareError(status, message) {
  if (status === 401 || status === 403) {
    return new Error(
      "Cloudflare authentication failed. Check CLOUDFLARE_API_TOKEN and its permissions."
    );
  }

  if (status === 404) {
    return new Error(
      `Cloudflare model or endpoint not found: ${message}`
    );
  }

  if (status === 429) {
    return new Error(
      "Cloudflare Workers AI rate limit or daily Neuron allocation exceeded."
    );
  }

  if (status === 400) {
    return new Error(
      `Cloudflare rejected the request: ${message}`
    );
  }

  if (status >= 500) {
    return new Error(
      `Cloudflare Workers AI is temporarily unavailable: ${message}`
    );
  }

  return new Error(
    `Cloudflare API error (${status}): ${message}`
  );
}

// ==========================================
// CLOUDFLARE AI GENERATION
// ==========================================

async function runCloudflare({
  messages,
  model = "cloudflare-gemma",
  stream = false,
  onToken,
  signal,
}) {
  const selectedModel = CLOUDFLARE_MODELS[model];

  if (!selectedModel) {
    throw new Error(
      `Unsupported Cloudflare model: "${model}". Available: ${Object.keys(
        CLOUDFLARE_MODELS
      ).join(", ")}`
    );
  }

  if (signal?.aborted) {
    throw new Error("Generation cancelled.");
  }

  const normalizedMessages = prepareMessages(messages);
  const { apiToken, endpoint } = getCloudflareConfig();

  try {
    const response = await fetch(endpoint, {
      method: "POST",

      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: selectedModel,
        messages: normalizedMessages,
        stream,
        max_completion_tokens: 2048,
      }),

      signal: signal || AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      const errorMessage = await readCloudflareError(response);

      throw formatCloudflareError(
        response.status,
        errorMessage
      );
    }

    // ======================================
    // STREAMING
    // ======================================

    if (stream) {
      if (typeof onToken !== "function") {
        throw new Error(
          "onToken callback is required for streaming."
        );
      }

      if (!response.body) {
        throw new Error("Cloudflare returned an empty stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let fullResponse = "";
      let streamFinished = false;

      function processEvent(eventText) {
        const lines = eventText.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const data = line.slice(5).trim();

          if (!data || data === "[DONE]") {
            if (data === "[DONE]") {
              streamFinished = true;
            }

            continue;
          }

          const chunk = JSON.parse(data);

          if (chunk.error) {
            throw new Error(
              typeof chunk.error === "string"
                ? chunk.error
                : chunk.error.message || "Cloudflare stream failed."
            );
          }

          const token =
            chunk.choices?.[0]?.delta?.content || "";

          if (token) {
            fullResponse += token;
            onToken(token);
          }
        }
      }

      while (true) {
        if (signal?.aborted) {
          await reader.cancel();
          throw new Error("Generation cancelled.");
        }

        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, {
          stream: true,
        });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const event of events) {
          processEvent(event);
        }
      }

      // Flush any remaining decoder bytes and event data.
      buffer += decoder.decode();

      if (buffer.trim() && !streamFinished) {
        processEvent(buffer);
      }

      if (signal?.aborted) {
        throw new Error("Generation cancelled.");
      }

      return fullResponse;
    }

    // ======================================
    // NON-STREAMING
    // ======================================

    const data = await response.json();

    const content =
      data.choices?.[0]?.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      throw new Error(
        "Cloudflare returned an empty or invalid response."
      );
    }

    return content;

  } catch (error) {
    if (
      signal?.aborted ||
      error.name === "AbortError" ||
      error.message === "Generation cancelled."
    ) {
      throw new Error("Generation cancelled.");
    }

    console.error(
      `Cloudflare AI Error [${selectedModel}]:`,
      error.message
    );

    throw error;
  }
}

// ==========================================
// GENERIC WORKERS AI TASK EXECUTION
// Used by image, audio, speech and vision services.
// ==========================================

async function runCloudflareTask({
  modelId,
  input,
  signal,
}) {
  if (
    typeof modelId !== "string" ||
    !modelId.startsWith("@cf/")
  ) {
    throw new Error("Invalid Cloudflare-hosted model ID.");
  }

  if (!input || typeof input !== "object") {
    throw new Error("A valid model input object is required.");
  }

  const { accountId, apiToken } = getCloudflareConfig();

  const encodedModelPath = modelId
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  const url =
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${encodedModelPath}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    signal: signal || AbortSignal.timeout(120000),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    const message =
      data.errors?.map((error) => error.message).join("; ") ||
      `HTTP ${response.status}`;

    throw formatCloudflareError(response.status, message);
  }

  return data.result;
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  runCloudflare,
  runCloudflareTask,
  CLOUDFLARE_MODELS,
};