/**
 * HTTP candidate source — AllSpaces backend API.
 * Requires ALLSPACES_API_BASE_URL.
 */

import axios from "axios";
import { toFullProfile } from "../../search/index.js";
import { config } from "../../../config/env.js";
import { logError, logEvent } from "../../../lib/eventLogger.js";

const SEARCH_LIMIT = config.search.candidateFetchLimit;

function condenseHttpProfile(p) {
  const services = (p.services || []).map((s) => ({
    name: s.name || "",
    description: (s.description || "").slice(0, 80),
    minSpend: s.minSpend ?? 0,
    category: s.category?.title || s.category?.type || "",
  }));
  const facilities = (p.facilities || [])
    .map((f) => (typeof f === "string" ? f : f.name || ""))
    .filter(Boolean);
  return {
    id: p.id || "",
    name: p.name || "",
    description: (p.description || "").slice(0, 300),
    address: p.address || "",
    location: p.location || { lat: p.lat ?? 0, lng: p.lng ?? 0 },
    averageRating: p.averageRating ?? 0,
    totalReviews: p.totalReviews ?? 0,
    services,
    facilities,
  };
}

function buildFullMap(profiles) {
  const map = new Map();
  for (const p of profiles) {
    const full = toFullProfile(p);
    if (full?.id) map.set(full.id, full);
  }
  return map;
}

/**
 * Fetch candidates from AllSpaces HTTP API.
 * @param {object} baseConfig - { apiBaseUrl, apiKey }
 */
export function createHttpSource(baseConfig) {
  return async function fetchHttpCandidates(intent, options = {}) {
    const { sessionId, categoryIds, skipCategories = false } = options;
    const fetchLimit = Math.max(
      20,
      parseInt(options?.fetchLimit, 10) || SEARCH_LIMIT
    );
    const baseUrl = baseConfig?.apiBaseUrl?.trim();
    logEvent("search.candidates.http.start", {
      fetchLimit,
      hasCategoryIds:
        (Array.isArray(categoryIds) && categoryIds.length > 0) ||
        (Array.isArray(intent?.categoryIds) && intent.categoryIds.length > 0),
      hasSessionId: !!sessionId,
    });
    if (!baseUrl) {
      return {
        candidates: [],
        total: 0,
        fullCandidatesById: new Map(),
        error: "ALLSPACES_API_BASE_URL is not set",
        _source: "http",
      };
    }

    const loc =
      intent?.location?.lat != null
        ? { lat: intent.location.lat, lng: intent.location.lng }
        : intent?.userLocation?.lat != null
        ? { lat: intent.userLocation.lat, lng: intent.userLocation.lng }
        : { lat: 51.5074, lng: -0.1278 };

    const searchUrl = baseUrl.replace(/\/?$/, "") + "/mobile/profiles/search";
    const headers = {
      "Content-Type": "application/json",
      ...(baseConfig?.apiKey && { key: baseConfig.apiKey }),
      ...(sessionId && { "session-id": sessionId }),
    };
    const resolvedCategoryIds =
      Array.isArray(categoryIds) && categoryIds.length > 0
        ? categoryIds
        : Array.isArray(intent?.categoryIds) && intent.categoryIds.length > 0
        ? intent.categoryIds
        : [];

    const body = {
      page: 1,
      limit: fetchLimit,
      location: loc,
      ...(!skipCategories &&
        resolvedCategoryIds.length > 0 && { categoryIds: resolvedCategoryIds }),
    };

    try {
      let res = await axios.post(searchUrl, body, { headers, timeout: 15000 });
      let data = res.data?.data || [];
      let total = res.data?.pagination?.total ?? data.length;

      if (data.length === 0 && resolvedCategoryIds.length > 0) {
        logEvent("search.candidates.http.retry_without_categories", {
          categoryCount: resolvedCategoryIds.length,
        });
        const retryBody = { ...body };
        delete retryBody.categoryIds;
        res = await axios.post(searchUrl, retryBody, {
          headers,
          timeout: 15000,
        });
        data = res.data?.data || [];
        total = res.data?.pagination?.total ?? data.length;
      }

      const candidates = data.map(condenseHttpProfile);
      const fullCandidatesById = buildFullMap(data);
      logEvent("search.candidates.http.success", {
        fetched: candidates.length,
        total,
      });
      return {
        candidates,
        total,
        fullCandidatesById,
        _source: "http",
      };
    } catch (err) {
      logError("search.candidates.http.error", err, {
        status: err?.response?.status || null,
      });
      return {
        candidates: [],
        total: 0,
        fullCandidatesById: new Map(),
        error: "allspaces-backend request failed. Check session-id or network.",
        _source: "http",
      };
    }
  };
}
