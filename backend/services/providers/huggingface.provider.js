const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_API_KEY);

async function runHuggingFace({ messages, model }) {
  const res = await client.chatCompletion({
    model,
    messages,
    max_tokens: 512,
    temperature: 0.7,
  });

  return res.choices[0].message.content;
}

module.exports = { runHuggingFace };
