
// const Groq = require("groq-sdk");

// // Initialize Groq
// if (!process.env.GROQ_API_KEY) {
//   throw new Error("GROQ_API_KEY is missing from backend environment variables");
// }

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// // Current Groq model registry
// const GROQ_MODELS = {
//   // Automatic selection defaults to the fast model
//   auto: "openai/gpt-oss-20b",

//   // Production models
//   "groq-fast": "openai/gpt-oss-20b",
//   "groq-large": "openai/gpt-oss-120b",

//   // Preview model
//   "groq-qwen": "qwen/qwen3.8-27b",
// };

// async function runGroq({
//   messages,
//   model = "groq-fast",
//   stream = false,
//   onToken,
//   signal,
// }) {
//   const selectedModel = GROQ_MODELS[model];

//   if (!selectedModel) {
//     throw new Error(
//       `Unsupported model key: "${model}". Available models: ${Object.keys(
//         GROQ_MODELS
//       ).join(", ")}`
//     );
//   }

//   if (!Array.isArray(messages) || messages.length === 0) {
//     throw new Error("Messages array is required and cannot be empty");
//   }

//   try {
//     // Streaming response
//     if (stream) {
//       if (typeof onToken !== "function") {
//         throw new Error("onToken callback is required for streaming");
//       }

//       const streamResponse = await groq.chat.completions.create({
//         messages,
//         model: selectedModel,
//         stream: true,
//       });

//       let fullResponse = "";

//       for await (const chunk of streamResponse) {
//         const token = chunk.choices?.[0]?.delta?.content || "";

//         if (token) {
//           fullResponse += token;
//           onToken(token);
//         }
//       }

//       return fullResponse;
//     }

//     // Normal non-streaming response
//     const response = await groq.chat.completions.create({
//       messages,
//       model: selectedModel,
//       stream: false,
//     });

//     return response.choices?.[0]?.message?.content || "";

//   } catch (error) {
//     console.error("Groq API Error:", error.message);

//     const status = error.status || error.statusCode;

//     if (status === 401) {
//       throw new Error("Invalid Groq API key. Check GROQ_API_KEY.");
//     }

//     if (status === 403) {
//       throw new Error("Your Groq account does not have access to this model.");
//     }

//     if (status === 404) {
//       throw new Error(
//         `Groq model "${selectedModel}" is unavailable. Check its model ID and account access.`
//       );
//     }

//     if (status === 429) {
//       throw new Error(
//         "Groq rate limit exceeded. Please try again later."
//       );
//     }

//     throw new Error(`Groq API error: ${error.message}`);
//   }
// }

// module.exports = {
//   runGroq,
// };


// // // backend/services/providers/groq.js
// // const Groq = require("groq-sdk");

// // const groq = new Groq({
// //   apiKey: process.env.GROQ_API_KEY,
// // });

// // // ✅ Verified ACTIVE Groq models — cross-checked against official deprecation page Feb 2026
// // const GROQ_MODELS = {
// //   "groq-fast":    "llama-3.1-8b-instant",                     // Meta — fast & lightweight
// //   "groq-large":   "llama-3.3-70b-versatile",                  // Meta — powerful general purpose
// //   "groq-qwen":    "qwen/qwen3-32b",                           // Alibaba Qwen 3 32B
// //   "groq-llama4":  "meta-llama/llama-4-scout-17b-16e-instruct", // Meta Llama 4 Scout — latest
// // };

// // async function runGroq({ messages, model = "groq-fast", stream = false, onToken }) {
// //   const selectedModel = GROQ_MODELS[model];

// //   if (!selectedModel) {
// //     throw new Error(
// //       `Unsupported Groq model key: "${model}". Valid keys: ${Object.keys(GROQ_MODELS).join(", ")}`
// //     );
// //   }

// //   if (!messages || !Array.isArray(messages) || messages.length === 0) {
// //     throw new Error("Messages array is required and cannot be empty");
// //   }

// //   try {
// //     if (stream) {
// //       if (typeof onToken !== "function") {
// //         throw new Error("onToken callback is required for streaming");
// //       }

// //       const streamRes = await groq.chat.completions.create({
// //         messages,
// //         model: selectedModel,
// //         stream: true,
// //       });

// //       let fullResponse = "";
// //       for await (const chunk of streamRes) {
// //         const token = chunk.choices[0]?.delta?.content || "";
// //         if (token) {
// //           fullResponse += token;
// //           onToken(token);
// //         }
// //       }
// //       return fullResponse;
// //     }

// //     // Non-streaming
// //     const res = await groq.chat.completions.create({
// //       messages,
// //       model: selectedModel,
// //     });
// //     return res.choices[0]?.message?.content || "";

// //   } catch (error) {
// //     console.error("Groq API Error:", error.message);

// //     if (error.status === 401) {
// //       throw new Error("Invalid Groq API key. Check your GROQ_API_KEY in .env");
// //     }
// //     if (error.status === 429) {
// //       throw new Error("Groq rate limit exceeded. Please try again later.");
// //     }
// //     if (error.status === 400 && error.message.includes("decommissioned")) {
// //       throw new Error(`Model decommissioned. Update GROQ_MODELS in groq.js`);
// //     }

// //     throw new Error(`Groq API error: ${error.message}`);
// //   }
// // }

// // module.exports = { runGroq };


const Groq = require("groq-sdk");

// Validate API key before initializing the provider.
if (!process.env.GROQ_API_KEY) {
  throw new Error(
    "GROQ_API_KEY is missing from backend environment variables"
  );
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Current Groq model registry
const GROQ_MODELS = {
  auto: "openai/gpt-oss-20b",

  // Production models
  "groq-fast": "openai/gpt-oss-20b",
  "groq-large": "openai/gpt-oss-120b",

  // Preview model
  "groq-qwen": "qwen/qwen3.8-27b",
};

async function runGroq({
  messages,
  model = "groq-fast",
  stream = false,
  onToken,
  signal,
}) {
  const selectedModel = GROQ_MODELS[model];

  if (!selectedModel) {
    throw new Error(
      `Unsupported model key: "${model}". Available models: ${Object.keys(
        GROQ_MODELS
      ).join(", ")}`
    );
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error(
      "Messages array is required and cannot be empty"
    );
  }

  // Do not start a request that has already been cancelled.
  if (signal?.aborted) {
    throw new Error("Generation cancelled.");
  }

  try {
    // ================= STREAMING RESPONSE =================

    if (stream) {
      if (typeof onToken !== "function") {
        throw new Error(
          "onToken callback is required for streaming"
        );
      }

      // Pass AbortSignal through SDK request options.
      const streamResponse = await groq.chat.completions.create(
        {
          messages,
          model: selectedModel,
          stream: true,
        },
        signal ? { signal } : undefined
      );

      let fullResponse = "";

      for await (const chunk of streamResponse) {
        // Stop processing immediately if the user cancels.
        if (signal?.aborted) {
          break;
        }

        const token =
          chunk.choices?.[0]?.delta?.content || "";

        if (token) {
          fullResponse += token;
          onToken(token);
        }
      }

      if (signal?.aborted) {
        throw new Error("Generation cancelled.");
      }

      return fullResponse;
    }

    // ================= NON-STREAMING RESPONSE =================

    const response = await groq.chat.completions.create(
      {
        messages,
        model: selectedModel,
        stream: false,
      },
      signal ? { signal } : undefined
    );

    return response.choices?.[0]?.message?.content || "";

  } catch (error) {
    // Do not report intentional cancellation as an API failure.
    if (
      error.name === "AbortError" ||
      signal?.aborted
    ) {
      throw new Error("Generation cancelled.");
    }

    console.error("Groq API Error:", error.message);

    const status = error.status || error.statusCode;

    if (status === 401) {
      throw new Error(
        "Invalid Groq API key. Check GROQ_API_KEY."
      );
    }

    if (status === 403) {
      throw new Error(
        "Your Groq account does not have access to this model."
      );
    }

    if (status === 404) {
      throw new Error(
        `Groq model "${selectedModel}" is unavailable. Check its model ID and account access.`
      );
    }

    if (status === 429) {
      throw new Error(
        "Groq rate limit exceeded. Please try again later."
      );
    }

    throw new Error(`Groq API error: ${error.message}`);
  }
}

module.exports = {
  runGroq,
};
