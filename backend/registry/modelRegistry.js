
// // backend/registry/modelRegistry.js
// // This registry documents available models.
// // The actual model ID strings are managed in providers/groq.js

// module.exports = {
//   // ---------- GROQ CLOUD (all active as of Feb 2026) ----------
//   "groq-fast": {
//     provider: "groq",
//     label: "Groq Fast (Llama 3.1 8B)",
//     streaming: true,
//   },
//   "groq-large": {
//     provider: "groq",
//     label: "Groq Large (Llama 3.3 70B)",
//     streaming: true,
//   },
//   "groq-mixtral": {
//     provider: "groq",
//     label: "Groq Mistral Saba 24B",
//     streaming: true,
//   },

//   // ---------- AUTO (resolves to groq-fast) ----------
//   auto: {
//     provider: "groq",
//     label: "Auto (defaults to Groq Fast)",
//     streaming: true,
//   },
// };
// backend/registry/modelRegistry.js
// Reference registry — actual model ID strings live in providers/groq.js

module.exports = {
  auto: {
    provider: "groq",
    label: "Auto (defaults to Groq Fast)",
    streaming: true,
  },
  "groq-fast": {
    provider: "groq",
    label: "Llama 3.1 8B — Fast",
    streaming: true,
  },
  "groq-large": {
    provider: "groq",
    label: "Llama 3.3 70B — Powerful",
    streaming: true,
  },
  "groq-qwen": {
    provider: "groq",
    label: "Qwen 3 32B — Alibaba",
    streaming: true,
  },
  "groq-llama4": {
    provider: "groq",
    label: "Llama 4 Scout 17B — Latest Meta",
    streaming: true,
  },
};