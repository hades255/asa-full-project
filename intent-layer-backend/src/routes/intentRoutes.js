import express from "express";
import { parseIntent } from "../controllers/intentController.js";
import { searchByIntent, searchByPrompt, searchWithFilters } from "../controllers/searchController.js";
import { getCategories } from "../controllers/categoriesController.js";

const router = express.Router();

/**
 * GET /api/intent/categories
 * Returns categories with subcategories for filter UI.
 */
router.get("/categories", getCategories);

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

/**
 * POST /api/intent/search-with-filters
 * Input: { filters: { date?, duration?, noOfGuests?, location?, categoryIds? }, lastLocation?, sessionId? }
 * Manual filters, no LLM. Output: intent + ranked recommendations.
 */
router.post("/search-with-filters", searchWithFilters);

export default router;
