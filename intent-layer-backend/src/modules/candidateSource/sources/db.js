/**
 * Database candidate source — PostgreSQL via Prisma search module.
 * Requires DATABASE_URL.
 */

import { getPrisma } from "../../../lib/db.js";
import {
  searchCandidates,
  DEFAULT_RADIUS_DEG,
} from "../../search/index.js";

const SEARCH_LIMIT = 20;

const EXPAND_RETRY_OPTIONS = [
  { radiusDeg: DEFAULT_RADIUS_DEG, ignoreCategories: false },
  { radiusDeg: DEFAULT_RADIUS_DEG * 2, ignoreCategories: false },
  { radiusDeg: DEFAULT_RADIUS_DEG * 4, ignoreCategories: false },
  { radiusDeg: DEFAULT_RADIUS_DEG * 4, ignoreCategories: true },
];

/**
 * Fetch candidates from DB with expand-on-empty retry.
 */
export async function fetchDbCandidates(intent, options = {}) {
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
        limit: SEARCH_LIMIT,
        radiusDeg,
        ignoreCategories,
      });
      lastResult = result;
      if (result.candidates.length > 0) {
        return {
          candidates: result.candidates,
          total: result.total,
          fullCandidatesById: result.fullProfilesById,
          _source: "db",
        };
      }
    }
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
