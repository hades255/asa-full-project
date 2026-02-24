import express from "express";

import authMiddleware from "../middlewares/AuthMiddleware.js";
import { globalSearch } from "../controllers/SearchController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Global search across multiple tables
 */

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Perform a global search
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Search results from different tables
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, globalSearch);

export default router;
