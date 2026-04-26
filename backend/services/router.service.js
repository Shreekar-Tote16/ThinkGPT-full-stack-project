// services/router.service.js

/**
 * Decide which model to use.
 * Priority:
 * 1. User-selected model (frontend override)
 * 2. System auto-routing based on intent
 * 3. Default fallback
 */

function decideModel({ message, userModel }) {
  // 1️⃣ User override always wins
  if (userModel && userModel !== "auto") {
    return userModel;
  }

  const text = message.toLowerCase();

  // 2️⃣ Intent-based routing
  if (
    text.includes("code") ||
    text.includes("react") ||
    text.includes("python") ||
    text.includes("bug") ||
    text.includes("algorithm")
  ) {
    return "deepseek-coder"; // future-ready
  }

  if (
    text.includes("notes") ||
    text.includes("explain") ||
    text.includes("summary") ||
    text.includes("definition")
  ) {
    return "qwen2.5:0.5b";
  }

  // 3️⃣ Default fallback
  return "qwen2.5:0.5b";
}

module.exports = { decideModel };
