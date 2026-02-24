/**
 * Validate and repair extracted intent to conform to SearchIntent schema.
 * Returns { intent, repair: { applied, changes } }.
 */

export function validateAndRepair(raw) {
  const changes = [];

  const intent = {
    date: String(raw.date || new Date().toISOString()).slice(0, 24),
    duration: Math.max(1, parseInt(raw.duration, 10) || 1),
    noOfGuests: Math.max(0, parseInt(raw.noOfGuests, 10) || 0),
    location: (() => {
      const lat = raw.location?.lat != null ? Number(raw.location.lat) : null;
      const lng = raw.location?.lng != null ? Number(raw.location.lng) : null;
      const loc = { address: String(raw.location?.address || "Unknown") };
      if (lat != null && lng != null && !(lat === 0 && lng === 0)) {
        loc.lat = lat;
        loc.lng = lng;
      }
      return loc;
    })(),
    categoryIds: Array.isArray(raw.categoryIds) ? raw.categoryIds : [],
    rawQuery: String(raw.rawQuery || ""),
    confidence: typeof raw.confidence === "number" ? Math.max(0, Math.min(1, raw.confidence)) : 0,
    inferredDescription:
      typeof raw.inferredDescription === "string" && raw.inferredDescription.trim().length > 0
        ? raw.inferredDescription.trim()
        : undefined,
  };

  // Reject LLM placeholder values (e.g. literal "string", "number")
  const placeholderWords = ["string", "number", "null", "undefined", "unknown"];
  const addr = String(intent.location?.address || "").trim().toLowerCase();
  if (placeholderWords.includes(addr) || addr.length < 2) {
    intent.location.address = "Not specified";
    delete intent.location.lat;
    delete intent.location.lng;
    changes.push("location address was placeholder or empty");
  }

  // Ensure date looks like ISO and is not in the past
  const now = new Date();
  if (!intent.date.match(/^\d{4}-\d{2}-\d{2}/)) {
    intent.date = now.toISOString().slice(0, 24);
    changes.push("date repaired to current time (invalid format)");
  } else if (new Date(intent.date) < now) {
    intent.date = now.toISOString().slice(0, 24);
    changes.push("date repaired to current time (was in the past)");
  }

  if (changes.length > 0) {
    return {
      intent,
      repair: { applied: true, changes },
    };
  }

  return {
    intent,
    repair: { applied: false, changes: [] },
  };
}
