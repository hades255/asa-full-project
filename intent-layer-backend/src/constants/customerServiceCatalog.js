/**
 * Canonical customer-facing service labels (AllSpaces catalog).
 * Intent JSON uses exact strings from this list in `serviceLabels`.
 */

export const CUSTOMER_SERVICE_LABELS = [
  "Workspace",
  "Dining Services",
  "Relax & Leisure",
  "Beach Club",
  "Sleep Facilities",
  "Travel",
  "Policies",
  "Special Offers",
  "Lobby Workspace",
  "Business Room",
  "Conference Room",
  "Board Room",
  "IT Facilities",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Coffee / Tea",
  "Spa",
  "Massage",
  "Gym",
  "Swimming",
  "Yoga",
  "Pilates",
  "Classes",
  "Beach Bed",
  "Dining Options",
  "Champagne",
  "Room (Full Day)",
  "Half Day",
  "Hourly (min. 4 hrs)",
  "Uber",
  "Taxi",
  "Bike",
  "Flight",
  "Non-Smoking",
  "Smoking",
  "Free Coffee",
  "Complimentary Champagne",
  "Service Discounts",
];

/** @type {Map<string, string>} lowercase label → canonical */
const CANONICAL_BY_LOWER = new Map(
  CUSTOMER_SERVICE_LABELS.map((label) => [label.toLowerCase(), label])
);

/**
 * Map each catalog label to Prisma CategoryType for DB filtering when categoryType is unset.
 */
export const SERVICE_LABEL_TO_CATEGORY_TYPE = {
  Workspace: "WORKSPACE",
  "Dining Services": "DINING",
  "Relax & Leisure": "RELAXATION",
  "Beach Club": "BEACH_CLUB",
  "Sleep Facilities": "SLEEP",
  Travel: "TRAVEL",
  Policies: "POLICIES",
  "Special Offers": "SPECIAL_OFFERS",
  "Lobby Workspace": "WORKSPACE",
  "Business Room": "WORKSPACE",
  "Conference Room": "WORKSPACE",
  "Board Room": "WORKSPACE",
  "IT Facilities": "WORKSPACE",
  Breakfast: "DINING",
  Lunch: "DINING",
  Dinner: "DINING",
  "Coffee / Tea": "DINING",
  Spa: "RELAXATION",
  Massage: "RELAXATION",
  Gym: "RELAXATION",
  Swimming: "RELAXATION",
  Yoga: "RELAXATION",
  Pilates: "RELAXATION",
  Classes: "RELAXATION",
  "Beach Bed": "BEACH_CLUB",
  "Dining Options": "DINING",
  Champagne: "DINING",
  "Room (Full Day)": "SLEEP",
  "Half Day": "WORKSPACE",
  "Hourly (min. 4 hrs)": "WORKSPACE",
  Uber: "TRAVEL",
  Taxi: "TRAVEL",
  Bike: "TRAVEL",
  Flight: "TRAVEL",
  "Non-Smoking": "POLICIES",
  Smoking: "POLICIES",
  "Free Coffee": "SPECIAL_OFFERS",
  "Complimentary Champagne": "SPECIAL_OFFERS",
  "Service Discounts": "SPECIAL_OFFERS",
};

/**
 * Normalize LLM/client strings to canonical catalog labels (case/spacing tolerant).
 * @param {unknown[]} input
 * @returns {string[]}
 */
export function normalizeServiceLabels(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  const seen = new Set();
  for (const x of input) {
    const s = String(x).trim();
    if (!s) continue;
    const canon = CANONICAL_BY_LOWER.get(s.toLowerCase());
    if (canon && !seen.has(canon)) {
      seen.add(canon);
      out.push(canon);
    }
  }
  return out;
}

/**
 * First matching CategoryType from ordered service labels (for DB category resolution).
 * @param {string[]} canonicalLabels
 * @returns {string|null}
 */
export function inferCategoryTypeFromServiceLabels(canonicalLabels) {
  if (!canonicalLabels?.length) return null;
  for (const label of canonicalLabels) {
    const t = SERVICE_LABEL_TO_CATEGORY_TYPE[label];
    if (t) return t;
  }
  return null;
}
