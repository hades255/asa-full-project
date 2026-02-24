/**
 * Filter profiles from DB by intent (location, category, status).
 * Uses Prisma for SQL filtering.
 */

export const DEFAULT_RADIUS_DEG = 0.1; // ~10km
const DEFAULT_LOCATION = { lat: 51.5074, lng: -0.1278 };

/**
 * Semantic category IDs from intent layer → DB category type.
 * Used when categoryIdMap is not provided.
 */
const SEMANTIC_TO_TYPE = {
  "cat-dining-001": "DINING",
  "cat-meeting-002": "WORKSPACE",
  "cat-sleep-001": "SLEEP",
  "cat-relaxation-001": "RELAXATION",
};

function getSearchLocation(intent) {
  const loc = intent?.location;
  const userLoc = intent?.userLocation;
  if (loc?.lat != null && loc?.lng != null && (loc.lat !== 0 || loc.lng !== 0)) {
    return { lat: Number(loc.lat), lng: Number(loc.lng) };
  }
  if (userLoc?.lat != null && userLoc?.lng != null && (userLoc.lat !== 0 || userLoc.lng !== 0)) {
    return { lat: Number(userLoc.lat), lng: Number(userLoc.lng) };
  }
  return DEFAULT_LOCATION;
}

/**
 * Resolve categoryIds from intent to DB UUIDs.
 * If categoryIdMap provided, use it. Else map semantic IDs to types and find matching categories.
 */
async function resolveCategoryIds(prisma, intentCategoryIds, categoryIdMap) {
  if (!intentCategoryIds || intentCategoryIds.length === 0) return [];

  if (categoryIdMap && typeof categoryIdMap === "object") {
    return intentCategoryIds
      .map((id) => categoryIdMap[id])
      .filter(Boolean);
  }

  const types = intentCategoryIds
    .map((id) => SEMANTIC_TO_TYPE[id])
    .filter(Boolean);

  if (types.length === 0) return [];

  const cats = await prisma.category.findMany({
    where: { type: { in: types }, isActive: true },
    select: { id: true },
  });
  return cats.map((c) => c.id);
}

/**
 * Filter profiles from DB by intent.
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {object} intent
 * @param {object} opts - { limit, categoryIdMap, radiusDeg?, ignoreCategories? }
 * @param {number} opts.radiusDeg - Search radius in degrees (~0.1 ≈ 10km). Default DEFAULT_RADIUS_DEG.
 * @param {boolean} opts.ignoreCategories - If true, skip category filter (broader search).
 */
export async function filterCandidates(prisma, intent, opts = {}) {
  const { limit = 20, categoryIdMap, radiusDeg = DEFAULT_RADIUS_DEG, ignoreCategories = false } = opts;
  const location = getSearchLocation(intent);
  const categoryIds = ignoreCategories
    ? []
    : await resolveCategoryIds(prisma, intent?.categoryIds, categoryIdMap);

  const lat = location.lat;
  const lng = location.lng;
  const latMin = lat - radiusDeg;
  const latMax = lat + radiusDeg;
  const lngMin = lng - radiusDeg;
  const lngMax = lng + radiusDeg;

  const where = {
    status: "PUBLISHED",
    lat: { not: null, gte: latMin, lte: latMax },
    lng: { not: null, gte: lngMin, lte: lngMax },
  };

  if (categoryIds.length > 0) {
    where.services = {
      some: {
        categoryId: { in: categoryIds },
      },
    };
  }

  const profiles = await prisma.profile.findMany({
    where,
    include: {
      facilities: { select: { id: true, name: true } },
      services: {
        include: {
          category: { select: { id: true, title: true, type: true } },
        },
      },
    },
    take: limit,
    orderBy: [{ averageRating: "desc" }, { totalReviews: "desc" }],
  });

  return profiles;
}
