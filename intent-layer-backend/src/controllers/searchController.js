import { fetchCandidates } from "../services/candidateFetcher.js";
import { rankCandidates } from "../services/searchLLMRanker.js";
import { validateAndRepair } from "../services/intentValidator.js";
import { extractIntentWithLLM } from "../services/llmExtractor.js";
import { config } from "../config/env.js";
import { getPrisma } from "../lib/db.js";
import { getFullProfilesByIds } from "../modules/search/index.js";

/**
 * Enrich recommendations with full profile data.
 * @param {object[]} recommendations - { rank, profileId, profileName, score, reasons }
 * @param {Map<string,object>} fullCandidatesById
 * @returns {Promise<object[]>} Recommendations with profile attached
 */
async function enrichRecommendations(recommendations, fullCandidatesById) {
  const prisma = getPrisma();
  const missingIds = recommendations
    .filter((r) => r.profileId && !fullCandidatesById.has(r.profileId))
    .map((r) => r.profileId);
  if (missingIds.length > 0 && prisma) {
    const extra = await getFullProfilesByIds(prisma, missingIds);
    for (const [id, profile] of extra) {
      fullCandidatesById.set(id, profile);
    }
  }
  return recommendations.map((r) => ({
    ...r,
    profile: r.profileId ? fullCandidatesById.get(r.profileId) ?? null : null,
  }));
}

/**
 * Run search flow: intent → fetch candidates → LLM rank.
 * Reusable for both /search (intent input) and /search-by-prompt (raw prompt).
 * Each recommendation includes full profile with facilities, services (with category).
 *
 * @param {object} intent - SearchIntent
 * @param {object} options - { sessionId?, categoryIds? }
 * @returns {Promise<{ intent, summary, recommendations, candidatesCount, noMatchMessage, _mock? }>}
 */
export async function runSearchFlow(intent, options = {}) {
  const { candidates, total, error, _mock, _source, fullCandidatesById } = await fetchCandidates(intent, {
    sessionId: options.sessionId,
    categoryIds: options.categoryIds,
  });

  if (error) {
    return {
      intent,
      summary: "Search could not fetch candidates.",
      recommendations: [],
      candidatesCount: 0,
      noMatchMessage: error,
    };
  }

  const ranked = await rankCandidates(intent, candidates);
  const fullById = fullCandidatesById ?? new Map();
  const enriched = await enrichRecommendations(ranked.recommendations, fullById);

  return {
    intent,
    summary: ranked.summary,
    recommendations: enriched,
    candidatesCount: total,
    noMatchMessage: ranked.noMatchMessage,
    ...((_mock || _source === "mock") && { _mock: true }),
  };
}

/**
 * Parse prompt to intent. Reuses intent controller logic.
 * @param {string} prompt
 * @param {object} context
 * @returns {Promise<{ intent, repair }>}
 */
async function parsePromptToIntent(prompt, context = {}) {
  const trimmed = prompt?.trim();
  if (!trimmed) {
    throw new Error("prompt is required");
  }

  if (!config.intent.extractionEnabled || !config.intent.openaiApiKey) {
    return validateAndRepair({
      intent: {
        rawQuery: trimmed,
        normalizedQuery: trimmed.toLowerCase().replace(/\s+/g, " ").trim(),
        location: {
          queryText: null,
          address: trimmed.length >= 2 ? trimmed : null,
          lat: null,
          lng: null,
          radiusKm: null,
          nearUser: false,
        },
        guests: { noOfGuests: 1 },
        date: { checkIn: new Date().toISOString(), duration: 1 },
        confidence: 0,
      },
    });
  }

  const raw = await extractIntentWithLLM(trimmed, context);
  let { intent, repair } = validateAndRepair(raw);

  const placeholders = ["string", "number", "null", "undefined"];
  const lastLoc = context?.lastLocation;
  const lastAddr = String(lastLoc?.address || "").trim().toLowerCase();
  const lastLocValid = lastLoc?.address && lastAddr.length >= 2 && !placeholders.includes(lastAddr);

  intent.userLocation = lastLocValid
    ? {
        address: lastLoc.address,
        ...(lastLoc.lat != null && lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
        ...(lastLoc.lng != null && lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
      }
    : null;

  if (lastLocValid && intent.location) {
    const addr = String(intent.location.address || "").trim();
    const needsEnrich =
      intent.location.nearUser === true ||
      addr.length < 2 ||
      placeholders.includes(addr.toLowerCase());
    if (needsEnrich) {
      intent.location = {
        address: lastLoc.address,
        ...(lastLoc.lat != null && lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
        ...(lastLoc.lng != null && lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
      };
      repair = {
        applied: true,
        changes: [...(repair.changes || []), "location enriched from user location"],
      };
    }
  }

  return { intent, repair };
}

/**
 * POST /api/intent/search
 * Input: { intent } — JSON from intent layer.
 * Output: ranked recommendations.
 */
export async function searchByIntent(req, res) {
  try {
    const { intent: bodyIntent, sessionId, categoryIds } = req.body || {};

    if (!bodyIntent || typeof bodyIntent !== "object") {
      return res.status(400).json({ message: "intent is required (object)" });
    }

    const { intent, repair } = validateAndRepair(bodyIntent);

    const result = await runSearchFlow(intent, {
      sessionId: sessionId || req.headers["session-id"],
      categoryIds,
    });

    return res.status(200).json({ ...result, repair });
  } catch (err) {
    console.error("Search by intent error:", err);
    return res.status(500).json({
      message: "Search failed",
      details: err.message || "Server error",
    });
  }
}

/**
 * Build search-ready intent from manual filters.
 * @param {object} filters - { date?, duration?, noOfGuests?, location?, categoryIds?, categoryType?, radiusKm?, rawQuery? }
 * @param {object} lastLocation - { address, lat?, lng? }
 */
function intentFromFilters(filters, lastLocation) {
  const loc = filters?.location || lastLocation;
  const address = loc?.address != null && String(loc.address).trim() ? String(loc.address).trim() : null;
  const partial = {
    rawQuery: filters?.rawQuery != null ? String(filters.rawQuery) : "",
    date: {
      checkIn: filters?.date ? new Date(filters.date).toISOString() : new Date().toISOString(),
      checkOut: null,
      duration: filters?.duration != null ? Math.max(1, parseInt(filters.duration, 10) || 1) : null,
      timeText: null,
      serviceTime: null,
      timeOfDay: null,
      isFlexible: false,
    },
    guests: {
      noOfGuests: Math.max(0, parseInt(filters?.noOfGuests, 10) || 0),
      rooms: null,
      adults: null,
      children: null,
    },
    location: {
      queryText: null,
      address,
      lat: loc?.lat != null ? Number(loc.lat) : null,
      lng: loc?.lng != null ? Number(loc.lng) : null,
      radiusKm: filters?.radiusKm != null ? Number(filters.radiusKm) : null,
      nearUser: false,
    },
    categoryIds: Array.isArray(filters?.categoryIds) ? filters.categoryIds : [],
    ...(filters?.categoryType && { categoryType: String(filters.categoryType).toUpperCase() }),
    confidence: 1,
  };
  const { intent, repair } = validateAndRepair({ intent: partial });
  intent.userLocation = lastLocation?.address
    ? {
        address: lastLocation.address,
        ...(lastLocation.lat != null && lastLocation.lat !== 0 && { lat: Number(lastLocation.lat) }),
        ...(lastLocation.lng != null && lastLocation.lng !== 0 && { lng: Number(lastLocation.lng) }),
      }
    : null;
  return { intent, repair };
}

/**
 * POST /api/intent/search-with-filters
 * Input: { filters: { date?, duration?, noOfGuests?, location?, categoryIds? }, lastLocation?, sessionId? }
 * Uses manual filters (no LLM). Output: intent + ranked recommendations.
 */
export async function searchWithFilters(req, res) {
  try {
    const { filters = {}, lastLocation, sessionId } = req.body || {};
    const session = sessionId || req.headers["session-id"];

    const { intent, repair } = intentFromFilters(filters, lastLocation);
    const result = await runSearchFlow(intent, {
      sessionId: session,
      categoryIds: intent.categoryIds?.length ? intent.categoryIds : undefined,
    });

    return res.status(200).json({
      ...result,
      repair,
    });
  } catch (err) {
    console.error("Search with filters error:", err);
    return res.status(500).json({
      message: "Search failed",
      details: err.message || "Server error",
    });
  }
}

/**
 * POST /api/intent/search-by-prompt
 * Input: { prompt, context?, sessionId? }
 * Does: parse prompt → intent → fetch candidates → LLM rank.
 * Output: intent + ranked recommendations.
 */
export async function searchByPrompt(req, res) {
  try {
    const { prompt, context, sessionId, categoryIds } = req.body || {};
    const session = sessionId || req.headers["session-id"];

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ message: "prompt is required" });
    }

    const { intent, repair } = await parsePromptToIntent(prompt.trim(), context || {});

    const result = await runSearchFlow(intent, {
      sessionId: session,
      categoryIds,
    });

    return res.status(200).json({
      ...result,
      repair,
    });
  } catch (err) {
    console.error("Search by prompt error:", err);
    const isExtraction = err.message?.includes("extract") || err.message?.includes("LLM");
    return res.status(isExtraction ? 422 : 500).json({
      message: isExtraction ? "Could not extract intent" : "Search failed",
      details: err.message || "Server error",
    });
  }
}
