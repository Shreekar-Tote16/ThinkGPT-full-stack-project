// services/modelRouter.js
const { runGroq } = require("./providers/groq");

/**
 * Legacy function for backward compatibility
 * Converts single prompt to messages format
 */
async function generateResponse({ prompt, model = "groq-fast" }) {
  const messages = [{ role: "user", content: prompt }];
  
  const response = await runGroq({
    messages,
    model: model,  // Use the model key directly
    stream: false
  });

  return response;
}

/**
 * Legacy function for backward compatibility
 * Handles streaming responses
 */
async function generateStream({ prompt, model = "groq-fast", res, onDone }) {
  const messages = [{ role: "user", content: prompt }];
  let fullResponse = "";

  try {
    await runGroq({
      messages,
      model: model,  // Use the model key directly
      stream: true,
      onToken: (token) => {
        fullResponse += token;
        // Send token as raw JSON line (not SSE format)
        res.write(`${JSON.stringify({ token })}\n`);
      }
    });

    // Send final message with complete response
    res.write(`${JSON.stringify({ 
      done: true, 
      response: fullResponse 
    })}\n`);
    
    if (onDone && typeof onDone === "function") {
      onDone(fullResponse);
    }

  } catch (error) {
    console.error("Streaming error:", error.message);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(`${JSON.stringify({ error: error.message })}\n`);
    }
  }
}

module.exports = {
  generateResponse,  // Legacy compatibility
  generateStream    // Legacy compatibility
};
