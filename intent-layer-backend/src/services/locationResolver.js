import axios from "axios";
import { config } from "../config/env.js";
import { logError, logEvent } from "../lib/eventLogger.js";
import { runOpenAiJson } from "./llmManager.js";

const PLACEHOLDERS = new Set([
  "string",
  "number",
  "null",
  "undefined",
  "unknown",
]);

function cleanText(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (PLACEHOLDERS.has(text.toLowerCase())) return "";
  return text;
}

function hasValidCoords(location) {
  if (!location || typeof location !== "object") return false;
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return false;
  return lat !== 0 || lng !== 0;
}

async function geocodeLocation(query) {
  const endpoint = config.geocoding.endpoint.replace(/\/+$/, "");
  const url = `${endpoint}/search`;
  const { data } = await axios.get(url, {
    params: {
      q: query,
      format: "jsonv2",
      addressdetails: 1,
      limit: 1,
    },
    timeout: config.geocoding.timeoutMs,
    headers: {
      "User-Agent": config.geocoding.userAgent,
      Accept: "application/json",
    },
  });

  const first = Array.isArray(data) ? data[0] : null;
  if (!first) return null;
  const lat = Number(first.lat);
  const lng = Number(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const road = String(first.address?.road || "").trim();
  const city = String(
    first.address?.city ||
      first.address?.town ||
      first.address?.village ||
      first.address?.state_district ||
      ""
  ).trim();
  const compactAddress =
    road && city
      ? `${road}, ${city}`
      : String(first.display_name || query).trim();
  return {
    address: compactAddress,
    lat,
    lng,
  };
}

function extractCityOrRegion(lastAddress) {
  const text = cleanText(lastAddress);
  if (!text) return "";
  const parts = text
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  for (const part of parts) {
    if (/^london\b/i.test(part)) return "London";
  }
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const p = parts[i];
    if (!/\d/.test(p) && p.length >= 3) return p;
  }
  return "";
}

function countryFromTimezone(tz) {
  const t = cleanText(tz).toLowerCase();
  if (!t) return "";
  if (t.includes("london")) return "United Kingdom";
  if (t.includes("dubai")) return "United Arab Emirates";
  if (t.includes("new_york")) return "United States";
  return "";
}

function composeContextQuery(query, context = {}) {
  const city = extractCityOrRegion(context?.lastLocation?.address);
  const country = countryFromTimezone(context?.timezone);
  const pieces = [query, city, country].filter(Boolean);
  return pieces.join(", ");
}

function stripProximityPrefix(text) {
  const t = cleanText(text);
  if (!t) return "";
  return t
    .replace(/^(near|around|close to|close by|nearby|by|in|at)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function aiDisambiguateQuery(query, context = {}) {
  if (!config.intent.extractionEnabled || !config.intent.openaiApiKey) {
    return composeContextQuery(query, context) || query;
  }
  const fallback = composeContextQuery(query, context) || query;
  const timezone =
    cleanText(context?.timezone) || config.intent.defaultTimezone;
  const lastAddress = cleanText(context?.lastLocation?.address);
  const lastLat =
    context?.lastLocation?.lat != null
      ? Number(context.lastLocation.lat)
      : null;
  const lastLng =
    context?.lastLocation?.lng != null
      ? Number(context.lastLocation.lng)
      : null;
  try {
    const out = await runOpenAiJson({
      model: config.intent.openaiModel,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            'Return only JSON: {"query":"..."} . Expand ambiguous place text into a geocodable query using user context. Keep the original place phrase. Never invent unrelated cities.',
        },
        {
          role: "user",
          content: `Place text: "${query}"\nTimezone: "${timezone}"\nLast known address: "${lastAddress}"\nLast known coordinates: lat=${lastLat}, lng=${lastLng}\nIf ambiguous, prefer the country/city implied by context.`,
        },
      ],
    });
    const aiQuery = cleanText(out?.query);
    return aiQuery || fallback;
  } catch (err) {
    logError("intent.location.ai_disambiguate.error", err, { query });
    return fallback;
  }
}

async function aiResolveLocation(query, context = {}) {
  if (!config.intent.extractionEnabled || !config.intent.openaiApiKey) {
    return null;
  }
  const timezone =
    cleanText(context?.timezone) || config.intent.defaultTimezone;
  const lastAddress = cleanText(context?.lastLocation?.address);
  const lastLat =
    context?.lastLocation?.lat != null
      ? Number(context.lastLocation.lat)
      : null;
  const lastLng =
    context?.lastLocation?.lng != null
      ? Number(context.lastLocation.lng)
      : null;
  const contextual = composeContextQuery(query, context) || query;
  try {
    const out = await runOpenAiJson({
      model: config.intent.openaiModel,
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "Return only JSON with keys: query,address,lat,lng,confidence. Prefer context when place text is ambiguous. If unsure about coordinates, return lat/lng as null.",
        },
        {
          role: "user",
          content: `Resolve this place for search.\nPlace text: "${query}"\nContextual query: "${contextual}"\nTimezone: "${timezone}"\nLast known address: "${lastAddress}"\nLast known coordinates: lat=${lastLat}, lng=${lastLng}`,
        },
      ],
    });
    const lat = out?.lat != null ? Number(out.lat) : null;
    const lng = out?.lng != null ? Number(out.lng) : null;
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
    return {
      query: cleanText(out?.query) || contextual,
      address: cleanText(out?.address),
      lat: hasCoords ? lat : null,
      lng: hasCoords ? lng : null,
      confidence:
        out?.confidence != null && Number.isFinite(Number(out.confidence))
          ? Number(out.confidence)
          : null,
    };
  } catch (err) {
    logError("intent.location.ai_resolve.error", err, { query });
    return null;
  }
}

/**
 * Fill intent.location coordinates using queryText/address when missing.
 * Keeps nearUser behavior intact and never overwrites existing coordinates.
 */
export async function resolveIntentLocation(intent, repair, context = {}) {
  if (!intent?.location) return { intent, repair };
  if (intent.location.nearUser === true) return { intent, repair };
  if (hasValidCoords(intent.location)) return { intent, repair };

  const queryText = cleanText(intent.location.queryText);
  const address = cleanText(intent.location.address);
  const rawQuery = queryText || address;
  if (!rawQuery) return { intent, repair };

  let attemptedQueries = [];
  try {
    const base = stripProximityPrefix(rawQuery);
    const aiResolved = await aiResolveLocation(base || rawQuery, context);
    if (aiResolved?.lat != null && aiResolved?.lng != null) {
      intent.location = {
        ...intent.location,
        address: aiResolved.address || aiResolved.query || rawQuery,
        lat: aiResolved.lat,
        lng: aiResolved.lng,
        radiusKm:
          intent.location.radiusKm != null &&
          Number.isFinite(Number(intent.location.radiusKm))
            ? Number(intent.location.radiusKm)
            : 5,
        nearUser: false,
      };
      const changes = [
        ...(repair?.changes || []),
        `resolved location "${rawQuery}" using OpenAI coordinates`,
      ];
      return {
        intent,
        repair: {
          applied: true,
          changes,
        },
      };
    }

    if (!config.geocoding.enabled) return { intent, repair };

    const aiQuery =
      aiResolved?.query ||
      (await aiDisambiguateQuery(base || rawQuery, context));
    const baseWithContext = composeContextQuery(base || rawQuery, context);
    const rawWithContext = composeContextQuery(rawQuery, context);

    const candidates = [
      aiQuery,
      baseWithContext,
      rawWithContext,
      base,
      rawQuery,
      address,
    ]
      .map((q) => cleanText(q))
      .filter(Boolean)
      .filter((q, i, arr) => arr.indexOf(q) === i);

    let resolved = null;
    for (const query of candidates) {
      attemptedQueries.push(query);
      logEvent("intent.location.geocode.try", { query });
      resolved = await geocodeLocation(query);
      if (resolved) break;
    }
    if (!resolved) {
      const fallbackLat =
        context?.lastLocation?.lat != null
          ? Number(context.lastLocation.lat)
          : null;
      const fallbackLng =
        context?.lastLocation?.lng != null
          ? Number(context.lastLocation.lng)
          : null;
      if (Number.isFinite(fallbackLat) && Number.isFinite(fallbackLng)) {
        const fallbackAddress =
          cleanText(context?.lastLocation?.address) ||
          cleanText(intent.userLocation?.address) ||
          address ||
          rawQuery;
        intent.location = {
          ...intent.location,
          address: fallbackAddress || null,
          lat: fallbackLat,
          lng: fallbackLng,
          radiusKm:
            intent.location.radiusKm != null &&
            Number.isFinite(Number(intent.location.radiusKm))
              ? Number(intent.location.radiusKm)
              : 5,
          nearUser: false,
        };
        const changes = [
          ...(repair?.changes || []),
          `fallback to user location after unresolved "${rawQuery}"`,
        ];
        return {
          intent,
          repair: {
            applied: true,
            changes,
          },
        };
      }
      return { intent, repair };
    }

    intent.location = {
      ...intent.location,
      address: resolved.address,
      lat: resolved.lat,
      lng: resolved.lng,
      radiusKm:
        intent.location.radiusKm != null &&
        Number.isFinite(Number(intent.location.radiusKm))
          ? Number(intent.location.radiusKm)
          : 5,
      nearUser: false,
    };

    const changes = [
      ...(repair?.changes || []),
      `resolved location "${rawQuery}" to coordinates`,
      ...(attemptedQueries[0] && attemptedQueries[0] !== rawQuery
        ? [`geocoded using contextual query "${attemptedQueries[0]}"`]
        : []),
    ];
    return {
      intent,
      repair: {
        applied: true,
        changes,
      },
    };
  } catch (err) {
    logError("intent.location.geocode.error", err, {
      rawQuery,
      attemptedQueries,
    });
    return { intent, repair };
  }
}
