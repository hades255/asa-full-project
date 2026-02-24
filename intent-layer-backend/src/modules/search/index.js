/**
 * Search Module — fetch and filter candidate spaces from DB.
 * Standalone module for easy integration into intent-layer-backend or allspaces-backend.
 *
 * Usage:
 *   import { searchCandidates } from "./modules/search/index.js";
 *   const { candidates, total, fullProfilesById } = await searchCandidates(intent, { prisma });
 */

import { filterCandidates, DEFAULT_RADIUS_DEG } from "./filterCandidates.js";
import { condenseProfile, toFullProfile } from "./condenseProfile.js";

export { DEFAULT_RADIUS_DEG } from "./filterCandidates.js";

const FULL_PROFILE_INCLUDE = {
  facilities: { select: { id: true, name: true } },
  services: {
    include: {
      category: { select: { id: true, title: true, type: true } },
    },
  },
};

/**
 * Fetch full profiles by IDs with facilities, services (with category).
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {string[]} ids - Profile IDs
 * @returns {Promise<Map<string, object>>} Map of id -> full profile (plain object)
 */
export async function getFullProfilesByIds(prisma, ids) {
  if (!ids || ids.length === 0) return new Map();
  const uniqueIds = [...new Set(ids)];
  const profiles = await prisma.profile.findMany({
    where: { id: { in: uniqueIds } },
    include: FULL_PROFILE_INCLUDE,
  });
  const map = new Map();
  for (const p of profiles) {
    map.set(p.id, toFullProfile(p));
  }
  return map;
}

/**
 * Search for candidate spaces from DB based on intent.
 *
 * @param {object} intent - SearchIntent { location?, userLocation?, categoryIds?, ... }
 * @param {object} options - { prisma, limit?, categoryIdMap?, radiusDeg?, ignoreCategories? }
 * @param {import('@prisma/client').PrismaClient} options.prisma - Prisma client (required when using DB)
 * @param {number} options.limit - Max candidates to return (default 20)
 * @param {Record<string,string>} options.categoryIdMap - Map semantic IDs (cat-dining-001) to DB UUIDs
 * @param {number} options.radiusDeg - Search radius in degrees (~0.1 ≈ 10km)
 * @param {boolean} options.ignoreCategories - Skip category filter for broader search
 * @returns {Promise<{ candidates: object[], total: number, fullProfilesById: Map<string,object> }>}
 */
export async function searchCandidates(intent, options = {}) {
  const { prisma, limit = 20, categoryIdMap, radiusDeg, ignoreCategories } = options;

  if (!prisma) {
    throw new Error("searchCandidates requires prisma client in options");
  }

  const rawProfiles = await filterCandidates(prisma, intent, {
    limit,
    categoryIdMap,
    radiusDeg,
    ignoreCategories,
  });
  const candidates = rawProfiles.map(condenseProfile);
  const fullProfilesById = new Map();
  for (const p of rawProfiles) {
    fullProfilesById.set(p.id, toFullProfile(p));
  }

  return {
    candidates,
    total: candidates.length,
    fullProfilesById,
  };
}

export { filterCandidates } from "./filterCandidates.js";
export { condenseProfile, toFullProfile } from "./condenseProfile.js";
