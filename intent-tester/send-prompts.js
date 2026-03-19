const fs = require("fs");
const path = require("path");

const prompts = [
  "Breakfast for 3 in London near London eye next Tuesday 11am for 4 hours",
  "Italian restaurant in Manhattan for 4 people this Friday at 7pm",
  "I’d like to book a hotel in Chicago downtown from March 12 for 3 nights.",
];

// const API_URL = "http://localhost:3001/api/intent/search-by-prompt";
const API_URL = "http://144.172.91.222:20001/api/intent/search-by-prompt";
const OUTPUT_FILE = path.join(__dirname, "intent-parse-results.json");

const defaultContext = {
  timezone: "Europe/London",
  lastLocation: {
    lat: 51.576525,
    lng: -0.1537649,
    address: "14 Grange Road, London, N6 4DG, United Kingdom",
  },
};

async function sendPrompt(prompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      context: defaultContext,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  const results = [];

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i];
    console.log(
      `[${i + 1}/${prompts.length}] Sending: "${prompt.slice(0, 50)}..."`
    );

    try {
      const result = await sendPrompt(prompt);
      const entry = { prompt, result, index: i + 1 };
      results.push(entry);

      // Save after each successful response
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf-8");
      console.log(`  ✓ Saved to ${OUTPUT_FILE}`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      results.push({
        prompt,
        error: err.message,
        index: i + 1,
      });
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), "utf-8");
    }
  }

  console.log(`\nDone. All ${results.length} results saved to ${OUTPUT_FILE}`);
}

main().catch(console.error);
