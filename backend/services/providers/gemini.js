
// // const { GoogleGenAI } = require("@google/genai");

// // // Separate Gemini registry
// // const GEMINI_MODELS = {
// //   "gemini-hydrogen": "gemini-4-hydrogen",
// //   "gemini-flash": "gemini-3.8-flash",
// // };

// // function getGeminiClient() {
// //   const apiKey = process.env.GEMINI_API_KEY;

// //   if (!apiKey) {
// //     throw new Error("GEMINI_API_KEY is missing.");
// //   }

// //   return new GoogleGenAI({ apiKey });
// // }

// // function prepareMessages(messages) {
// //   const systemMessages = messages
// //     .filter((message) => message.role === "system")
// //     .map((message) => message.content)
// //     .join("\n\n");

// //   const contents = messages
// //     .filter((message) => message.role !== "system")
// //     .map((message) => ({
// //       role: message.role === "assistant" ? "model" : "user",
// //       parts: [{ text: String(message.content || "") }],
// //     }));

// //   if (!contents.length) {
// //     throw new Error("Gemini requires at least one user message.");
// //   }

// //   return {
// //     contents,
// //     systemInstruction: systemMessages || undefined,
// //   };
// // }

// // async function runGemini({
// //   messages,
// //   model = "gemini-flash",
// //   stream = false,
// //   onToken,
// //   signal,
// // }) {
// //   const selectedModel = GEMINI_MODELS[model];

// //   if (!selectedModel) {
// //     throw new Error(`Unsupported Gemini model: ${model}`);
// //   }

// //   if (!Array.isArray(messages) || !messages.length) {
// //     throw new Error("Messages array is required.");
// //   }

// //   if (signal?.aborted) {
// //     throw new Error("Generation cancelled.");
// //   }

// //   try {
// //     const ai = getGeminiClient();

// //     const {
// //       contents,
// //       systemInstruction,
// //     } = prepareMessages(messages);

// //     const config = {
// //       maxOutputTokens: 4096,
// //       ...(systemInstruction ? { systemInstruction } : {}),
// //       ...(signal ? { abortSignal: signal } : {}),
// //     };

// //     // ================= STREAMING =================

// //     if (stream) {
// //       if (typeof onToken !== "function") {
// //         throw new Error("onToken callback is required.");
// //       }

// //       const responseStream =
// //         await ai.models.generateContentStream({
// //           model: selectedModel,
// //           contents,
// //           config: generationConfig,
// //         });

// //       let fullResponse = "";

// //       for await (const chunk of responseStream) {
// //         if (signal?.aborted) {
// //           break;
// //         }

// //         const token = chunk.text || "";

// //         if (token) {
// //           fullResponse += token;
// //           onToken(token);
// //         }
// //       }

// //       if (signal?.aborted) {
// //         throw new Error("Generation cancelled.");
// //       }

// //       return fullResponse;
// //     }

// //     // ================= NON-STREAMING =================

// //     const response = await ai.models.generateContent({
// //       model: selectedModel,
// //       contents,
// //       config: generationConfig,
// //     });

// //     return response.text || "";

// //   } catch (error) {
// //     if (
// //       signal?.aborted ||
// //       error.name === "AbortError"
// //     ) {
// //       throw new Error("Generation cancelled.");
// //     }

// //     console.error("Gemini API Error:", error.message);

// //     const status = error.status || error.statusCode;

// //     if (status === 401 || status === 403) {
// //       throw new Error("Gemini API authentication or access failed.");
// //     }

// //     if (status === 404) {
// //       throw new Error(
// //         `Gemini model ${selectedModel} is unavailable.`
// //       );
// //     }

// //     if (status === 429) {
// //       throw new Error(
// //         "Gemini API quota or rate limit exceeded."
// //       );
// //     }

// //     throw new Error(`Gemini API error: ${error.message}`);
// //   }
// // }

// // module.exports = {
// //   runGemini,
// //   GEMINI_MODELS,
// // };


// const { GoogleGenAI } = require("@google/genai");

// const GEMINI_MODELS = {
//   "gemini-hydrogen": "gemini-4-hydrogen",
//   "gemini-flash": "gemini-3.8-flash",
// };

// // Initialize Gemini client only when needed.
// let geminiClient = null;

// function getGeminiClient() {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error("GEMINI_API_KEY is missing.");
//   }

//   if (!geminiClient) {
//     geminiClient = new GoogleGenAI({
//       apiKey: process.env.GEMINI_API_KEY,
//     });
//   }

//   return geminiClient;
// }

// // Convert ThinkGPT messages into Gemini format.
// function prepareMessages(messages) {
//   if (!Array.isArray(messages) || messages.length === 0) {
//     throw new Error("Messages array is required.");
//   }

//   const systemInstruction = messages
//     .filter((m) => m.role === "system")
//     .map((m) => String(m.content || ""))
//     .filter(Boolean)
//     .join("\n\n");

//   const contents = messages
//     .filter((m) => m.role !== "system")
//     .map((m) => ({
//       role:
//         m.role === "assistant" || m.role === "model"
//           ? "model"
//           : "user",
//       parts: [
//         {
//           text: String(m.content || ""),
//         },
//       ],
//     }))
//     .filter((m) => m.parts[0].text.trim());

//   if (!contents.length) {
//     throw new Error("No valid messages provided.");
//   }

//   return {
//     contents,
//     systemInstruction,
//   };
// }


// function getHttpStatus(error) {
//   const directStatuses = [
//     error?.status,
//     error?.statusCode,
//     error?.code,
//   ];

//   for (const value of directStatuses) {
//     const status = Number(value);

//     if ([429, 500, 502, 503, 504].includes(status)) {
//       return status;
//     }
//   }

//   // Some SDK errors contain the HTTP status inside JSON text.
//   try {
//     const parsed = JSON.parse(error?.message || "{}");

//     const status =
//       parsed?.error?.code ??
//       parsed?.code;

//     return Number(status) || null;
//   } catch {
//     return null;
//   }
// }

// async function withTransientRetries(
//   operation,
//   signal,
//   maxRetries = 2
// ) {
//   for (let attempt = 0; ; attempt++) {
//     if (signal?.aborted) {
//       throw new Error("Generation cancelled.");
//     }

//     try {
//       return await operation();
//     } catch (error) {
//       if (signal?.aborted) {
//         throw new Error("Generation cancelled.");
//       }

//       const status = getHttpStatus(error);

//       // Do not retry after partial streaming output.
//       const retryable =
//         [500, 502, 503, 504].includes(status) &&
//         !error.partialResponse;

//       if (!retryable || attempt >= maxRetries) {
//         throw error;
//       }

//       const delay =
//         [1000, 2500][attempt] +
//         Math.floor(Math.random() * 300);

//       console.warn(
//         `Gemini temporarily unavailable (${status}). ` +
//         `Retry ${attempt + 1}/${maxRetries} in ${delay}ms.`
//       );

//       await new Promise((resolve) =>
//         setTimeout(resolve, delay)
//       );
//     }
//   }
// }

// // ================= GEMINI GENERATION =================

// async function runGemini({
//   messages,
//   model = "gemini-flash",
//   stream = false,
//   onToken,
//   signal,
// }) {
//   const selectedModel = GEMINI_MODELS[model];

//   if (!selectedModel) {
//     throw new Error(`Unsupported Gemini model: ${model}`);
//   }

//   if (signal?.aborted) {
//     throw new Error("Generation cancelled.");
//   }

//   const ai = getGeminiClient();

//   const {
//     contents,
//     systemInstruction,
//   } = prepareMessages(messages);

//   // IMPORTANT:
//   // This variable must be declared before either API call.
//   const generationConfig = {
//     maxOutputTokens: 4096,

//     ...(systemInstruction
//       ? { systemInstruction }
//       : {}),

//     ...(signal
//       ? { abortSignal: signal }
//       : {}),
//   };

//   try {
//     // ================= STREAMING =================

//     if (stream) {
//       if (typeof onToken !== "function") {
//         throw new Error("onToken callback is required.");
//       }

//       const responseStream =
//         await ai.models.generateContentStream({
//           model: selectedModel,
//           contents,
//           config: generationConfig,
//         });

//       let fullResponse = "";

//       for await (const chunk of responseStream) {
//         if (signal?.aborted) {
//           break;
//         }

//         const token = chunk.text || "";

//         if (token) {
//           fullResponse += token;
//           onToken(token);
//         }
//       }

//       if (signal?.aborted) {
//         throw new Error("Generation cancelled.");
//       }

//       return fullResponse;
//     }

//     // ================= NON-STREAMING =================

//     const response = await ai.models.generateContent({
//       model: selectedModel,
//       contents,
//       config: generationConfig,
//     });

//     return response.text || "";

//   } catch (error) {
//     if (
//       signal?.aborted ||
//       error.name === "AbortError"
//     ) {
//       throw new Error("Generation cancelled.");
//     }

//     console.error(
//       `Gemini API Error [${selectedModel}]:`,
//       error.message
//     );

//     const status = error.status || error.statusCode;

//     if (status === 401 || status === 403) {
//       throw new Error("Gemini API authentication failed.");
//     }

//     if (status === 404) {
//       throw new Error(`Gemini model unavailable: ${selectedModel}`);
//     }

//     if (status === 429) {
//       throw new Error("Gemini API quota exceeded.");
//     }

//     throw new Error(`Gemini API error: ${error.message}`);
//   }
// }

// module.exports = {
//   runGemini,
//   GEMINI_MODELS,
// };



const { GoogleGenAI } = require("@google/genai");

// ==========================================
// GEMINI MODEL REGISTRY
// ==========================================

const GEMINI_MODELS = {
  "gemini-hydrogen": "gemini-4-hydrogen",
  "gemini-flash": "gemini-3.5-flash-lite",
};

// ==========================================
// GEMINI CLIENT
// ==========================================

let geminiClient = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing from backend environment variables."
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
    });
  }

  return geminiClient;
}

// ==========================================
// MESSAGE PREPARATION
// ==========================================

function prepareMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required.");
  }

  // Extract system instructions separately.
  const systemInstruction = messages
    .filter((message) => message.role === "system")
    .map((message) => String(message.content || ""))
    .filter(Boolean)
    .join("\n\n");

  // Convert ThinkGPT message format to Gemini format.
  const contents = messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role:
        message.role === "assistant" || message.role === "model"
          ? "model"
          : "user",

      parts: [
        {
          text: String(message.content || ""),
        },
      ],
    }))
    .filter((message) => message.parts[0].text.trim());

  if (contents.length === 0) {
    throw new Error("No valid user messages provided.");
  }

  return {
    contents,
    systemInstruction,
  };
}

// ==========================================
// ERROR STATUS EXTRACTION
// ==========================================

function getHttpStatus(error) {
  const directStatus = Number(
    error?.status || error?.statusCode
  );

  if (Number.isInteger(directStatus) && directStatus >= 400) {
    return directStatus;
  }

  // Some SDK errors return the HTTP status inside JSON text.
  const errorMessage = String(error?.message || "");

  const match = errorMessage.match(
    /"(?:code|statusCode)"\s*:\s*(\d{3})/
  );

  if (match) {
    return Number(match[1]);
  }

  return null;
}

// ==========================================
// GEMINI GENERATION
// ==========================================

async function runGemini({
  messages,
  model = "gemini-flash",
  stream = false,
  onToken,
  signal,
}) {
  // Resolve provider model.
  const selectedModel = GEMINI_MODELS[model];

  if (!selectedModel) {
    throw new Error(
      `Unsupported Gemini model: "${model}". Available models: ${Object.keys(
        GEMINI_MODELS
      ).join(", ")}`
    );
  }

  // Validate request.
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Messages array is required.");
  }

  if (signal?.aborted) {
    throw new Error("Generation cancelled.");
  }

  try {
    const ai = getGeminiClient();

    const {
      contents,
      systemInstruction,
    } = prepareMessages(messages);

    // ======================================
    // GENERATION CONFIGURATION
    // ======================================

    const generationConfig = {
      maxOutputTokens: 4096,

      ...(systemInstruction
        ? { systemInstruction }
        : {}),

      // Allows request cancellation.
      ...(signal
        ? { abortSignal: signal }
        : {}),

      // Retry temporary API failures.
      httpOptions: {
        timeout: 45000,
        retryOptions: {
          attempts: 2,
          initialDelay: 1,
          maxDelay: 3,
          expBase: 2,
          jitter: 1,

          httpStatusCodes: [
            408,
            500,
            502,
            503,
            504,
          ],
        },
      },
    };

    // ======================================
    // STREAMING GENERATION
    // ======================================

    if (stream) {
      if (typeof onToken !== "function") {
        throw new Error(
          "onToken callback is required for streaming."
        );
      }

      const responseStream =
        await ai.models.generateContentStream({
          model: selectedModel,
          contents,
          config: generationConfig,
        });

      let fullResponse = "";

      for await (const chunk of responseStream) {
        // Stop processing if the request is cancelled.
        if (signal?.aborted) {
          throw new Error("Generation cancelled.");
        }

        const token = chunk.text || "";

        if (token) {
          fullResponse += token;

          // Deliver token to modelRouter.
          onToken(token);
        }
      }

      if (signal?.aborted) {
        throw new Error("Generation cancelled.");
      }

      return fullResponse;
    }

    // ======================================
    // NON-STREAMING GENERATION
    // ======================================

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: generationConfig,
    });

    if (signal?.aborted) {
      throw new Error("Generation cancelled.");
    }

    return response.text || "";

  } catch (error) {
    // Cancellation is not an API failure.
    if (
      signal?.aborted ||
      error.name === "AbortError"
    ) {
      throw new Error("Generation cancelled.");
    }

    const status = getHttpStatus(error);

    console.error(
      `Gemini API Error [${selectedModel}]:`,
      error.message
    );

    // ======================================
    // ERROR HANDLING
    // ======================================

    if (status === 400) {
      throw new Error(
        `Gemini rejected the request: ${error.message}`
      );
    }

    if (status === 401 || status === 403) {
      throw new Error(
        "Gemini API authentication or model access failed. Check GEMINI_API_KEY."
      );
    }

    if (status === 404) {
      throw new Error(
        `Gemini model "${selectedModel}" is unavailable.`
      );
    }

    if (status === 429) {
      throw new Error(
        "Gemini API quota or rate limit exceeded. Please try again later."
      );
    }

    if (status === 503) {
      throw new Error(
        "Gemini is temporarily experiencing high demand. Please try again shortly."
      );
    }

    throw new Error(
      `Gemini API error: ${error.message}`
    );
  }
}

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  runGemini,
  GEMINI_MODELS,
};
