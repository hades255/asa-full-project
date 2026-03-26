/**
 * Mock candidate source — static data for development.
 * No DB or API required.
 */

import { toFullProfile } from "../../search/index.js";

const MOCK_PROFILES = [
  {
    id: "mock-1",
    name: "Trattoria Roma",
    description:
      "Authentic Italian cuisine in SoHo. Family-run restaurant serving pasta, pizza, and regional dishes.",
    address: "123 Mulberry St, Manhattan, NY",
    lat: 40.723,
    lng: -73.995,
    averageRating: 4.7,
    totalReviews: 340,
    services: [{ id: "s1", name: "Dinner", minSpend: 45, category: "Dining" }],
    facilities: [
      { id: "f1", name: "Wi-Fi" },
      { id: "f2", name: "Outdoor seating" },
      { id: "f3", name: "Wheelchair accessible" },
    ],
  },
  {
    id: "mock-2",
    name: "Bella Cucina",
    description:
      "Upscale Italian dining in Midtown. Modern twist on classic recipes.",
    address: "456 5th Ave, Manhattan, NY",
    lat: 40.753,
    lng: -73.981,
    averageRating: 4.5,
    totalReviews: 210,
    services: [
      { id: "s2a", name: "Lunch", minSpend: 35, category: "Dining" },
      { id: "s2b", name: "Dinner", minSpend: 55, category: "Dining" },
    ],
    facilities: [
      { id: "f4", name: "Private dining" },
      { id: "f5", name: "Full bar" },
    ],
  },
  {
    id: "mock-3",
    name: "Cafe Italiano",
    description: "Cozy Italian cafe with fresh pastas and wood-fired pizzas.",
    address: "789 Greenwich St, Manhattan, NY",
    lat: 40.736,
    lng: -74.008,
    averageRating: 4.3,
    totalReviews: 180,
    services: [{ id: "s3", name: "Brunch", minSpend: 28, category: "Dining" }],
    facilities: [
      { id: "f6", name: "Wi-Fi" },
      { id: "f7", name: "Outdoor seating" },
    ],
  },
];

function buildFullMap(profiles) {
  const map = new Map();
  for (const p of profiles) {
    const full = toFullProfile(p);
    if (full?.id) map.set(full.id, full);
  }
  return map;
}

/**
 * Fetch mock candidates. Ignores intent (returns all mock profiles).
 */
export async function fetchMockCandidates(_intent, _options) {
  const fullCandidatesById = buildFullMap(MOCK_PROFILES);
  return {
    candidates: MOCK_PROFILES,
    total: MOCK_PROFILES.length,
    fullCandidatesById,
    _source: "mock",
    _mock: true,
  };
}
