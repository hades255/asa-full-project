const fs = require("fs");
const path = require("path");

const prompts = [
  "Breakfast for 3 in London near London eye next Tuesday 11am for 4 hours",
  "Italian restaurant in Manhattan for 4 people this Friday at 7pm",
  "I’d like to book a hotel in Chicago downtown from March 12 for 3 nights.",
  "Private dining room in Brooklyn for birthday party Saturday evening",
  "Looking for a conference room in San Francisco next Monday morning for about 4 hours",
  "Rooftop restaurant in Miami tomorrow night for 2",
  "We need a wedding venue in Dallas for around 120 guests in June.",
  "Boutique hotel near Central Park next weekend",
  "Event space in Los Angeles for baby shower April 20 afternoon",
  "Can I reserve a table in Boston for Thursday at 8pm?",
  "Beachfront hotel in San Diego for family trip July 5 to July 10",
  "Meeting room near Times Square tomorrow at 1pm",
  "I’m planning a graduation party next Saturday evening and need a banquet hall in Atlanta.",
  "Hotel near LAX for tonight",
  "Private rooftop venue in Austin for engagement party May 18 for 5 hours",
  "Restaurant with outdoor seating in Denver Sunday brunch",
  "Conference hall in Seattle for corporate event next month full day",
  "Romantic dinner spot in Paris for 2 next Tuesday",
  "Small meeting space in Houston Friday morning for 3 hours",
  "Luxury hotel in Las Vegas for New Year’s Eve",
  "Need a private event room in Orlando December 10 from 6pm to 10pm for 15 people",
  "Is there any availability for dinner in Brooklyn this Saturday?",
  "Hotel in Miami for 3 adults starting this Friday",
  "Looking to book a quiet cafe space for a meeting tomorrow afternoon",
  "Birthday dinner in Chicago for about 10 people next weekend",
  "I need a place to stay in Boston for a couple of nights next month.",
  "Hi, I’d like to book a table for 3 next Tuesday around 11am.",
  "Do you have a room available for two this Friday night in downtown Chicago?",
  "I’m looking to reserve a table for dinner tomorrow at 7pm.",
  "Can I book a small meeting room for about 4 hours next Monday morning?",
  "I need a hotel room near Times Square from March 12 for two nights.",
  "Is it possible to reserve a table for 5 this Sunday around lunchtime?",
  "I’d like to book a spa appointment at 6pm if you have availability.",
  "Can I get a rooftop table this Saturday evening for about 2 hours?",
  "I’m planning a birthday dinner for 10 people next weekend.",
  "Do you have any rooms left for tonight? It’s just for one person.",
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
