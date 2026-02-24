import express from "express";
import { parseIntent } from "../controllers/intentController.js";
import { searchByIntent, searchByPrompt } from "../controllers/searchController.js";

const router = express.Router();

/**
 * POST /api/intent/parse
 * Parse natural-language prompt → structured SearchIntent.
 * See docs/intent-layer/endpoint-design.md and openapi-intent.yaml.
 */
router.post("/parse", parseIntent);

/**
 * POST /api/intent/search
 * Input: { intent } — JSON from intent layer.
 * Optional: { sessionId, categoryIds }.
 * Output: ranked recommendations with scores and reasons.
 */
router.post("/search", searchByIntent);

/**
 * POST /api/intent/search-by-prompt
 * Input: { prompt, context?, sessionId? }
 * Does: parse → fetch candidates → LLM rank.
 * Output: intent + repair + ranked recommendations.
 */
router.post("/search-by-prompt", searchByPrompt);

export default router;
