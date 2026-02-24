import express from "express";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";
import {
  getCategories,
  getProfileById,
  getProfiles,
  getProfilesAgainstCategory,
  getProfilesFromAccor,
  getProfilesGroupedByCategories,
  getReviewsForProfile,
} from "../../controllers/mobile/ProfilesController.js";
import {
  searchAllProfiles,
  getAvailableFilters,
} from "../../controllers/ProfilesController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile Profiles APIs
 *   description: Profiles APIs for mobile users
 */

/**
 * @swagger
 * /api/mobile/profiles:
 *   get:
 *     summary: Get all profiles
 *     tags: [Mobile Profiles APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: List of profiles
 */
router.get("/", authenticateUser, getProfiles);

/**
 * @swagger
 * /api/mobile/profiles/accor_hotels:
 *   get:
 *     summary: Get all Accor hotels
 *     tags: [Mobile Profiles APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The search category to find profiles
 *     responses:
 *       200:
 *         description: List of Accor hotels
 */
router.get("/accor_hotels", authenticateUser, getProfilesFromAccor);

/**
 * @swagger
 * /api/mobile/profiles/search:
 *   post:
 *     summary: Search profiles with advanced filtering and pagination
 *     tags: [Mobile Profiles APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 default: 1
 *                 description: Page number for pagination
 *               limit:
 *                 type: integer
 *                 default: 10
 *                 description: Number of items per page
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of category IDs to filter by (filters profiles that have services in these categories)

 *               pricing:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     description: Minimum price filter
 *                   max:
 *                     type: number
 *                     description: Maximum price filter
 *                 description: Price range filter based on service minimum spend
 *               rating:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 5
 *                     default: 0
 *                     description: Minimum rating filter
 *                   max:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 5
 *                     default: 5
 *                     description: Maximum rating filter
 *                 description: Rating range filter based on profile average rating
 *               sort:
 *                 type: string
 *                 default: "createdAt"
 *                 description: Field to sort by
 *               sortOrder:
 *                 type: string
 *                 default: "desc"
 *                 enum: [asc, desc]
 *                 description: Sort order
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     default: 0
 *                   lng:
 *                     type: number
 *                     default: 0
 *                 description: Location coordinates for proximity search (approximately 10km radius)
 *     responses:
 *       200:
 *         description: List of profiles with pagination info
 *       400:
 *         description: Invalid pagination parameters
 *       500:
 *         description: Server error
 */
router.post("/search", authenticateUser, searchAllProfiles);

/**
 * @swagger
 * /api/mobile/profiles/filters:
 *   get:
 *     summary: Get all available filters for profile search
 *     tags: [Mobile Profiles APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: Available filters for profile search
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Available filters retrieved successfully"
 *                 filters:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           subcategories:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 title:
 *                                   type: string
 *                             description: Array of subcategories for this category
 *                       description: All parent categories with id, title and subcategories array
 *                     location:
 *                       type: object
 *                       properties:
 *                         lat:
 *                           type: number
 *                           default: 0
 *                         lng:
 *                           type: number
 *                           default: 0
 *                       description: Location coordinates (default values, will be set by frontend)
 *                     pricing:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: number
 *                           description: Minimum price from services
 *                         max:
 *                           type: number
 *                           description: Maximum price from services
 *                       description: Price range based on service minimum spend
 *                     rating:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: number
 *                           description: Minimum rating from profiles
 *                         max:
 *                           type: number
 *                           description: Maximum rating from profiles
 *                       description: Rating range based on profile average ratings
 *       500:
 *         description: Server error
 */
router.get("/filters", authenticateUser, getAvailableFilters);

/**
 * @swagger
 * /api/mobile/profiles/search_with_category:
 *   get:
 *     summary: Search profiles based on a category
 *     tags: [Mobile Profiles APIs]
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The search profile against a category
 *     responses:
 *       200:
 *         description: List of profiles matching the search category
 *       400:
 *         description: category is required for search
 *       500:
 *         description: Server error
 */
router.get(
  "/search_with_category",
  authenticateUser,
  getProfilesAgainstCategory
);

/**
 * @swagger
 * /api/mobile/profiles/grouped_by_categories:
 *   get:
 *     summary: Get all profiles grouped by categories
 *     tags: [Mobile Profiles APIs]
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: List of profiles grouped by categories
 *       500:
 *         description: Server error
 */
router.get(
  "/grouped_by_categories",
  authenticateUser,
  getProfilesGroupedByCategories
);

/**
 * @swagger
 * /api/mobile/profiles/categories:
 *   get:
 *     summary: Get all category used in profiles
 *     tags: [Mobile Profiles APIs, Categories]
 *     responses:
 *       200:
 *         description: List of category
 *       500:
 *         description: Server error
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /api/mobile/profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Mobile Profiles APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile details
 */
router.get("/:id", authenticateUser, getProfileById);

/**
 * @swagger
 * /api/mobile/profiles/{profile_id}/reviews:
 *   get:
 *     summary: Get reviews against a profile
 *     tags: [Mobile Profiles APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *       - in: path
 *         name: profile_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile details
 */
router.get("/:profile_id/reviews", authenticateUser, getReviewsForProfile);

export default router;
