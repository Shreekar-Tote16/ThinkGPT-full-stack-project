//C:\Users\user\ThinkGPT\backend\services\providers\groq.provider.js
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function runGroq({ messages, model, stream, onToken }) {
  if (!stream) {
    const res = await groq.chat.completions.create({ model, messages });
    return res.choices[0].message.content;
  }

  const streamRes = await groq.chat.completions.create({
    model,
    messages,
    stream: true,
  });

  for await (const chunk of streamRes) {
    const token = chunk.choices[0]?.delta?.content;
    if (token) onToken(token);
  }
}

module.exports = { runGroq };
