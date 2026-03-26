import { extractIntentWithLLM } from "../services/llmExtractor.js";
import { validateAndRepair } from "../services/intentValidator.js";
import { config } from "../config/env.js";
import { logError, logEvent } from "../lib/eventLogger.js";

/**
 * POST /api/intent/parse
 * Parse natural-language prompt to structured SearchIntent.
 */
export async function parseIntent(req, res) {
  try {
    const { prompt, context } = req.body || {};
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    logEvent("intent.parse.request_received", {
      requestId,
      hasPrompt: !!prompt,
      hasContext: !!context,
    });

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      logEvent("intent.parse.validation_failed", {
        requestId,
        reason: "missing_prompt",
      });
      return res.status(400).json({ message: "prompt is required" });
    }

    const trimmed = prompt.trim();

    if (!config.intent.extractionEnabled || !config.intent.openaiApiKey) {
      logEvent("intent.parse.llm_disabled_fallback", { requestId });
      let { intent, repair } = validateAndRepair({
        intent: {
          rawQuery: trimmed,
          normalizedQuery: trimmed.toLowerCase().replace(/\s+/g, " ").trim(),
          location: {
            queryText: null,
            address: trimmed.length >= 2 ? trimmed : null,
            lat: null,
            lng: null,
            radiusKm: null,
            nearUser: false,
          },
          guests: { noOfGuests: 1 },
          date: { checkIn: new Date().toISOString(), duration: 1 },
          confidence: 0,
        },
      });
      const loc = context?.lastLocation;
      const addr = String(loc?.address || "")
        .trim()
        .toLowerCase();
      intent.userLocation =
        loc?.address &&
        addr.length >= 2 &&
        !["string", "number", "null", "undefined"].includes(addr)
          ? {
              address: loc.address,
              ...(loc.lat != null && loc.lat !== 0 && { lat: Number(loc.lat) }),
              ...(loc.lng != null && loc.lng !== 0 && { lng: Number(loc.lng) }),
            }
          : null;
      logEvent("intent.parse.response_sent", {
        requestId,
        mode: "fallback",
        repairApplied: !!repair?.applied,
      });
      return res.status(200).json({ intent, repair });
    }

    let raw;
    try {
      logEvent("intent.parse.llm_extract_start", {
        requestId,
        model: config.intent.openaiModel,
      });
      raw = await extractIntentWithLLM(trimmed, context);
      logEvent("intent.parse.llm_extract_done", { requestId });
    } catch (err) {
      logError("intent.parse.llm_extract_failed", err, { requestId });
      return res.status(422).json({
        message: "Could not extract intent",
        details: err.message || "LLM extraction failed",
      });
    }

    let { intent, repair } = validateAndRepair(raw);

    // Add userLocation from context only when it looks valid (not placeholder)
    const placeholders = ["string", "number", "null", "undefined"];
    const lastLoc = context?.lastLocation;
    const lastAddr = String(lastLoc?.address || "")
      .trim()
      .toLowerCase();
    const lastLocValid =
      lastLoc?.address &&
      lastAddr.length >= 2 &&
      !placeholders.includes(lastAddr);

    intent.userLocation = lastLocValid
      ? {
          address: lastLoc.address,
          ...(lastLoc.lat != null &&
            lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
          ...(lastLoc.lng != null &&
            lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
        }
      : null;

    // When target is vague, nearUser, or missing coords, enrich location from device location
    if (lastLocValid && intent.location) {
      const addr = String(intent.location.address || "").trim();
      const needsEnrich =
        intent.location.nearUser === true ||
        addr.length < 2 ||
        placeholders.includes(addr.toLowerCase()) ||
        (addr.length < 25 &&
          !addr.includes(",") &&
          lastLoc.address.toLowerCase().includes(addr.toLowerCase()));
      if (needsEnrich) {
        intent.location = {
          address: lastLoc.address,
          ...(lastLoc.lat != null &&
            lastLoc.lat !== 0 && { lat: Number(lastLoc.lat) }),
          ...(lastLoc.lng != null &&
            lastLoc.lng !== 0 && { lng: Number(lastLoc.lng) }),
        };
        repair = {
          applied: true,
          changes: [
            ...(repair.changes || []),
            "location enriched from user location (target was vague or missing)",
          ],
        };
      }
    }

    logEvent("intent.parse.response_sent", {
      requestId,
      repairApplied: !!repair?.applied,
      repairChanges: repair?.changes?.length || 0,
    });
    return res.status(200).json({ intent, repair });
  } catch (err) {
    logError("intent.parse.unhandled_error", err);
    return res.status(500).json({ message: "Server error" });
  }
}
