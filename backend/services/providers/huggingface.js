// const axios = require("axios");

// /**
//  * Map short names → actual HF model IDs
//  */
// const HF_MODELS = {
//   qwen: "Qwen/Qwen2-1.8B-Chat",
//   gemma: "google/gemma-2b-it",
//   deepseek: "deepseek-ai/deepseek-coder-1.3b-instruct",
//   'qwen2.5:0.5b': 'Qwen/Qwen1.5-0.5B-Chat'
// };

// /**
//  * Run inference using HuggingFace's API
//  * @param {Object} params - Parameters for the request
//  * @param {Array} params.messages - Array of message objects with 'role' and 'content' properties
//  * @param {string} [params.model='qwen2.5:0.5b'] - The model to use for inference
//  * @returns {Promise<string>} The generated text response
//  */
// async function runHuggingFace({ messages, model = 'qwen2.5:0.5b' }) {
//   const hfModel = HF_MODELS[model];

//   if (!hfModel) {
//     throw new Error(`Unknown HuggingFace model: ${model}`);
//   }

//   if (!process.env.HF_API_KEY) {
//     throw new Error('HuggingFace API key is not set. Please set HF_API_KEY in your .env file');
//   }

//   // Format messages into a single prompt
//   const prompt = messages
//     .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
//     .join("\n");

//   try {
//     console.log(`Sending request to HuggingFace model: ${hfModel}`);
    
//     const response = await axios.post(
//       `https://router.huggingface.co/v1/chat/completions${hfModel}`,
//       { inputs: prompt },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.HF_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//         timeout: 120000, // 2 minutes timeout
//       }
//     );
    
//     if (response.status !== 200) {
//       throw new Error(`HuggingFace API error: ${response.status} - ${response.statusText}`);
//     }

//     // Extract the generated text from the response
//     let text = response.data?.[0]?.generated_text || 
//               response.data?.generated_text || 
//               'No response from model';
    
//     // Remove the prompt from the response if it's included
//     if (text.startsWith(prompt)) {
//       text = text.slice(prompt.length).trim();
//     }

//     console.log('Received response from HuggingFace:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
//     return text;
    
//   } catch (error) {
//     console.error('HuggingFace API request failed:', error.message);
    
//     if (error.response) {
//       console.error('Error details:', {
//         status: error.response.status,
//         statusText: error.response.statusText,
//         data: error.response.data
//       });
      
//       if (error.response.status === 401) {
//         throw new Error('Invalid HuggingFace API key. Please check your HF_API_KEY in the .env file');
//       } else if (error.response.status === 404) {
//         throw new Error('Model not found. The specified model may not be available or accessible');
//       } else if (error.response.status === 410) {
//         throw new Error('Model version is no longer available. Please check for updates to the model name.');
//       } else {
//         throw new Error(`HuggingFace API error: ${error.response.status} - ${error.response.statusText}`);
//       }
//     } else if (error.request) {
//       throw new Error('No response received from HuggingFace API. Please check your internet connection.');
//     } else {
//       throw error;
//     }
//   }
// }
// backend/services/providers/huggingface.js
const axios = require("axios");

const HF_MODELS = {
  'qwen': 'Qwen/Qwen1.5-1.8B-Chat',
  'gemma': 'google/gemma-2b-it'
};

async function runHuggingFace({ messages, model = 'qwen' }) {
  const hfModel = HF_MODELS[model];

  if (!hfModel) {
    throw new Error(`Unsupported model: ${model}. Available: ${Object.keys(HF_MODELS).join(', ')}`);
  }

  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY missing in .env");
  }

  try {
    console.log(`HF → ${hfModel}`);
    
    const response = await axios.post(
      "https://router.huggingface.co/models/" + hfModel,
      { 
        inputs: messages.map(m => m.content).join('\n'),
        parameters: {
          return_full_text: false
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    return response.data?.[0]?.generated_text || 'No response from model';
    
  } catch (error) {
    console.error("HF error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error("Invalid HF API key");
    }
    if (error.response?.status === 404) {
      throw new Error(`Model ${hfModel} not found`);
    }
    if (error.response?.status === 503) {
      throw new Error("Model is loading, please try again in a moment");
    }
    
    throw new Error(`HF API error: ${error.message}`);
  }
}

module.exports = { runHuggingFace };