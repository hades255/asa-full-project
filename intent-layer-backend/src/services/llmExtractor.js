import OpenAI from "openai";
import { config } from "../config/env.js";

/**
 * Extract structured SearchIntent from natural-language prompt using OpenAI.
 * Uses JSON mode for reliable output; validates and repairs on our side.
 */

const SYSTEM_PROMPT_BASE = `You extract search intent from user prompts for a space/venue booking app.
Return JSON only, no markdown. Use REAL values, never placeholder words like "string" or "number".
{
  "date": "ISO 8601 (e.g. 2026-02-18T11:00:00.000Z)",
  "duration": 1,
  "noOfGuests": 3,
  "location": { "address": "actual address or area name", "lat": null, "lng": null },
  "categoryIds": ["cat-dining-001"],
  "rawQuery": "original user message",
  "confidence": 0.9,
  "inferredDescription": "Short human-readable summary of what you extracted and inferred (optional)"
}
Rules:
- TODAY is {today}. Infer relative dates (tomorrow, next Tuesday, 11am) from TODAY. Never use past dates.
- location: Use REAL address/place text. Users are on mobile so their location is always in context. When user gives no target ("near me", "book a table", etc.), use "Last known location" from context. For lat/lng use null when unknown (never 0).
- duration and noOfGuests (CRITICAL): When not explicitly stated, FIRST infer the user's PURPOSE (what activity they want: overnight stay, meal, meeting, spa, party, class, appointment, co-working, event, etc.). Then set duration and noOfGuests using common sense for that activity—use world knowledge, not a fixed list. Examples: overnight/room/hotel → 24h per night; meal/table/seat/restaurant → 1-2h (never 24h); meeting/conference → 2-4h; spa/massage/wellness → ~1h; yoga/fitness class → 1h; hair/nail appointment → ~1h; wedding/party reception → 4-6h, infer guests from context; brunch/lunch/dinner → 1-2h; co-working day → 6-8h; photo shoot → 2-3h; "just for one person" → noOfGuests=1; "group of 5" → 5; "N nights" → duration=N*24. Apply this reasoning to ANY activity the user describes. Defaults (duration=1, noOfGuests=1) only when the prompt gives no hint at all.
- categoryIds: Map to known IDs when there's a clear match: dining/table/meal/restaurant → ["cat-dining-001"], meeting/conference → ["cat-meeting-002"], room/hotel/sleep/overnight → ["cat-sleep-001"], spa/wellness/massage → ["cat-relaxation-001"]. For novel activities (yoga, hair salon, event space, etc.) use the closest match or [] if none fits. Include at least one when type is clear.
- inferredDescription: ONLY describe fields that were NOT specified in the prompt. For each field (date, duration, noOfGuests, location, categoryIds), if the user did not state it explicitly, briefly explain what you inferred (e.g. "Duration ~2h for a typical dinner." or "Location set from user's current position."). Do NOT mention fields the user specified. Omit inferredDescription (null) when nothing was inferred.
- Do NOT output userLocation; it is added separately.
- If impossible to extract, use sensible defaults with low confidence.`;

function getSystemPrompt() {
  const today = new Date().toISOString().slice(0, 10);
  return SYSTEM_PROMPT_BASE.replace("{today}", today);
}

function buildUserPrompt(prompt, context) {
  const tz = context?.timezone || config.intent.defaultTimezone;
  let text = `Extract intent from: "${prompt}"`;
  text += `\nUser timezone: ${tz}. Today's date: ${new Date().toISOString().slice(0, 10)}.`;
  if (context?.lastLocation?.address) {
    const loc = context.lastLocation;
    text += `\nUser's current location (mobile - always available; use when no target in prompt): address="${loc.address}"`;
    if (loc.lat != null && loc.lng != null) {
      text += `, lat=${loc.lat}, lng=${loc.lng}`;
    }
  }
  return text;
}

export async function extractIntentWithLLM(prompt, context = {}) {
  const apiKey = config.intent.openaiApiKey;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: config.intent.openaiModel,
    messages: [
      { role: "system", content: getSystemPrompt() },
      { role: "user", content: buildUserPrompt(prompt, context) },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No response from LLM");
  }

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("LLM returned invalid JSON");
  }

  return parsed;
}
