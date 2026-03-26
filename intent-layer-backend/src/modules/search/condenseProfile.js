/**
 * Condense a Prisma profile (with relations) for LLM input.
 * Token-efficient format.
 */

/**
 * @param {object} profile - Prisma profile with facilities, services
 * @returns {object} Condensed profile for LLM
 */
export function condenseProfile(profile) {
  const services = (profile.services || []).map((s) => ({
    name: s.name || "",
    description: (s.description || "").slice(0, 80),
    minSpend: s.minSpend ?? 0,
    category:
      typeof s.category === "string"
        ? s.category
        : s.category?.title || s.category?.type || "",
  }));
  const facilities = (profile.facilities || [])
    .map((f) => f.name || "")
    .filter(Boolean);

  return {
    id: profile.id || "",
    name: profile.name || "",
    description: (profile.description || "").slice(0, 300),
    address: profile.address || "",
    location: {
      lat: profile.lat ?? 0,
      lng: profile.lng ?? 0,
    },
    averageRating: profile.averageRating ?? 0,
    totalReviews: profile.totalReviews ?? 0,
    services,
    facilities,
  };
}

/**
 * Convert profile (Prisma or HTTP/mock) to full serializable object with all related data.
 * @param {object} profile - Prisma profile with relations, or API/mock profile
 * @returns {object} Full profile for API response
 */
export function toFullProfile(profile) {
  if (!profile) return null;
  const services = (profile.services || []).map((s) => {
    const cat = s.category;
    const categoryObj =
      cat && typeof cat === "object"
        ? {
            id: cat.id ?? null,
            title: cat.title || cat.type || "",
            type: cat.type || "",
          }
        : cat
        ? { id: null, title: String(cat), type: "" }
        : null;
    return {
      id: s.id,
      name: s.name || "",
      description: s.description ?? null,
      minSpend: s.minSpend ?? 0,
      category: categoryObj,
    };
  });
  const facilities = (profile.facilities || []).map((f) => ({
    id: f.id ?? null,
    name: typeof f === "string" ? f : f.name || "",
  }));
  return {
    id: profile.id,
    name: profile.name || "",
    description: profile.description ?? null,
    address: profile.address ?? null,
    lat: profile.lat ?? null,
    lng: profile.lng ?? null,
    coverMedia: profile.coverMedia ?? null,
    price: profile.price ?? 0,
    averageRating: profile.averageRating ?? null,
    totalReviews: profile.totalReviews ?? null,
    facilities,
    services,
  };
}
