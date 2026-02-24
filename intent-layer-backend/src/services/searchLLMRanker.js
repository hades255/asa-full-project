/**
 * Search LLM Ranker — ranks candidate spaces using OpenAI based on user intent.
 * Input: intent JSON + candidates; Output: ranked recommendations with scores and reasons.
 */

import OpenAI from "openai";
import { config } from "../config/env.js";

const SYSTEM_PROMPT = `You are a search assistant for a space/venue booking app. Given a user's search intent and a list of candidate spaces, rank the spaces by relevance and explain why.

Input:
1. intent: structured user request (date, duration, noOfGuests, location, categories, rawQuery)
2. candidates: list of spaces with id, name, description, address, averageRating, totalReviews, services, facilities

Output JSON only, no markdown:
{
  "summary": "Brief sentence summarizing results (e.g. '4 Italian restaurants in Manhattan for your Friday dinner.')",
  "recommendations": [
    {
      "rank": 1,
      "profileId": "<candidate id>",
      "profileName": "<candidate name>",
      "score": 0.92,
      "reasons": ["reason 1", "reason 2"]
    }
  ],
  "noMatchMessage": null
}

Rules:
- Rank by: location match, category/type match, capacity/guests fit, rating, price fit, rawQuery semantics.
- Score: 0.0–1.0, higher = better match. Use decimals.
- Give 2–4 reasons per recommendation. Be specific.
- If no candidates match or list is empty, set noMatchMessage to a helpful message and recommendations: [].
- Return at most 5 recommendations.
- Use real candidate ids only; never invent.
- profileName should match the candidate's name field.`;

/**
 * Rank candidates using LLM.
 * @param {object} intent - SearchIntent
 * @param {object[]} candidates - Condensed candidate spaces
 * @returns {Promise<{ summary: string, recommendations: object[], noMatchMessage: string|null }>}
 */
export async function rankCandidates(intent, candidates) {
  const apiKey = config.intent?.openaiApiKey;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  if (!candidates || candidates.length === 0) {
    return {
      summary: "No spaces found matching your criteria.",
      recommendations: [],
      noMatchMessage: "Try broadening your search or choosing a different location.",
    };
  }

  const userContent = `intent:\n${JSON.stringify(intent, null, 2)}\n\ncandidates:\n${JSON.stringify(candidates, null, 2)}`;

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: config.intent.openaiModel || "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
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

  return {
    summary: parsed.summary ?? "Search results",
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    noMatchMessage: parsed.noMatchMessage ?? null,
  };
}
