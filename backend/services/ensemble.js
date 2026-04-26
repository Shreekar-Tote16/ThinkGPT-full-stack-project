// backend/services/ensemble.js
const { runGroq } = require("./providers/groq");

/**
 * Run all 4 Groq models in TRUE parallel
 */
async function runCandidates({ messages }) {
  const tasks = [
    { name: "Llama 3.1 8B",      model: "groq-fast"   },
    { name: "Llama 3.3 70B",     model: "groq-large"  },
    { name: "Qwen 3 32B",        model: "groq-qwen"   },
    { name: "Llama 4 Scout 17B", model: "groq-llama4" },
  ];

  const settled = await Promise.allSettled(
    tasks.map(t =>
      runGroq({ messages, model: t.model }).then(output => ({
        model: t.name,
        output,
      }))
    )
  );

  const results = [];
  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.push(result.value);
    } else {
      console.warn(`⚠️ Ensemble candidate failed:`, result.reason?.message);
    }
  }

  return results;
}

/**
 * Judge model picks/merges the best answer
 */
async function judgeAnswer({ prompt, candidates }) {
  if (candidates.length === 0) {
    throw new Error("No candidates returned from ensemble.");
  }

  const judgePrompt = `
You are an expert AI judge evaluating responses from multiple AI models.

User question:
"${prompt}"

Below are the responses from different AI models:

${candidates
  .map((c, i) => `--- Answer ${i + 1} (${c.model}) ---\n${c.output}`)
  .join("\n\n")}

---
Your task:
- Identify the most accurate, complete, and well-reasoned answer.
- If multiple answers are strong, synthesize them into one definitive response.
- Do NOT mention the models by name or reference this judging process.
- Return ONLY the final synthesized answer, ready to show the user.
`;

  return runGroq({
    model: "groq-large",
    messages: [
      {
        role: "system",
        content:
          "You are an expert judge. You synthesize the best answer from multiple AI responses without revealing the process.",
      },
      { role: "user", content: judgePrompt },
    ],
  });
}

module.exports = { runCandidates, judgeAnswer };