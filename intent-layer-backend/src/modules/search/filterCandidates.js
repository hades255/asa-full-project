/**
 * Filter profiles from DB by search-ready intent (location, category, status, price, rating, facilities).
 */

import { inferCategoryTypeFromServiceLabels } from "../../constants/customerServiceCatalog.js";

export const DEFAULT_RADIUS_DEG = 0.1; // ~11 km when radiusKm not set

const DEFAULT_LOCATION = { lat: 51.5074, lng: -0.1278 };

/** Semantic category IDs from intent layer → DB category type. */
const SEMANTIC_TO_TYPE = {
  "cat-dining-001": "DINING",
  "cat-meeting-002": "WORKSPACE",
  "cat-sleep-001": "SLEEP",
  "cat-relaxation-001": "RELAXATION",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** ~km per degree latitude (approximation). */
function kmToDegLat(km) {
  return km / 111;
}

function getRadiusDeg(intent) {
  const km = intent?.location?.radiusKm;
  if (km != null && Number.isFinite(Number(km)) && Number(km) > 0) {
    return kmToDegLat(Number(km));
  }
  return DEFAULT_RADIUS_DEG;
}

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
 * Resolve category UUIDs: explicit categoryIds, semantic strings, or categoryType enum.
 */
async function resolveCategoryIds(prisma, intent, categoryIdMap) {
  const fromIntent = Array.isArray(intent?.categoryIds) ? intent.categoryIds : [];
  let effectiveType = intent?.categoryType ? String(intent.categoryType).toUpperCase() : null;
  if (!effectiveType && fromIntent.length === 0 && intent?.serviceLabels?.length) {
    effectiveType = inferCategoryTypeFromServiceLabels(intent.serviceLabels);
  }

  if (fromIntent.length === 0 && effectiveType) {
    const cats = await prisma.category.findMany({
      where: { type: effectiveType, isActive: true },
      select: { id: true },
    });
    return cats.map((c) => c.id);
  }

  if (fromIntent.length === 0) return [];

  if (categoryIdMap && typeof categoryIdMap === "object") {
    return fromIntent.map((id) => categoryIdMap[id]).filter(Boolean);
  }

  const uuidIds = fromIntent.filter((id) => UUID_REGEX.test(String(id)));
  if (uuidIds.length > 0) return uuidIds;

  const types = fromIntent.map((id) => SEMANTIC_TO_TYPE[id]).filter(Boolean);
  if (types.length === 0) return [];

  const cats = await prisma.category.findMany({
    where: { type: { in: types }, isActive: true },
    select: { id: true },
  });
  return cats.map((c) => c.id);
}

function profileStatusWhere(intent) {
  const statuses = intent?.profileFilters?.status;
  if (Array.isArray(statuses) && statuses.length > 0) {
    return { in: statuses };
  }
  return "PUBLISHED";
}

function buildPriceWhere(intent) {
  const min = intent?.price?.min;
  const max = intent?.price?.max;
  if (min == null && max == null) return null;
  const w = {};
  if (min != null && Number.isFinite(Number(min))) w.gte = Number(min);
  if (max != null && Number.isFinite(Number(max))) w.lte = Number(max);
  return Object.keys(w).length ? w : null;
}

function buildRatingWhere(intent) {
  const minR = intent?.rating?.minAverageRating;
  const minC = intent?.rating?.minReviewCount;
  const out = {};
  if (minR != null && Number.isFinite(Number(minR))) {
    out.averageRating = { gte: Number(minR) };
  }
  if (minC != null && Number.isFinite(Number(minC)) && Number(minC) > 0) {
    out.totalReviews = { gte: Math.floor(Number(minC)) };
  }
  return out;
}

function facilityAndClauses(required) {
  if (!required?.length) return [];
  return required.map((name) => ({
    facilities: {
      some: {
        name: { contains: String(name), mode: "insensitive" },
      },
    },
  }));
}

function getOrderBy(intent) {
  const dir = intent?.sort?.direction === "ASC" ? "asc" : "desc";
  const by = intent?.sort?.by;
  if (by === "PRICE") {
    return [{ price: dir }, { averageRating: "desc" }];
  }
  if (by === "RATING") {
    return [{ averageRating: dir }, { totalReviews: dir }];
  }
  return [{ averageRating: "desc" }, { totalReviews: "desc" }];
}

/**
 * Filter profiles from DB by intent.
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 * @param {object} intent - Search-ready intent
 * @param {object} opts - { limit, categoryIdMap, radiusDeg?, ignoreCategories? }
 */
export async function filterCandidates(prisma, intent, opts = {}) {
  const { limit = 20, categoryIdMap, radiusDeg: radiusDegOverride, ignoreCategories = false } = opts;
  const location = getSearchLocation(intent);
  const radiusDeg = radiusDegOverride ?? getRadiusDeg(intent);

  const categoryIds = ignoreCategories
    ? []
    : await resolveCategoryIds(prisma, intent, categoryIdMap);

  const lat = location.lat;
  const lng = location.lng;
  const latMin = lat - radiusDeg;
  const latMax = lat + radiusDeg;
  const lngMin = lng - radiusDeg;
  const lngMax = lng + radiusDeg;

  const andParts = [
    { status: profileStatusWhere(intent) },
    { lat: { not: null, gte: latMin, lte: latMax } },
    { lng: { not: null, gte: lngMin, lte: lngMax } },
  ];

  const priceWhere = buildPriceWhere(intent);
  if (priceWhere) andParts.push({ price: priceWhere });

  const ratingWhere = buildRatingWhere(intent);
  if (ratingWhere.averageRating) andParts.push({ averageRating: ratingWhere.averageRating });
  if (ratingWhere.totalReviews) andParts.push({ totalReviews: ratingWhere.totalReviews });

  andParts.push(...facilityAndClauses(intent?.facilities?.required));

  if (categoryIds.length > 0) {
    andParts.push({
      services: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
    });
  }

  const profiles = await prisma.profile.findMany({
    where: { AND: andParts },
    include: {
      facilities: { select: { id: true, name: true } },
      services: {
        include: {
          category: { select: { id: true, title: true, type: true } },
        },
      },
    },
    take: limit,
    orderBy: getOrderBy(intent),
  });

  return profiles;
}
