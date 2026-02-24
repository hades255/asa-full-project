import express from "express";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";
import {
  getAllPreferences,
  getMyPreferences,
  associateUserPreferences,
  getPreferredCategories,
  createUserPreference,
  // New user preference methods
  getUserPreferences,
  createUserPreferences,
  updateUserPreferences,
  getAllAvailablePreferences,
} from "../../controllers/mobile/UserPreferencesController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile User Preferences APIs
 *   description: APIs for mobile user Preferences
 */

/**
 * @swagger
 * /api/mobile/preferences/user-preferences:
 *   get:
 *     summary: Fetch current user's preferences (new preference system)
 *     tags: [Mobile User Preferences APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     preferences:
 *                       type: object
 *                     count:
 *                       type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/user-preferences", authenticateUser, getUserPreferences);

/**
 * @swagger
 * /api/mobile/preferences/user-preferences:
 *   post:
 *     summary: Create user preferences (new preference system)
 *     tags: [Mobile User Preferences APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferenceIds
 *             properties:
 *               preferenceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of preference IDs to add (user can have multiple preferences)
 *     responses:
 *       201:
 *         description: User preferences created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     added:
 *                       type: integer
 *                       description: Number of new preferences added
 *                     alreadyExisted:
 *                       type: integer
 *                       description: Number of preferences that already existed
 *                     total:
 *                       type: integer
 *                       description: Total number of preferences for this user
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: Array of all user preferences with details
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Some preferences not found
 *       500:
 *         description: Server error
 */
router.post("/user-preferences", authenticateUser, createUserPreferences);

/**
 * @swagger
 * /api/mobile/preferences/user-preferences:
 *   put:
 *     summary: Update user preferences (new preference system)
 *     tags: [Mobile User Preferences APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - preferenceIds
 *             properties:
 *               preferenceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of preference IDs to set (replaces all existing preferences)
 *     responses:
 *       200:
 *         description: User preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     removed:
 *                       type: integer
 *                       description: Number of preferences removed
 *                     added:
 *                       type: integer
 *                       description: Number of new preferences added
 *                     total:
 *                       type: integer
 *                       description: Total number of preferences after update
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: object
 *                       description: Array of all user preferences with details
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Some preferences not found
 *       500:
 *         description: Server error
 */
router.put("/user-preferences", authenticateUser, updateUserPreferences);

/**
 * @swagger
 * /api/mobile/preferences/all:
 *   get:
 *     summary: Fetch all available preferences (hierarchical structure)
 *     tags: [Mobile User Preferences APIs]
 *     responses:
 *       200:
 *         description: All preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     preferences:
 *                       type: object
 *                       description: Grouped preferences by main categories
 *                     count:
 *                       type: integer
 *                       description: Total number of preferences
 *                     mainCategories:
 *                       type: integer
 *                       description: Number of main preference categories
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.get("/all", getAllAvailablePreferences);

/**
 * @swagger
 * /api/mobile/preferences/my-preferences:
 *   get:
 *     summary: Fetch current user's preferences
 *     tags: [Mobile User Preferences APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: User preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 preferences:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/my-preferences", authenticateUser, getMyPreferences);

/**
 * @swagger
 * /api/mobile/preferences:
 *   get:
 *     summary: Fetch all categories with preferences
 *     tags: [Mobile User Preferences APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: All categories with preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticateUser, getAllPreferences);

/**
 * @swagger
 * /api/mobile/preferences/preferred-categories:
 *   get:
 *     summary: Fetch user's preferred categories
 *     tags: [Mobile User Preferences APIs, Categories]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: User's preferred categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/preferred-categories", authenticateUser, getPreferredCategories);

/**
 * @swagger
 * /api/mobile/preferences:
 *   put:
 *     summary: Update category preferences for a user
 *     tags: [Mobile User Preferences APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of category IDs to associate with user
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     mainCategories:
 *                       type: integer
 *                     subcategories:
 *                       type: integer
 *                     added:
 *                       type: integer
 *                     removed:
 *                       type: integer
 *                 preferences:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Some categories not found
 *       500:
 *         description: Server error
 */
router.put("/", authenticateUser, associateUserPreferences);

/**
 * @swagger
 * /api/mobile/preferences:
 *   post:
 *     summary: Create user preferences for multiple categories
 *     tags: [Mobile User Preferences APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryIds
 *             properties:
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of category IDs to add as preferences
 *     responses:
 *       201:
 *         description: Preferences created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     added:
 *                       type: integer
 *                     alreadyExisted:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 preferences:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Some categories not found
 *       500:
 *         description: Failed to create preferences
 */
router.post("/", authenticateUser, createUserPreference);

export default router;
