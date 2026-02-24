import { extractIntentWithLLM } from "../services/llmExtractor.js";
import { validateAndRepair } from "../services/intentValidator.js";
import { config } from "../config/env.js";

/**
 * POST /api/intent/parse
 * Parse natural-language prompt to structured SearchIntent.
 */
export async function parseIntent(req, res) {
  try {
    const { prompt, context } = req.body || {};
    console.log("prompt", prompt);
    console.log("context", context);

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return res.status(400).json({ message: "prompt is required" });
    }

    const trimmed = prompt.trim();

    if (!config.intent.extractionEnabled || !config.intent.openaiApiKey) {
      // Fallback: return minimal intent with defaults (no LLM)
      const raw = {
        date: new Date().toISOString(),
        duration: 1,
        noOfGuests: 1,
        location: { address: trimmed, lat: null, lng: null },
        categoryIds: [],
        rawQuery: trimmed,
        confidence: 0,
      };
      let { intent, repair } = validateAndRepair(raw);
      const loc = context?.lastLocation;
      const addr = String(loc?.address || "").trim().toLowerCase();
      intent.userLocation =
        loc?.address && addr.length >= 2 && !["string", "number", "null", "undefined"].includes(addr)
          ? {
              address: loc.address,
              ...(loc.lat != null && loc.lat !== 0 && { lat: Number(loc.lat) }),
              ...(loc.lng != null && loc.lng !== 0 && { lng: Number(loc.lng) }),
            }
          : null;
      return res.status(200).json({ intent, repair });
    }

    let raw;
    try {
      raw = await extractIntentWithLLM(trimmed, context);
    } catch (err) {
      console.error("Intent extraction error:", err);
      return res.status(422).json({
        message: "Could not extract intent",
        details: err.message || "LLM extraction failed",
      });
    }

    let { intent, repair } = validateAndRepair(raw);

    // Add userLocation from context only when it looks valid (not placeholder)
    const placeholders = ["string", "number", "null", "undefined"];
    const lastLoc = context?.lastLocation;
    const lastAddr = String(lastLoc?.address || "").trim().toLowerCase();
    const lastLocValid = lastLoc?.address && lastAddr.length >= 2 && !placeholders.includes(lastAddr);

    intent.userLocation = lastLocValid
      ? {
          address: lastLoc.address,
          ...(lastLoc.lat != null && lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
          ...(lastLoc.lng != null && lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
        }
      : null;

    // When target is vague or "Not specified", enrich location with userLocation for search
    if (lastLocValid && intent.location) {
      const addr = String(intent.location.address || "").trim();
      const needsEnrich =
        addr === "Not specified" ||
        addr.length < 2 ||
        placeholders.includes(addr.toLowerCase()) ||
        (addr.length < 25 && !addr.includes(",") && lastLoc.address.toLowerCase().includes(addr.toLowerCase()));
      if (needsEnrich) {
        intent.location = {
          address: lastLoc.address,
          ...(lastLoc.lat != null && lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
          ...(lastLoc.lng != null && lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
        };
        repair = {
          applied: true,
          changes: [...(repair.changes || []), "location enriched from user location (target was vague or missing)"],
        };
      }
    }

    return res.status(200).json({ intent, repair });
  } catch (err) {
    console.error("Parse intent error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
