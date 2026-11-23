
require("dotenv").config();

const { runGemini } = require("./services/providers/gemini");

const testMessage = [
  {
    role: "user",
    content:
      "Explain what a REST API is in three simple sentences.",
  },
];

async function testModel(modelKey) {
  console.log("\n================================");
  console.log(`Testing: ${modelKey}`);
  console.log("================================\n");

  const response = await runGemini({
    messages: testMessage,
    model: modelKey,
    stream: false,
  });

  if (!response) {
    throw new Error(`${modelKey} returned an empty response.`);
  }

  console.log("Response:\n");
  console.log(response);

  console.log(`\n✅ ${modelKey} working.`);
}

async function testGeminiStreaming() {
  console.log("\n================================");
  console.log("Testing Gemini streaming");
  console.log("================================\n");

  await runGemini({
    messages: [
      {
        role: "user",
        content:
          "Explain the difference between frontend and backend development.",
      },
    ],
    model: "gemini-flash",
    stream: true,
    onToken: (token) => {
      process.stdout.write(token);
    },
  });

  console.log("\n\n✅ Gemini streaming working.");
}

async function main() {
  try {
    await testModel("gemini-hydrogen");
    await testModel("gemini-flash");
    await testGeminiStreaming();

    console.log("\n🎉 All Gemini tests completed successfully.");
  } catch (error) {
    console.error("\n❌ Gemini test failed:");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
