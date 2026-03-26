/**
 * Search LLM Ranker — ranks candidate spaces using OpenAI based on user intent.
 * Input: intent JSON + candidates; Output: ranked recommendations with scores and reasons.
 */

import { config } from "../config/env.js";
import { runOpenAiJson } from "./llmManager.js";

const SYSTEM_PROMPT = `You are a search assistant for a space/venue booking app. Given a user's search intent and a list of candidate spaces, rank the spaces by relevance and explain why.

Input:
1. intent: search-ready object (rawQuery, normalizedQuery, categoryType, serviceLabels, semantic.mustTerms/shouldTerms, date, guests, location, price, rating, facilities, serviceFilters, sort, etc.)
2. candidates: list of spaces with id, name, description, address, averageRating, totalReviews, services, facilities

Output JSON only, no markdown:
{
  "summary": "Brief sentence summarizing results (e.g. '4 Italian restaurants in Londonfor your Friday dinner.')",
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
- Rank by: location match, categoryType vs services, serviceLabels (customer catalog) vs service names/descriptions, semantic.mustTerms/shouldTerms, guests fit, rating, price, facilities, rawQuery.
- Score: 0.0–1.0, higher = better match. Use decimals.
- Give 2–4 reasons per recommendation. Be specific.
- If no candidates match or list is empty, set noMatchMessage to a helpful message and recommendations: [].
- Return at most 20 recommendations.
- Use real candidate ids only; never invent.
- profileName should match the candidate's name field.`;

const MAX_LLM_CANDIDATES = 80;
const DEFAULT_RESULT_LIMIT = config.search.rankResultLimit;

function toLower(v) {
  return String(v || "").toLowerCase();
}

function includesAny(hay, terms) {
  const h = toLower(hay);
  return terms.some((t) => h.includes(toLower(t)));
}

function heuristicScore(intent, candidate) {
  let score = 0;
  const services = Array.isArray(candidate.services) ? candidate.services : [];
  const facilities = Array.isArray(candidate.facilities)
    ? candidate.facilities
    : [];
  const serviceText = services
    .map((s) => `${s.name || ""} ${s.description || ""} ${s.category || ""}`)
    .join(" ");
  const facilityText = facilities.join(" ");

  const mustTerms = intent?.semantic?.mustTerms || [];
  const shouldTerms = intent?.semantic?.shouldTerms || [];
  const requiredFacilities = intent?.facilities?.required || [];
  const serviceLabels = intent?.serviceLabels || [];

  if (mustTerms.length) {
    const matched = mustTerms.filter((t) =>
      includesAny(`${candidate.name} ${candidate.description} ${serviceText}`, [
        t,
      ])
    ).length;
    score += 0.3 * (matched / mustTerms.length);
  }
  if (shouldTerms.length) {
    const matched = shouldTerms.filter((t) =>
      includesAny(`${candidate.name} ${candidate.description} ${serviceText}`, [
        t,
      ])
    ).length;
    score += 0.15 * (matched / shouldTerms.length);
  }
  if (requiredFacilities.length) {
    const matched = requiredFacilities.filter((f) =>
      includesAny(facilityText, [f])
    ).length;
    score += 0.15 * (matched / requiredFacilities.length);
  }
  if (serviceLabels.length && includesAny(serviceText, serviceLabels)) {
    score += 0.1;
  }

  const rating = Number(candidate.averageRating || 0);
  const reviews = Number(candidate.totalReviews || 0);
  score += Math.min(
    0.2,
    (rating / 5) * 0.15 + Math.min(1, reviews / 300) * 0.05
  );

  return Math.max(0, Math.min(1, score));
}

function combineScores(llm, heuristic) {
  const llmScore = typeof llm === "number" ? llm : 0;
  return Math.max(0, Math.min(1, llmScore * 0.75 + heuristic * 0.25));
}

/**
 * Rank candidates using LLM.
 * @param {object} intent - SearchIntent
 * @param {object[]} candidates - Condensed candidate spaces
 * @returns {Promise<{ summary: string, recommendations: object[], noMatchMessage: string|null }>}
 */
export async function rankCandidates(intent, candidates, options = {}) {
  if (!candidates || candidates.length === 0) {
    return {
      summary: "No spaces found matching your criteria.",
      recommendations: [],
      noMatchMessage:
        "Try broadening your search or choosing a different location.",
    };
  }

  const limitedCandidates = candidates.slice(
    0,
    Math.min(
      MAX_LLM_CANDIDATES,
      Math.max(options.resultLimit || DEFAULT_RESULT_LIMIT, 20)
    )
  );
  const userContent = `intent:\n${JSON.stringify(
    intent,
    null,
    2
  )}\n\ncandidates:\n${JSON.stringify(limitedCandidates, null, 2)}`;

  const parsed = await runOpenAiJson({
    model: config.intent.openaiModel || "gpt-4o",
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  });

  const byId = new Map(limitedCandidates.map((c) => [c.id, c]));
  const rawRecommendations = Array.isArray(parsed.recommendations)
    ? parsed.recommendations
    : [];
  const merged = rawRecommendations
    .filter((r) => r?.profileId && byId.has(r.profileId))
    .map((r) => {
      const candidate = byId.get(r.profileId);
      const heuristic = heuristicScore(intent, candidate);
      return {
        ...r,
        score: combineScores(Number(r.score), heuristic),
      };
    })
    .sort((a, b) => b.score - a.score);

  const resultLimit = Math.max(
    5,
    Math.min(20, parseInt(options.resultLimit, 10) || DEFAULT_RESULT_LIMIT)
  );
  const recommendations = merged
    .slice(0, resultLimit)
    .map((r, idx) => ({ ...r, rank: idx + 1 }));

  return {
    summary: parsed.summary ?? "Search results",
    recommendations,
    noMatchMessage: parsed.noMatchMessage ?? null,
  };
}
