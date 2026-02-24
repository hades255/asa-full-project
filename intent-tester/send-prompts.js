const fs = require("fs");
const path = require("path");

const prompts = [
  // --- RELAXATION / SPA / WELLNESS ---
  "Spa day pass in Manhattan for 2 this Friday at 3pm for 3 hours",
  "Deep tissue massage in London for 1 next Tuesday at 6pm",
  "Couples massage near Central Park this Saturday at 5pm for 2 hours",
  "Hydrating facial in Paris tomorrow at 2pm for 90 minutes",
  "Sauna and steam room access in Berlin this Sunday at 11am for 2 hours",
  "Pool access in Dubai this Friday at 1pm for 4 hours",
  "Yoga class in Amsterdam next Monday at 7am",
  "Gym access near Times Square today at 6pm for 2 hours",
  "Spa + indoor pool in Barcelona for 2 next weekend around noon",
  "Relaxation retreat in Rome for 1 this Saturday afternoon for 3 hours",

  // --- DINING ---
  "Breakfast buffet in London near Westminster next Wednesday at 10am for 2 hours for 3 people",
  "Afternoon tea in Paris for 2 this Friday at 4pm",
  "Dinner tasting menu in Manhattan for 4 this Friday at 7pm for 2 hours",
  "Cocktails at a bar in Tokyo tonight at 9pm for 2",
  "Lunch set menu in Berlin tomorrow at 1pm for 2 people",
  "Dinner in Amsterdam for 6 next Saturday at 8pm",
  "Breakfast in Barcelona for 2 tomorrow at 9am",
  "Romantic dinner in Paris for 2 next Tuesday at 7pm",
  "Private dinner vibe in Brooklyn for 10 people next weekend at 7pm",
  "Late-night bar in Los Angeles for 3 tonight at 11pm",

  // --- SLEEP / HOTEL STAY ---
  "Boutique wellness hotel in London for 2 adults starting this Friday for 2 nights",
  "Hotel & spa in Manhattan for 2 next weekend for 3 nights",
  "Luxury wellness hotel in Paris for 1 from March 12 for 2 nights",
  "Quiet hotel in Berlin near city center for tonight",
  "Hotel with indoor pool in Dubai for family trip July 5 to July 10",
  "Suite in Rome for 2 next Friday for 1 night",
  "Hotel in Tokyo for 3 adults starting next Monday for 4 nights",
  "Wellness retreat stay in Barcelona from April 20 for 2 nights",
  "Hotel near Central Park for 2 this weekend",
  "Room available for tonight in Amsterdam for one person",

  // --- WORKSPACE / MEETINGS ---
  "Meeting room in London tomorrow at 10am for 4 hours for 6 people",
  "Conference room in Manhattan next Monday morning for about 3 hours",
  "Coworking desk in Berlin today from 1pm for 6 hours",
  "Small meeting room in Amsterdam next Tuesday at 2pm for 2 hours",
  "Meeting room near Times Square tomorrow at 1pm for 2 hours",
  "Conference room in Los Angeles for 10 people next Friday at 9am for 5 hours",
  "Quiet coworking space in Paris tomorrow afternoon for 4 hours",
  "Business center workspace in Dubai this Monday at 8am for 3 hours",
  "Meeting room in Tokyo next Wednesday at 11am for 2 hours",
  "Coworking desk in Barcelona next Monday for the day",

  // --- FACILITY-DRIVEN QUERIES (maps nicely to Facility.name) ---
  "Spa hotel with free Wi-Fi and parking in London for 2 next weekend",
  "Wellness hotel with EV charging in Berlin for 2 starting Friday for 2 nights",
  "Hotel with indoor pool and sauna in Paris for 2 tomorrow night",
  "Spa resort with massage rooms and concierge in Manhattan this Saturday",
  "Place with wheelchair accessible spa and elevator in Amsterdam for 1 next Tuesday at 5pm",
  "Pet friendly hotel & spa in Los Angeles for tonight",
  "Non-smoking rooms with room service in Dubai for 2 next week",
  "Family friendly resort with outdoor pool in Barcelona for July 5 to July 10",
  "Boutique hotel with bar and restaurant in Rome for 2 this weekend",
  "Hotel with airport shuttle and laundry service in Tokyo for 1 starting next Monday for 3 nights",

  // --- AMBIGUOUS / NEEDS REPAIR (good for testing repair/clarification) ---
  "Spa in Manhattan tomorrow evening for a couple hours",
  "Somewhere relaxing in London for 2 next weekend",
  "I need a massage late tonight near Times Square",
  "Book a hotel in Paris next month for a few nights",
  "Looking for breakfast near Central Park around 10ish for 3",
  "Conference space in Berlin for a team meeting sometime next week",
  "Pool and sauna access in Dubai for tomorrow",
  "Dinner in Manhattan for 4 this Friday",
  "Coworking in Amsterdam tomorrow",
  "A quiet hotel in Rome with good reviews for this weekend",
];

const API_URL = "http://localhost:3001/api/intent/parse";
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
      `[${i + 1}/${prompts.length}] Sending: "${prompt.slice(0, 50)}..."`,
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
