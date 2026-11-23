
// require("dotenv").config();

// const {
//   generateResponse,
//   generateStream,
// } = require("./services/modelRouter");

// const MODELS = [
//   "groq-fast",
//   "groq-large",
//   "cloudflare-gemma",
//   "cloudflare-glm",
// ];

// async function testNormalResponse(model) {
//   console.log("\n================================");
//   console.log(`Testing model: ${model}`);
//   console.log("================================\n");

//   try {
//     const response = await generateResponse({
//       model,
//       prompt:
//         "Explain the difference between an API and a database in two sentences.",
//     });

//     if (!response) {
//       throw new Error("Empty response received.");
//     }

//     console.log(response);
//     console.log(`\n✅ ${model} passed.`);
//   } catch (error) {
//     console.error(`❌ ${model} failed:`, error.message);
//   }
// }

// async function testStreaming(model) {
//   console.log("\n================================");
//   console.log(`Testing streaming: ${model}`);
//   console.log("================================\n");

//   try {
//     const mockResponse = {
//       destroyed: false,
//       writableEnded: false,

//       write(line) {
//         const event = JSON.parse(line);

//         if (event.token) {
//           process.stdout.write(event.token);
//         }
//       },
//     };

//     await generateStream({
//       model,
//       prompt: "Explain what a MERN stack is briefly.",
//       res: mockResponse,

//       onDone: async (text) => {
//         if (!text) {
//           throw new Error("No streamed response received.");
//         }
//       },
//     });

//     console.log(`\n✅ ${model} streaming passed.`);
//   } catch (error) {
//     console.error(`\n❌ ${model} streaming failed:`, error.message);
//   }
// }

// async function main() {
//   // Test all four providers/models.
//   for (const model of MODELS) {
//     await testNormalResponse(model);
//   }

//   // Test the unified streaming abstraction.
//   await testStreaming("groq-fast");
//   await testStreaming("gemini-flash");

//   console.log("\n================================");
//   console.log("Provider integration tests completed.");
//   console.log("================================");
// }

// main();


require("dotenv").config();

const {
  generateResponse,
  generateStream,
} = require("./services/modelRouter");

const MODELS = [
  "groq-fast",
  "groq-large",
  "cloudflare-gemma",
  "cloudflare-glm",
];

const RESULTS = [];

function record(model, type, passed, error = null) {
  RESULTS.push({ model, type, passed, error });
}

// ================= NORMAL GENERATION =================

async function testNormal(model) {
  console.log("\n================================");
  console.log(`Testing normal response: ${model}`);
  console.log("================================\n");

  try {
    const response = await generateResponse({
      model,
      prompt: "Explain what a REST API is in two sentences.",
    });

    if (!response || !response.trim()) {
      throw new Error("Empty response received.");
    }

    console.log(response);
    console.log(`\n✅ ${model} normal generation passed.`);

    record(model, "normal", true);
  } catch (error) {
    console.error(`❌ ${model} failed:`, error.message);
    record(model, "normal", false, error.message);
  }
}

// ================= STREAMING GENERATION =================

async function testStreaming(model) {
  console.log("\n================================");
  console.log(`Testing streaming: ${model}`);
  console.log("================================\n");

  try {
    let receivedTokens = 0;
    let receivedDone = false;

    const mockResponse = {
      destroyed: false,
      writableEnded: false,

      write(line) {
        const event = JSON.parse(line);

        if (event.token) {
          receivedTokens++;
          process.stdout.write(event.token);
        }

        if (event.done) {
          receivedDone = true;
        }
      },
    };

    const response = await generateStream({
      model,
      prompt: "Explain the MERN stack briefly.",
      res: mockResponse,

      onDone: async (text) => {
        if (!text || !text.trim()) {
          throw new Error("Completed response is empty.");
        }
      },
    });

    if (!response || !response.trim()) {
      throw new Error("No streaming response received.");
    }

    if (receivedTokens === 0) {
      throw new Error("No tokens were received.");
    }

    if (!receivedDone) {
      throw new Error("Completion event was not received.");
    }

    console.log(`\nTokens received: ${receivedTokens}`);
    console.log(`✅ ${model} streaming passed.`);

    record(model, "streaming", true);
  } catch (error) {
    console.error(`\n❌ ${model} streaming failed:`, error.message);

    record(model, "streaming", false, error.message);
  }
}

// ================= TEST RUNNER =================

async function main() {
  console.log("THINKGPT MULTI-PROVIDER TEST");
  console.log("Testing four active production models.");

  // Test normal responses.
  for (const model of MODELS) {
    await testNormal(model);
  }

  // Test streaming responses.
  for (const model of MODELS) {
    await testStreaming(model);
  }

  // Final report.
  console.log("\n================================");
  console.log("FINAL PROVIDER TEST REPORT");
  console.log("================================");

  for (const result of RESULTS) {
    console.log(
      `${result.model} [${result.type}]: ${
        result.passed ? "PASSED" : "FAILED"
      }`
    );

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  const passed = RESULTS.filter((r) => r.passed).length;
  const failed = RESULTS.length - passed;

  console.log("\n================================");
  console.log(`Passed: ${passed}/${RESULTS.length}`);
  console.log(`Failed: ${failed}/${RESULTS.length}`);
  console.log("================================");

  if (failed > 0) {
    process.exitCode = 1;
    console.log("\n❌ Some provider tests failed.");
  } else {
    console.log("\n🎉 All four models passed normal and streaming tests!");
  }
}

main().catch((error) => {
  console.error("Test runner failed:", error);
  process.exitCode = 1;
});
