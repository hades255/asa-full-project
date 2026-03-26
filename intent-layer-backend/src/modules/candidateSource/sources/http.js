/**
 * HTTP candidate source — AllSpaces backend API.
 * Requires ALLSPACES_API_BASE_URL.
 */

import axios from "axios";
import { toFullProfile } from "../../search/index.js";

const SEARCH_LIMIT = 20;

function condenseHttpProfile(p) {
  const services = (p.services || []).map((s) => ({
    name: s.name || "",
    description: (s.description || "").slice(0, 80),
    minSpend: s.minSpend ?? 0,
    category: s.category?.title || s.category?.type || "",
  }));
  const facilities = (p.facilities || []).map((f) => (typeof f === "string" ? f : f.name || "")).filter(Boolean);
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
    const baseUrl = baseConfig?.apiBaseUrl?.trim();
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
      limit: SEARCH_LIMIT,
      location: loc,
      ...(!skipCategories && resolvedCategoryIds.length > 0 && { categoryIds: resolvedCategoryIds }),
    };

    try {
      let res = await axios.post(searchUrl, body, { headers, timeout: 15000 });
      let data = res.data?.data || [];
      let total = res.data?.pagination?.total ?? data.length;

      if (data.length === 0 && resolvedCategoryIds.length > 0) {
        const retryBody = { ...body };
        delete retryBody.categoryIds;
        res = await axios.post(searchUrl, retryBody, { headers, timeout: 15000 });
        data = res.data?.data || [];
        total = res.data?.pagination?.total ?? data.length;
      }

      const candidates = data.map(condenseHttpProfile);
      const fullCandidatesById = buildFullMap(data);
      return {
        candidates,
        total,
        fullCandidatesById,
        _source: "http",
      };
    } catch (err) {
      console.error("HTTP candidate fetch error:", err.response?.status, err.message);
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
