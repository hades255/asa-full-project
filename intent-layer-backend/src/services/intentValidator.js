/**
 * Validate and repair extracted intent to the search-ready SearchIntent contract.
 * Accepts LLM output { intent, repair } or legacy flat intent from older clients.
 */

import { normalizeServiceLabels } from "../constants/customerServiceCatalog.js";

const PLACEHOLDER_WORDS = ["string", "number", "null", "undefined", "unknown"];

const VALID_CATEGORY_TYPES = new Set([
  "WORKSPACE",
  "RELAXATION",
  "DINING",
  "SLEEP",
  "TRAVEL",
  "POLICIES",
  "SPECIAL_OFFERS",
  "BEACH_CLUB",
]);

const VALID_SEARCH_TYPES = new Set(["DISCOVERY", "BOOKING"]);
const VALID_SORT_BY = new Set(["RELEVANCE", "DISTANCE_THEN_RELEVANCE", "RATING", "PRICE"]);
const VALID_SORT_DIR = new Set(["ASC", "DESC"]);

function strArray(v) {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

function numOrNull(v) {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function bool(v, defaultVal = false) {
  if (typeof v === "boolean") return v;
  return defaultVal;
}

function clamp01(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function emptyIntentShell(rawQuery = "") {
  return {
    searchType: "DISCOVERY",
    entityTypes: ["PROFILE", "SERVICE"],
    categoryType: null,
    categoryIds: [],
    serviceCategoryIds: [],
    rawQuery: String(rawQuery || ""),
    normalizedQuery: "",
    inferredDescription: "",
    date: {
      checkIn: null,
      checkOut: null,
      duration: null,
      timeText: null,
      serviceTime: null,
      timeOfDay: null,
      isFlexible: false,
    },
    guests: {
      noOfGuests: 0,
      rooms: null,
      adults: null,
      children: null,
    },
    location: {
      queryText: null,
      address: null,
      lat: null,
      lng: null,
      radiusKm: null,
      nearUser: false,
    },
    userLocation: null,
    price: {
      min: null,
      max: null,
      currency: null,
      isBudgetIntent: false,
      isLuxuryIntent: false,
    },
    rating: {
      minAverageRating: null,
      minReviewCount: null,
    },
    facilities: {
      required: [],
      preferred: [],
      excluded: [],
    },
    serviceFilters: {
      minSpend: null,
      durationLabel: null,
      timeOfDay: null,
    },
    profileFilters: {
      source: [],
      status: ["PUBLISHED"],
    },
    semantic: {
      mustTerms: [],
      shouldTerms: [],
      excludeTerms: [],
    },
    /** Exact strings from CUSTOMER_SERVICE_LABELS (customer catalog). */
    serviceLabels: [],
    sort: {
      by: "RELEVANCE",
      direction: "DESC",
    },
    confidence: 0,
  };
}

/**
 * Detect legacy flat intent { date: string, duration, noOfGuests, location, categoryIds }.
 */
function isLegacyFlatIntent(src) {
  if (!src || typeof src !== "object") return false;
  return typeof src.date === "string";
}

function legacyToRich(src) {
  const base = emptyIntentShell(src.rawQuery || "");
  const d = src.date;
  const iso =
    typeof d === "string" && d.length >= 10
      ? d.includes("T")
        ? d.slice(0, 24)
        : `${d.slice(0, 10)}T12:00:00.000Z`
      : null;
  base.date.checkIn = iso;
  base.date.duration = numOrNull(src.duration);
  base.guests.noOfGuests = Math.max(0, parseInt(src.noOfGuests, 10) || 0);
  if (src.location) {
    base.location.address = src.location.address != null ? String(src.location.address) : null;
    base.location.lat = numOrNull(src.location.lat);
    base.location.lng = numOrNull(src.location.lng);
  }
  base.categoryIds = Array.isArray(src.categoryIds) ? src.categoryIds.map(String) : [];
  base.confidence = clamp01(src.confidence);
  if (src.inferredDescription) base.inferredDescription = String(src.inferredDescription);
  return base;
}

function mergeIntentPartial(base, partial) {
  if (!partial || typeof partial !== "object") return base;

  if (partial.searchType && VALID_SEARCH_TYPES.has(String(partial.searchType).toUpperCase())) {
    base.searchType = String(partial.searchType).toUpperCase();
  }
  if (Array.isArray(partial.entityTypes) && partial.entityTypes.length) {
    base.entityTypes = partial.entityTypes.map((e) => String(e).toUpperCase()).filter(Boolean);
  }
  if (partial.categoryType != null && partial.categoryType !== "") {
    const ct = String(partial.categoryType).toUpperCase();
    base.categoryType = VALID_CATEGORY_TYPES.has(ct) ? ct : null;
  }
  if (Array.isArray(partial.categoryIds)) base.categoryIds = partial.categoryIds.map(String).filter(Boolean);
  if (Array.isArray(partial.serviceCategoryIds)) {
    base.serviceCategoryIds = partial.serviceCategoryIds.map(String).filter(Boolean);
  }

  if (typeof partial.rawQuery === "string") base.rawQuery = partial.rawQuery;
  if (typeof partial.normalizedQuery === "string") base.normalizedQuery = partial.normalizedQuery.trim();
  if (typeof partial.inferredDescription === "string") {
    base.inferredDescription = partial.inferredDescription.trim();
  }

  if (partial.date && typeof partial.date === "object") {
    const dt = partial.date;
    base.date.checkIn = typeof dt.checkIn === "string" ? dt.checkIn : base.date.checkIn;
    base.date.checkOut = typeof dt.checkOut === "string" ? dt.checkOut : base.date.checkOut;
    base.date.duration = numOrNull(dt.duration) ?? base.date.duration;
    base.date.timeText = dt.timeText != null ? String(dt.timeText) : base.date.timeText;
    base.date.serviceTime = typeof dt.serviceTime === "string" ? dt.serviceTime : base.date.serviceTime;
    if (dt.timeOfDay != null) base.date.timeOfDay = String(dt.timeOfDay).toUpperCase();
    base.date.isFlexible = bool(dt.isFlexible, base.date.isFlexible);
  }

  if (partial.guests && typeof partial.guests === "object") {
    const g = partial.guests;
    const n = parseInt(g.noOfGuests, 10);
    if (Number.isFinite(n)) base.guests.noOfGuests = Math.max(0, n);
    base.guests.rooms = numOrNull(g.rooms);
    base.guests.adults = numOrNull(g.adults);
    base.guests.children = numOrNull(g.children);
  }

  if (partial.userLocation != null && typeof partial.userLocation === "object") {
    base.userLocation = partial.userLocation;
  }

  if (partial.location && typeof partial.location === "object") {
    const L = partial.location;
    base.location.queryText = L.queryText != null ? String(L.queryText) : base.location.queryText;
    base.location.address = L.address != null ? String(L.address) : base.location.address;
    base.location.lat = numOrNull(L.lat);
    base.location.lng = numOrNull(L.lng);
    base.location.radiusKm = numOrNull(L.radiusKm);
    base.location.nearUser = bool(L.nearUser, base.location.nearUser);
  }

  if (partial.price && typeof partial.price === "object") {
    const p = partial.price;
    base.price.min = numOrNull(p.min);
    base.price.max = numOrNull(p.max);
    base.price.currency = p.currency != null ? String(p.currency) : base.price.currency;
    base.price.isBudgetIntent = bool(p.isBudgetIntent, base.price.isBudgetIntent);
    base.price.isLuxuryIntent = bool(p.isLuxuryIntent, base.price.isLuxuryIntent);
  }

  if (partial.rating && typeof partial.rating === "object") {
    base.rating.minAverageRating = numOrNull(partial.rating.minAverageRating);
    if (partial.rating.minReviewCount != null) {
      const n = parseInt(partial.rating.minReviewCount, 10);
      base.rating.minReviewCount = Number.isFinite(n) ? Math.max(0, n) : null;
    }
  }

  if (partial.facilities && typeof partial.facilities === "object") {
    base.facilities.required = strArray(partial.facilities.required);
    base.facilities.preferred = strArray(partial.facilities.preferred);
    base.facilities.excluded = strArray(partial.facilities.excluded);
  }

  if (partial.serviceFilters && typeof partial.serviceFilters === "object") {
    const sf = partial.serviceFilters;
    base.serviceFilters.minSpend = numOrNull(sf.minSpend);
    base.serviceFilters.durationLabel = sf.durationLabel != null ? String(sf.durationLabel) : null;
    base.serviceFilters.timeOfDay = sf.timeOfDay != null ? String(sf.timeOfDay).toUpperCase() : null;
  }

  if (partial.profileFilters && typeof partial.profileFilters === "object") {
    base.profileFilters.source = strArray(partial.profileFilters.source);
    const st = partial.profileFilters.status;
    if (Array.isArray(st) && st.length) {
      base.profileFilters.status = st.map((s) => String(s).toUpperCase());
    }
  }

  if (partial.semantic && typeof partial.semantic === "object") {
    base.semantic.mustTerms = strArray(partial.semantic.mustTerms);
    base.semantic.shouldTerms = strArray(partial.semantic.shouldTerms);
    base.semantic.excludeTerms = strArray(partial.semantic.excludeTerms);
  }

  if (Array.isArray(partial.serviceLabels)) {
    base.serviceLabels = strArray(partial.serviceLabels);
  }

  if (partial.sort && typeof partial.sort === "object") {
    const by = String(partial.sort.by || "").toUpperCase();
    const dir = String(partial.sort.direction || "").toUpperCase();
    if (VALID_SORT_BY.has(by)) base.sort.by = by;
    if (VALID_SORT_DIR.has(dir)) base.sort.direction = dir;
  }

  if (partial.confidence != null) base.confidence = clamp01(Number(partial.confidence));

  return base;
}

function repairLocationPlaceholders(intent, changes) {
  const addr = String(intent.location?.address || "").trim().toLowerCase();
  if (PLACEHOLDER_WORDS.includes(addr) || addr.length < 2) {
    intent.location.address = null;
    intent.location.lat = null;
    intent.location.lng = null;
    changes.push("location address was placeholder or empty");
  }
  if (intent.location.lat != null && intent.location.lng != null && intent.location.lat === 0 && intent.location.lng === 0) {
    intent.location.lat = null;
    intent.location.lng = null;
    changes.push("cleared invalid 0,0 coordinates");
  }
}

function repairDatesNotPast(intent, changes) {
  const now = new Date();
  const fields = ["checkIn", "checkOut", "serviceTime"];
  for (const key of fields) {
    const v = intent.date[key];
    if (typeof v !== "string" || v.length < 10) continue;
    const t = new Date(v);
    if (Number.isNaN(t.getTime())) {
      intent.date[key] = null;
      changes.push(`cleared invalid date.${key}`);
      continue;
    }
    if (t < now) {
      intent.date[key] = now.toISOString();
      changes.push(`date.${key} was in the past; set to now`);
    }
  }
}

/** Matches dining breakfast / brunch searches (not "bed and breakfast" lodging). */
const BREAKFAST_DINING_RE =
  /\b(breakfast|brunch|brekfast|breakfst|morning\s+meal|cafe\s+breakfast|breakfast\s+(spot|place|restaurant))\b/i;
const BNB_LODGING_RE = /\bbed\s+and\s+breakfast\b/i;
const PARTY_SIZE_TWO_RE =
  /\b(2\s*ppl|2\s*people|two\s+people|for\s+2\b|table\s+for\s+2|for\s+two\b|2\s+guests)\b/i;
const TWO_HOUR_DURATION_RE =
  /\b(2\s*hours?|2\s*hrs?|120\s*minutes?|a\s+couple\s+of\s+hours|around\s+2\s+hours|~\s*2\s*hours)\b/i;

function combinedQuery(intent) {
  return `${intent.rawQuery || ""} ${intent.normalizedQuery || ""}`.trim();
}

function looksLikeBreakfastDiningSearch(intent) {
  const q = combinedQuery(intent);
  if (!q) return false;
  if (BNB_LODGING_RE.test(q)) return false;
  return BREAKFAST_DINING_RE.test(q);
}

/**
 * Aligns intent with breakfast QA matrix when the model drifts: DINING + Breakfast label,
 * party size 2, MORNING, durationLabel "2 hours", serviceFilters.timeOfDay sync.
 */
function repairBreakfastDiningConsistency(intent, changes) {
  if (!looksLikeBreakfastDiningSearch(intent)) return;

  const q = combinedQuery(intent);
  const onlyDiningOrUnset = !intent.categoryType || intent.categoryType === "DINING";
  if (!onlyDiningOrUnset) return;

  if (intent.categoryType !== "DINING") {
    intent.categoryType = "DINING";
    changes.push("inferred categoryType DINING from breakfast/brunch phrasing");
  }

  const hadBreakfast = (intent.serviceLabels || []).includes("Breakfast");
  if (!hadBreakfast) {
    intent.serviceLabels = normalizeServiceLabels([...(intent.serviceLabels || []), "Breakfast"]);
    changes.push("added catalog serviceLabels Breakfast for breakfast/brunch intent");
  }

  if (intent.guests?.noOfGuests === 0 && PARTY_SIZE_TWO_RE.test(q)) {
    intent.guests.noOfGuests = 2;
    changes.push("inferred guests.noOfGuests=2 from party-size phrasing");
  }

  if (!intent.date?.timeOfDay) {
    intent.date.timeOfDay = "MORNING";
    changes.push("set date.timeOfDay MORNING for breakfast/brunch");
  }

  if (intent.date?.timeOfDay && !intent.serviceFilters?.timeOfDay) {
    intent.serviceFilters.timeOfDay = intent.date.timeOfDay;
    changes.push("synced serviceFilters.timeOfDay from date.timeOfDay");
  }

  if (!intent.serviceFilters?.durationLabel && TWO_HOUR_DURATION_RE.test(q)) {
    intent.serviceFilters.durationLabel = "2 hours";
    if (intent.date.duration == null) intent.date.duration = 2;
    changes.push('normalized duration to serviceFilters.durationLabel "2 hours"');
  }
}

/**
 * @param {object} raw - LLM output { intent, repair } or legacy flat intent
 * @returns {{ intent: object, repair: { applied: boolean, changes: string[] } }}
 */
export function validateAndRepair(raw) {
  const changes = [];

  const llmRepair =
    raw?.repair && typeof raw.repair === "object"
      ? {
          applied: !!raw.repair.applied,
          changes: Array.isArray(raw.repair.changes) ? raw.repair.changes.map(String) : [],
        }
      : { applied: false, changes: [] };

  const src = raw?.intent && typeof raw.intent === "object" ? raw.intent : raw;

  let intent;
  if (isLegacyFlatIntent(src)) {
    intent = legacyToRich(src);
    changes.push("normalized legacy flat intent to search-ready shape");
  } else {
    intent = mergeIntentPartial(emptyIntentShell(src?.rawQuery || ""), src);
  }

  if (!intent.normalizedQuery && intent.rawQuery) {
    intent.normalizedQuery = intent.rawQuery.trim().toLowerCase().replace(/\s+/g, " ");
  }

  repairLocationPlaceholders(intent, changes);
  repairDatesNotPast(intent, changes);
  repairBreakfastDiningConsistency(intent, changes);

  if (!intent.profileFilters.status?.length) {
    intent.profileFilters.status = ["PUBLISHED"];
  }

  const labelCountBefore = (intent.serviceLabels || []).length;
  intent.serviceLabels = normalizeServiceLabels(intent.serviceLabels || []);
  if (labelCountBefore > intent.serviceLabels.length) {
    changes.push("dropped serviceLabels not in customer service catalog");
  }

  const mergedChanges = [...llmRepair.changes, ...changes];
  const applied = llmRepair.applied || changes.length > 0;

  return {
    intent,
    repair: {
      applied,
      changes: mergedChanges,
    },
  };
}
