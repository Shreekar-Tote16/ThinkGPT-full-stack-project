//C:\Users\user\ThinkGPT\backend\services\router.service.js
const SUPPORTED_MODELS = new Set([
  "groq-fast",
  "groq-large",
  "cloudflare-gemma",
  "cloudflare-glm",
]);

function decideModel({
  message,
  userModel = "auto",
}) {
  // Manual model selection always takes priority.
  if (userModel && userModel !== "auto") {
    if (!SUPPORTED_MODELS.has(userModel)) {
      throw new Error(
        `Unsupported model selected: ${userModel}`
      );
    }

    return userModel;
  }

  const text = String(message || "").toLowerCase();

  // Programming and debugging requests.
  const codingIntent =
    /\b(code|coding|programming|debug|bug|algorithm|python|react|javascript|typescript|node|sql|function)\b/i;

  if (codingIntent.test(text)) {
    return "groq-large";
  }

  // Complex reasoning, comparison and architecture.
  const reasoningIntent =
    /\b(analyze|analysis|compare|architecture|evaluate|reasoning|optimization|mathematical|proof|technical design)\b/i;

  if (reasoningIntent.test(text)) {
    return "cloudflare-gemma";
  }

  // Writing, explanation and summarization.
  const writingIntent =
    /\b(summarize|summary|translate|rewrite|explain|notes|definition|draft|compose)\b/i;

  if (writingIntent.test(text)) {
    return "cloudflare-glm";
  }

  // Default for everyday conversations.
  return "groq-fast";
}

module.exports = {
  decideModel,
};
