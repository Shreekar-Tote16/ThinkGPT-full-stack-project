
const registry = require("../registry/modelRegistry");
const { runOllama } = require("./providers/ollama.provider");
const { runGroq } = require("./providers/groq.provider");
const { runHuggingFace } = require("./providers/huggingface.provider");
const { streamText } = require("../utils/streamer");

function buildMessages(messages = [], prompt) {
  return [
    { role: "system", content: "You are a helpful AI assistant." },
    ...messages,
    { role: "user", content: prompt },
  ];
}

// ---------- NON STREAM ----------
async function generateResponse({ prompt, model = "auto", messages = [] }) {
  const entry = registry[model];
  if (!entry) throw new Error("Unknown model");

  const chatMessages = buildMessages(messages, prompt);

  if (entry.provider === "ollama")
    return runOllama({ messages: chatMessages, model: entry.model });

  if (entry.provider === "groq")
    return runGroq({ messages: chatMessages, model: entry.model });

  return runHuggingFace({ messages: chatMessages, model: entry.model });
}

// ---------- STREAM ----------
async function generateStream({ prompt, model = "auto", messages = [], res, onDone }) {
  const entry = registry[model];
  if (!entry) throw new Error("Unknown model");

  const chatMessages = buildMessages(messages, prompt);
  let finalText = "";

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  const onToken = (t) => {
    finalText += t;
    res.write(JSON.stringify({ response: t }) + "\n");
  };

  if (!entry.streaming) {
    const text = await generateResponse({ prompt, model, messages });
    await streamText(res, text);
    finalText = text;
  } else if (entry.provider === "ollama") {
    await runOllama({ messages: chatMessages, model: entry.model, stream: true, onToken });
  } else {
    await runGroq({ messages: chatMessages, model: entry.model, stream: true, onToken });
  }

  res.write(JSON.stringify({ done: true }) + "\n");
  res.end();
  onDone?.(finalText);
}

module.exports = { generateResponse, generateStream };
