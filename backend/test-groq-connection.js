require('dotenv').config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
  console.log("🔍 Testing Groq API connection...");
  console.log("API Key exists:", !!process.env.GROQ_API_KEY);
  console.log("API Key length:", process.env.GROQ_API_KEY?.length);
  
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Say hello" }],
      model: "llama-3.1-8b-instant",
    });
    
    console.log("✅ Groq API working!");
    console.log("Response:", chatCompletion.choices[0]?.message?.content);
  } catch (error) {
    console.error("❌ Groq API Error:", error.message);
    console.error("Status:", error.status);
  }
}

testGroq();
