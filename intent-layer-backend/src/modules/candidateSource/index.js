/**
 * Candidate Source Module — env-driven selection of mock, DB, or HTTP.
 *
 * CANDIDATE_SOURCE env:
 * - "mock" — static data (no dependencies)
 * - "db"   — PostgreSQL via Prisma (DATABASE_URL)
 * - "http" — AllSpaces backend API (ALLSPACES_API_BASE_URL)
 * - "auto" — db → http → mock fallback
 *
 * Usage:
 *   import { fetchCandidates } from "./modules/candidateSource/index.js";
 *   const result = await fetchCandidates(intent, { sessionId, categoryIds });
 */

import { config } from "../../config/env.js";
import { getPrisma } from "../../lib/db.js";
import { fetchMockCandidates } from "./sources/mock.js";
import { fetchDbCandidates } from "./sources/db.js";
import { createHttpSource } from "./sources/http.js";

const httpSource = createHttpSource(config.allspaces);

/**
 * Fetch candidates based on CANDIDATE_SOURCE env.
 *
 * @param {object} intent - SearchIntent { location?, userLocation?, categoryIds?, ... }
 * @param {object} options - { sessionId?, categoryIds? }
 * @returns {Promise<{ candidates: object[], total: number, fullCandidatesById: Map, error?: string, _source?: string }>}
 */
export async function fetchCandidates(intent, options = {}) {
  const source = config.candidateSource;

  if (source === "mock") {
    return fetchMockCandidates(intent, options);
  }

  if (source === "db") {
    return fetchDbCandidates(intent, options);
  }

  if (source === "http") {
    return httpSource(intent, options);
  }

  // auto: db → http → mock
  const prisma = getPrisma();
  if (prisma) {
    const result = await fetchDbCandidates(intent, options);
    if (!result.error && result.candidates.length > 0) {
      return result;
    }
    if (result.error) {
      console.warn("DB source failed, trying HTTP:", result.error);
    }
  }

  if (config.allspaces?.apiBaseUrl) {
    const result = await httpSource(intent, options);
    if (!result.error) {
      return result;
    }
    console.warn("HTTP source failed, falling back to mock:", result.error);
  }

  return fetchMockCandidates(intent, options);
}

export { fetchMockCandidates } from "./sources/mock.js";
export { fetchDbCandidates } from "./sources/db.js";
export { createHttpSource } from "./sources/http.js";
