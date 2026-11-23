
require("dotenv").config();

const {
  runCloudflare,
} = require("./services/providers/cloudflare");

const MODELS = [
  "cloudflare-gemma",
  "cloudflare-glm",
];

async function testNormal(model) {
  console.log("\n================================");
  console.log(`Testing normal response: ${model}`);
  console.log("================================\n");

  const response = await runCloudflare({
    model,
    stream: false,
    messages: [
      {
        role: "user",
        content:
          "Explain what an API is in two simple sentences.",
      },
    ],
  });

  if (!response || !response.trim()) {
    throw new Error(`${model} returned an empty response.`);
  }

  console.log(response);
  console.log(`\n✅ ${model} normal generation passed.`);
}

async function testStreaming(model) {
  console.log("\n================================");
  console.log(`Testing streaming: ${model}`);
  console.log("================================\n");

  let receivedTokens = 0;

  const response = await runCloudflare({
    model,
    stream: true,

    messages: [
      {
        role: "user",
        content:
          "Explain the MERN stack and list its four technologies.",
      },
    ],

    onToken: (token) => {
      receivedTokens++;
      process.stdout.write(token);
    },
  });

  if (!response || !response.trim()) {
    throw new Error(`${model} produced no streamed response.`);
  }

  if (receivedTokens === 0) {
    throw new Error(`${model} did not deliver streaming tokens.`);
  }

  console.log("\n");
  console.log(`Tokens received: ${receivedTokens}`);
  console.log(`✅ ${model} streaming passed.`);
}

async function main() {
  const results = [];

  for (const model of MODELS) {
    try {
      await testNormal(model);
      results.push({ model, type: "normal", passed: true });
    } catch (error) {
      console.error(`❌ ${model} normal failed:`, error.message);
      results.push({ model, type: "normal", passed: false });
    }

    try {
      await testStreaming(model);
      results.push({ model, type: "stream", passed: true });
    } catch (error) {
      console.error(`❌ ${model} streaming failed:`, error.message);
      results.push({ model, type: "stream", passed: false });
    }
  }

  console.log("\n================================");
  console.log("CLOUDFLARE TEST SUMMARY");
  console.log("================================");

  for (const result of results) {
    console.log(
      `${result.model} (${result.type}): ${
        result.passed ? "PASSED" : "FAILED"
      }`
    );
  }

  const passed = results.filter((result) => result.passed).length;

  console.log(`\nPassed: ${passed}/${results.length}`);

  if (passed !== results.length) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Test runner failed:", error);
  process.exitCode = 1;
});
