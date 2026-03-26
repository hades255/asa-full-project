/**
 * Database candidate source — PostgreSQL via Prisma search module.
 * Requires DATABASE_URL.
 */

import { getPrisma } from "../../../lib/db.js";
import { config } from "../../../config/env.js";
import { searchCandidates, DEFAULT_RADIUS_DEG } from "../../search/index.js";

const SEARCH_LIMIT = config.search.candidateFetchLimit;

const EXPAND_RETRY_OPTIONS = [
  { radiusDeg: DEFAULT_RADIUS_DEG, ignoreCategories: false },
  { radiusDeg: DEFAULT_RADIUS_DEG * 2, ignoreCategories: false },
  { radiusDeg: DEFAULT_RADIUS_DEG * 4, ignoreCategories: false },
  { radiusDeg: DEFAULT_RADIUS_DEG * 6, ignoreCategories: false },
  { radiusDeg: DEFAULT_RADIUS_DEG * 4, ignoreCategories: true },
  { radiusDeg: DEFAULT_RADIUS_DEG * 6, ignoreCategories: true },
];

/**
 * Fetch candidates from DB with expand-on-empty retry.
 */
export async function fetchDbCandidates(intent, options = {}) {
  const fetchLimit = Math.max(
    20,
    parseInt(options?.fetchLimit, 10) || SEARCH_LIMIT
  );
  const prisma = getPrisma();
  if (!prisma) {
    return {
      candidates: [],
      total: 0,
      fullCandidatesById: new Map(),
      error: "DATABASE_URL is not set",
    };
  }

  try {
    let lastResult = { candidates: [], total: 0, fullProfilesById: new Map() };
    for (const { radiusDeg, ignoreCategories } of EXPAND_RETRY_OPTIONS) {
      const result = await searchCandidates(intent, {
        prisma,
        limit: fetchLimit,
        radiusDeg,
        ignoreCategories,
      });
      lastResult = result;
      if (result.candidates.length > 0) {
        console.log(
          `[DB] Search: fetched ${result.candidates.length} profiles from PostgreSQL`
        );
        return {
          candidates: result.candidates,
          total: result.total,
          fullCandidatesById: result.fullProfilesById,
          _source: "db",
        };
      }
    }
    console.log(
      "[DB] Search: 0 profiles from PostgreSQL (after expand retries)"
    );
    return {
      candidates: lastResult.candidates,
      total: lastResult.total,
      fullCandidatesById: lastResult.fullProfilesById,
      _source: "db",
    };
  } catch (err) {
    console.error("DB candidate fetch error:", err);
    return {
      candidates: [],
      total: 0,
      fullCandidatesById: new Map(),
      error: err.message || "Database search failed",
      _source: "db",
    };
  }
}
