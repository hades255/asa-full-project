import { fetchCandidates } from "../services/candidateFetcher.js";
import { rankCandidates } from "../services/searchLLMRanker.js";
import { validateAndRepair } from "../services/intentValidator.js";
import { extractIntentWithLLM } from "../services/llmExtractor.js";
import { resolveIntentLocation } from "../services/locationResolver.js";
import { config } from "../config/env.js";
import { getPrisma } from "../lib/db.js";
import { getFullProfilesByIds } from "../modules/search/index.js";
import { logError, logEvent } from "../lib/eventLogger.js";

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
 * @param {object} options - { sessionId?, categoryIds?, fetchLimit?, resultLimit? }
 * @returns {Promise<{ intent, summary, recommendations, candidatesCount, noMatchMessage, _mock? }>}
 */
export async function runSearchFlow(intent, options = {}) {
  logEvent("search.flow.started", {
    hasCategoryType: !!intent?.categoryType,
    hasCategoryIds:
      Array.isArray(intent?.categoryIds) && intent.categoryIds.length > 0,
    fetchLimit: options.fetchLimit ?? null,
    resultLimit: options.resultLimit ?? null,
  });
  const { candidates, total, error, _mock, _source, fullCandidatesById } =
    await fetchCandidates(intent, {
      sessionId: options.sessionId,
      categoryIds: options.categoryIds,
      fetchLimit: options.fetchLimit,
    });

  if (error) {
    logError("search.flow.candidate_fetch_failed", new Error(error), {
      source: _source || "unknown",
    });
    return {
      intent,
      summary: "Search could not fetch candidates.",
      recommendations: [],
      candidatesCount: 0,
      returnedCount: 0,
      noMatchMessage: error,
    };
  }

  const ranked = await rankCandidates(intent, candidates, {
    resultLimit: options.resultLimit,
  });
  logEvent("search.flow.ranking_done", {
    source: _source || "unknown",
    candidatesFetched: total,
    rankedCount: ranked.recommendations?.length || 0,
  });
  const fullById = fullCandidatesById ?? new Map();
  const enriched = await enrichRecommendations(
    ranked.recommendations,
    fullById
  );
  const ensuredRecommendations = enriched;

  return {
    intent,
    summary: ranked.summary,
    recommendations: ensuredRecommendations,
    candidatesCount: total,
    returnedCount: ensuredRecommendations.length,
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
    let { intent, repair } = validateAndRepair({
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
    ({ intent, repair } = await resolveIntentLocation(intent, repair, context));
    return { intent, repair };
  }

  const raw = await extractIntentWithLLM(trimmed, context);
  let { intent, repair } = validateAndRepair(raw);

  const placeholders = ["string", "number", "null", "undefined"];
  const lastLoc = context?.lastLocation;
  const lastAddr = String(lastLoc?.address || "")
    .trim()
    .toLowerCase();
  const lastLocValid =
    lastLoc?.address &&
    lastAddr.length >= 2 &&
    !placeholders.includes(lastAddr);

  intent.userLocation = lastLocValid
    ? {
        address: lastLoc.address,
        ...(lastLoc.lat != null &&
          lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
        ...(lastLoc.lng != null &&
          lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
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
        ...(lastLoc.lat != null &&
          lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
        ...(lastLoc.lng != null &&
          lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
      };
      repair = {
        applied: true,
        changes: [
          ...(repair.changes || []),
          "location enriched from user location",
        ],
      };
    }
  }

  ({ intent, repair } = await resolveIntentLocation(intent, repair, context));
  console.log("intent.userLocation", intent.userLocation);
  console.log("intent.location", intent.location);
  return { intent, repair };
}

/**
 * POST /api/intent/search
 * Input: { intent } — JSON from intent layer.
 * Output: ranked recommendations.
 */
export async function searchByIntent(req, res) {
  try {
    const {
      intent: bodyIntent,
      parsedIntent,
      sessionId,
      categoryIds,
      fetchLimit,
      resultLimit,
      context,
    } = req.body || {};
    const incomingIntent = bodyIntent || parsedIntent;
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    logEvent("search.intent.request_received", {
      requestId,
      hasIntent: !!incomingIntent,
      hasParsedIntent: !!parsedIntent,
    });

    if (!incomingIntent || typeof incomingIntent !== "object") {
      logEvent("search.intent.validation_failed", {
        requestId,
        reason: "missing_intent",
      });
      return res.status(400).json({ message: "intent is required (object)" });
    }

    let { intent, repair } = validateAndRepair(incomingIntent);
    ({ intent, repair } = await resolveIntentLocation(intent, repair, context));
    console.log("intent.userLocation", intent.userLocation);
    console.log("intent.location", intent.location);

    const result = await runSearchFlow(intent, {
      sessionId: sessionId || req.headers["session-id"],
      categoryIds,
      fetchLimit,
      resultLimit,
    });

    logEvent("search.intent.response_sent", {
      requestId,
      candidatesCount: result.candidatesCount,
      returnedCount: result.returnedCount,
      repairApplied: !!repair?.applied,
    });
    return res.status(200).json({ ...result, repair });
  } catch (err) {
    logError("search.intent.unhandled_error", err);
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
  const address =
    loc?.address != null && String(loc.address).trim()
      ? String(loc.address).trim()
      : null;
  const partial = {
    rawQuery: filters?.rawQuery != null ? String(filters.rawQuery) : "",
    date: {
      checkIn: filters?.date
        ? new Date(filters.date).toISOString()
        : new Date().toISOString(),
      checkOut: null,
      duration:
        filters?.duration != null
          ? Math.max(1, parseInt(filters.duration, 10) || 1)
          : null,
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
    ...(filters?.categoryType && {
      categoryType: String(filters.categoryType).toUpperCase(),
    }),
    confidence: 1,
  };
  const { intent, repair } = validateAndRepair({ intent: partial });
  intent.userLocation = lastLocation?.address
    ? {
        address: lastLocation.address,
        ...(lastLocation.lat != null &&
          lastLocation.lat !== 0 && { lat: Number(lastLocation.lat) }),
        ...(lastLocation.lng != null &&
          lastLocation.lng !== 0 && { lng: Number(lastLocation.lng) }),
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
    const {
      filters = {},
      lastLocation,
      sessionId,
      fetchLimit,
      resultLimit,
    } = req.body || {};
    const session = sessionId || req.headers["session-id"];
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    logEvent("search.filters.request_received", {
      requestId,
      hasFilters: !!filters,
      hasLastLocation: !!lastLocation,
    });

    let { intent, repair } = intentFromFilters(filters, lastLocation);
    ({ intent, repair } = await resolveIntentLocation(intent, repair, {
      lastLocation,
    }));
    console.log("intent.userLocation", intent.userLocation);
    console.log("intent.location", intent.location);
    const result = await runSearchFlow(intent, {
      sessionId: session,
      categoryIds: intent.categoryIds?.length ? intent.categoryIds : undefined,
      fetchLimit,
      resultLimit,
    });

    logEvent("search.filters.response_sent", {
      requestId,
      candidatesCount: result.candidatesCount,
      returnedCount: result.returnedCount,
      repairApplied: !!repair?.applied,
    });
    return res.status(200).json({
      ...result,
      repair,
    });
  } catch (err) {
    logError("search.filters.unhandled_error", err);
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
    const { prompt, context, sessionId, categoryIds, fetchLimit, resultLimit } =
      req.body || {};
    const session = sessionId || req.headers["session-id"];
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    logEvent("search.prompt.request_received", {
      requestId,
      hasPrompt: !!prompt,
      hasContext: !!context,
    });

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      logEvent("search.prompt.validation_failed", {
        requestId,
        reason: "missing_prompt",
      });
      return res.status(400).json({ message: "prompt is required" });
    }

    const { intent, repair } = await parsePromptToIntent(
      prompt.trim(),
      context || {}
    );
    logEvent("search.prompt.intent_parsed", {
      requestId,
      repairApplied: !!repair?.applied,
      repairChanges: repair?.changes?.length || 0,
    });

    const result = await runSearchFlow(intent, {
      sessionId: session,
      categoryIds,
      fetchLimit,
      resultLimit,
    });

    logEvent("search.prompt.response_sent", {
      requestId,
      candidatesCount: result.candidatesCount,
      returnedCount: result.returnedCount,
    });
    return res.status(200).json({
      ...result,
      repair,
    });
  } catch (err) {
    logError("search.prompt.unhandled_error", err);
    const isExtraction =
      err.message?.includes("extract") || err.message?.includes("LLM");
    return res.status(isExtraction ? 422 : 500).json({
      message: isExtraction ? "Could not extract intent" : "Search failed",
      details: err.message || "Server error",
    });
  }
}
