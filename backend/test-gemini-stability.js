
require("dotenv").config();

const { runGemini } = require("./services/providers/gemini");

const MODEL = "gemini-flash";
const TOTAL_TESTS = 3;
const WAIT_BETWEEN_TESTS = 30000;

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function testModel(attempt) {
  console.log("\n====================================");
  console.log(`Gemini Flash Stability Test ${attempt}/${TOTAL_TESTS}`);
  console.log(`Time: ${new Date().toLocaleTimeString()}`);
  console.log("====================================");

  const start = Date.now();

  try {
    const response = await runGemini({
      model: MODEL,
      stream: false,
      messages: [
        {
          role: "user",
          content: "Reply with exactly one word: READY",
        },
      ],
    });

    const duration = ((Date.now() - start) / 1000).toFixed(2);

    if (!response || !response.trim()) {
      throw new Error("Empty response received.");
    }

    console.log("Response:", response.trim());
    console.log(`Duration: ${duration} seconds`);
    console.log("✅ PASSED");

    return true;

  } catch (error) {
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`Duration: ${duration} seconds`);
    console.log("❌ FAILED:", error.message);

    return false;
  }
}

async function main() {
  const results = [];

  console.log("Starting Gemini Flash stability test...");
  console.log("Three sequential requests.");
  console.log("30-second interval between requests.");

  for (let i = 1; i <= TOTAL_TESTS; i++) {
    const passed = await testModel(i);

    results.push({
      attempt: i,
      passed,
    });

    if (i < TOTAL_TESTS) {
      console.log("\nWaiting 30 seconds before next request...");
      await sleep(WAIT_BETWEEN_TESTS);
    }
  }

  const successful = results.filter(
    (result) => result.passed
  ).length;

  const failed = TOTAL_TESTS - successful;

  console.log("\n====================================");
  console.log("GEMINI FLASH STABILITY REPORT");
  console.log("====================================");

  results.forEach((result) => {
    console.log(
      `Test ${result.attempt}: ${
        result.passed ? "PASSED" : "FAILED"
      }`
    );
  });

  console.log(`\nSuccessful: ${successful}/${TOTAL_TESTS}`);
  console.log(`Failed: ${failed}/${TOTAL_TESTS}`);

  if (successful === 3) {
    console.log("\n✅ Gemini Flash passed all stability tests.");
  } else if (successful === 2) {
    console.log("\n⚠️ Gemini Flash has intermittent availability.");
  } else {
    console.log("\n❌ Gemini Flash availability is concerning.");
  }

  if (successful < 3) {
    process.exitCode = 1;
  }
}

main();
