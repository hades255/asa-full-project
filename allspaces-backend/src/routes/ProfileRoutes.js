import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import {
  createProfile,
  deleteProfile,
  searchAllProfiles,
  getProfileById,
  updateProfile,
  getSavedSearches,
  getSavedSearchById,
  executeSavedSearch,
  updateSavedSearch,
  deleteSavedSearch,
  getSearchSuggestions,
  getMyProfile,
  toggleProfileStatus,
} from "../controllers/ProfilesController.js";
import upload from "../middlewares/UploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - name
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         name:
 *           type: string
 *           description: Profile name
 *         description:
 *           type: string
 *           description: Profile description
 *         email:
 *           type: string
 *           description: Contact email for the profile
 *         location:
 *           type: string
 *           description: Physical location of the profile
 *         coverMedia:
 *           type: string
 *           description: S3 URL of the cover image or video
 *         source:
 *           type: string
 *           enum: [SPACE, ACCOR]
 *           description: Source of the profile
 *         status:
 *           type: string
 *           enum: [INACTIVE, PUBLISHED]
 *           description: Current status of the profile
 *         price:
 *           type: number
 *           description: Base price of the profile
 *         averageRating:
 *           type: number
 *           description: Average rating based on reviews
 *         userId:
 *           type: string
 *           description: ID of the user who owns this profile
 *         categoryId:
 *           type: string
 *           description: ID of the category this profile belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Profile creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Profile last update timestamp
 */

/**
 * @swagger
 * /api/profiles/search:
 *   post:
 *     summary: Search all profiles with advanced filters and pagination
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
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
 *                 description: Number of results per page
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of category IDs to filter by (filters profiles that have services in these categories)

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
 *                 enum: [createdAt, price, averageRating]
 *                 default: createdAt
 *                 description: Field to sort results by
 *               sortOrder:
 *                 type: string
 *                 enum: [asc, desc]
 *                 default: desc
 *                 description: Sort direction
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     default: 0
 *                     description: Latitude coordinate
 *                   lng:
 *                     type: number
 *                     default: 0
 *                     description: Longitude coordinate
 *                 description: Location coordinates for search (approximately 10km radius)
 *     responses:
 *       200:
 *         description: List of profiles with pagination and saved search reference
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       email:
 *                         type: string
 *                       location:
 *                         type: object
 *                         properties:
 *                           lat:
 *                             type: number
 *                             description: Latitude coordinate
 *                           lng:
 *                             type: number
 *                             description: Longitude coordinate
 *                       coverMedia:
 *                         type: string
 *                       averageRating:
 *                         type: number
 *                       totalReviews:
 *                         type: integer
 *                       rating:
 *                         type: object
 *                         properties:
 *                           oneStarCount:
 *                             type: integer
 *                           twoStarCount:
 *                             type: integer
 *                           threeStarCount:
 *                             type: integer
 *                           fourStarCount:
 *                             type: integer
 *                           fiveStarCount:
 *                             type: integer
 *                       facilities:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                       services:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                             description:
 *                               type: string
 *                             minSpend:
 *                               type: number
 *                             category:
 *                               type: object
 *                               nullable: true
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 title:
 *                                   type: string
 *                             media:
 *                               type: object
 *                               nullable: true
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                 url:
 *                                   type: string
 *                       reviews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             rating:
 *                               type: number
 *                             comment:
 *                               type: string
 *                       media:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             url:
 *                               type: string
 *                       isInWishlist:
 *                         type: boolean
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                 savedSearchId:
 *                   type: string
 *                   description: ID of the automatically saved search for future reference
 *       400:
 *         description: Bad request - Invalid parameters
 *       500:
 *         description: Server error
 */
router.post("/search", authMiddleware, searchAllProfiles);

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get profile for the authenticated user
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile associated with the authenticated user (or null if no profile exists)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - allOf:
 *                   - $ref: '#/components/schemas/Profile'
 *                   - type: object
 *                     properties:
 *                       isProfileCompleted:
 *                         type: boolean
 *                         description: Indicates if the profile is complete (has at least one facility and one vendor service)
 *                         example: true
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "You don't have a profile yet"
 *                     profile:
 *                       type: null
 *                     isProfileCompleted:
 *                       type: boolean
 *                       description: Always false when no profile exists
 *                       example: false
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error
 */
router.get("/me", authMiddleware, getMyProfile);

/**
 * @swagger
 * /api/profiles/toggle-status:
 *   post:
 *     summary: Toggle profile status between INACTIVE and PUBLISHED
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Toggles the profile status:
 *       - If profile is INACTIVE and complete (has facilities and vendor services), it will be PUBLISHED
 *       - If profile is PUBLISHED, it will be set to INACTIVE
 *       - Cannot publish incomplete profiles
 *     responses:
 *       200:
 *         description: Profile status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile published successfully"
 *                 profile:
 *                   allOf:
 *                   - $ref: '#/components/schemas/Profile'
 *                   - type: object
 *                     properties:
 *                       isProfileCompleted:
 *                         type: boolean
 *                         description: Indicates if the profile is complete
 *                         example: true
 *                 statusChanged:
 *                   type: object
 *                   properties:
 *                     from:
 *                       type: string
 *                       enum: [INACTIVE, PUBLISHED]
 *                       example: "INACTIVE"
 *                     to:
 *                       type: string
 *                       enum: [INACTIVE, PUBLISHED]
 *                       example: "PUBLISHED"
 *       400:
 *         description: Cannot publish incomplete profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot publish profile. Profile must be complete with at least one facility and one vendor service."
 *                 isProfileCompleted:
 *                   type: boolean
 *                   example: false
 *                 missingRequirements:
 *                   type: object
 *                   properties:
 *                     hasFacilities:
 *                       type: boolean
 *                       example: false
 *                     hasServices:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.post("/toggle-status", authMiddleware, toggleProfileStatus);

/**
 * @swagger
 * /api/profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: Profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getProfileById);

/**
 * @swagger
 * /api/profiles/basic_info:
 *   post:
 *     summary: Create a new profile with basic information
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - email
 *               - location
 *               - address
 *               - coverMedia
 *             properties:
 *               name:
 *                 type: string
 *                 description: Profile name
 *                 example: "My Workspace"
 *               description:
 *                 type: string
 *                 description: Profile description
 *                 example: "A modern coworking space in the heart of the city"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email for the profile
 *                 example: "contact@myworkspace.com"
 *               location:
 *                 type: object
 *                 description: Location coordinates of the profile
 *                 properties:
 *                   lat:
 *                     type: number
 *                     format: float
 *                     description: Latitude coordinate
 *                     example: 40.7128
 *                   lng:
 *                     type: number
 *                     format: float
 *                     description: Longitude coordinate
 *                     example: -74.0060
 *               address:
 *                 type: string
 *                 description: Human-readable address of the profile
 *                 example: "123 Main Street, New York, NY 10001"
 *               coverMedia:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images for the profile (.png, .jpg, .jpeg only). At least one image is required. The first image will be used as cover media.
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile created successfully"
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request - Invalid input or missing required fields
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Server error
 */
router.post(
  "/basic_info",
  authMiddleware,
  upload.array("coverMedia", 10),
  createProfile
);

/**
 * @swagger
 * /api/profiles/{id}:
 *   put:
 *     summary: Update profile with basic information
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - email
 *               - location
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 description: Profile name
 *                 example: "Updated Workspace"
 *               description:
 *                 type: string
 *                 description: Profile description
 *                 example: "An updated modern coworking space in the heart of the city"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email for the profile
 *                 example: "updated@myworkspace.com"
 *               location:
 *                 type: object
 *                 description: Location coordinates of the profile
 *                 properties:
 *                   lat:
 *                     type: number
 *                     format: float
 *                     description: Latitude coordinate
 *                     example: 40.7128
 *                   lng:
 *                     type: number
 *                     format: float
 *                     description: Longitude coordinate
 *                     example: -74.0060
 *               address:
 *                 type: string
 *                 description: Human-readable address of the profile
 *                 example: "456 New Street, New York, NY 10002"
 *               coverMedia:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Images for the profile (.png, .jpg, .jpeg only). The first image will be used as cover media. If not provided, existing media will be kept.
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *                 mediaCount:
 *                   type: integer
 *                   description: Number of media files uploaded
 *       400:
 *         description: Bad request - Invalid input or missing required fields
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  authMiddleware,
  upload.array("coverMedia", 10),
  updateProfile
);

/**
 * @swagger
 * /api/profiles/{id}:
 *   delete:
 *     summary: Delete profile
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 */
router.delete("/:id", authMiddleware, deleteProfile);

/**
 * @swagger
 * /api/profiles/saved-searches:
 *   get:
 *     summary: Get all saved searches for the authenticated user
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved searches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   filters:
 *                     type: object
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get("/saved-searches", authMiddleware, getSavedSearches);

/**
 * @swagger
 * /api/profiles/saved-searches/{id}:
 *   get:
 *     summary: Get a saved search by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saved search ID
 *     responses:
 *       200:
 *         description: Saved search details
 *       404:
 *         description: Saved search not found
 *       500:
 *         description: Server error
 */
router.get("/saved-searches/:id", authMiddleware, getSavedSearchById);

/**
 * @swagger
 * /api/profiles/saved-searches/{id}/execute:
 *   get:
 *     summary: Execute a saved search by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saved search ID
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Profile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       404:
 *         description: Saved search not found
 *       500:
 *         description: Server error
 */
router.get("/saved-searches/:id/execute", authMiddleware, executeSavedSearch);

/**
 * @swagger
 * /api/profiles/saved-searches/{id}:
 *   put:
 *     summary: Update a saved search
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saved search ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the saved search
 *               filters:
 *                 type: object
 *                 description: Search filters
 *     responses:
 *       200:
 *         description: Saved search updated successfully
 *       404:
 *         description: Saved search not found
 *       500:
 *         description: Server error
 */
router.put("/saved-searches/:id", authMiddleware, updateSavedSearch);

/**
 * @swagger
 * /api/profiles/saved-searches/{id}:
 *   delete:
 *     summary: Delete a saved search
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Saved search ID
 *     responses:
 *       200:
 *         description: Saved search deleted successfully
 *       404:
 *         description: Saved search not found
 *       500:
 *         description: Server error
 */
router.delete("/saved-searches/:id", authMiddleware, deleteSavedSearch);

/**
 * @swagger
 * /api/profiles/search/suggestions:
 *   get:
 *     summary: Get auto-suggestions for search
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query (minimum 2 characters)
 *     responses:
 *       200:
 *         description: Search suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [profile, service, facility, common]
 *                       category:
 *                         type: string
 *                 categories:
 *                   type: object
 *                   properties:
 *                     profiles:
 *                       type: array
 *                     services:
 *                       type: array
 *                     facilities:
 *                       type: array
 *                     common:
 *                       type: array
 *       500:
 *         description: Server error
 */
router.get("/search/suggestions", authMiddleware, getSearchSuggestions);

export default router;
