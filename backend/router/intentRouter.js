// router/intentRouter.js

/**
 * Decide intent from user input
 * Returns: { intent, model, reason }
 */
function detectIntent(prompt = "") {
  const text = prompt.toLowerCase();

  // ===== CODING =====
  if (
    text.includes("code") ||
    text.includes("function") ||
    text.includes("error") ||
    text.includes("bug") ||
    text.includes("javascript") ||
    text.includes("python") ||
    text.includes("java")
  ) {
    return {
      intent: "coding",
      model: "deepseek-coder",
      reason: "Detected programming-related keywords",
    };
  }

  // ===== NOTES / SUMMARY =====
  if (
    text.includes("summarize") ||
    text.includes("notes") ||
    text.includes("points") ||
    text.includes("short notes") ||
    text.includes("explain briefly")
  ) {
    return {
      intent: "notes",
      model: "gemma-2b",
      reason: "Detected summarization / notes intent",
    };
  }

  // ===== EXPLANATION =====
  if (
    text.startsWith("what is") ||
    text.startsWith("explain") ||
    text.includes("how does") ||
    text.includes("why does")
  ) {
    return {
      intent: "explanation",
      model: "phi-2",
      reason: "Detected explanation-style query",
    };
  }

  // ===== DEFAULT CHAT =====
  return {
    intent: "chat",
    model: "qwen2.5",
    reason: "Default conversational intent",
  };
}

module.exports = { detectIntent };
