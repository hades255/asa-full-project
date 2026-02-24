import express from "express";
import {
  getWishlists,
  createWishlist,
  deleteWishlist,
} from "../../controllers/mobile/WishlistsController.js";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile Wishlist APIs
 *   description: Wishlist APIs for mobile users
 */

/**
 * @swagger
 * /api/mobile/wishlists:
 *   get:
 *     summary: Get all wishlisted profiles for the logged-in user
 *     tags: [Mobile Wishlist APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: number
 *           format: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: number
 *           format: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of wishlists per page
 *     responses:
 *       200:
 *         description: List of wishlisted profiles with pagination
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
 *                         description: Wishlist entry ID
 *                       userId:
 *                         type: string
 *                         description: User ID
 *                       profileId:
 *                         type: string
 *                         description: Profile ID
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the profile was added to wishlist
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the wishlist entry was last updated
 *                       profile:
 *                         $ref: '#/components/schemas/Profile'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       description: Total number of wishlisted profiles
 *                     page:
 *                       type: number
 *                       description: Current page number
 *                     limit:
 *                       type: number
 *                       description: Number of wishlists per page
 *                     pages:
 *                       type: number
 *                       description: Total number of pages
 *       400:
 *         description: Bad request - Invalid pagination parameters
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       500:
 *         description: Server error
 */
router.get("/", authenticateUser, getWishlists);

/**
 * @swagger
 * /api/mobile/wishlists:
 *   post:
 *     summary: Add a profile to wishlist
 *     tags: [Mobile Wishlist APIs]
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
 *               - profileId
 *             properties:
 *               profileId:
 *                 type: string
 *                 description: ID of the profile to be wishlisted
 *     responses:
 *       201:
 *         description: Profile added to wishlist
 *       400:
 *         description: Bad request - Missing or invalid profile ID
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       500:
 *         description: Server error
 */
router.post("/", authenticateUser, createWishlist);

/**
 * @swagger
 * /api/mobile/wishlists/{profileId}:
 *   delete:
 *     summary: Remove a profile from wishlist
 *     tags: [Mobile Wishlist APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Clerk session ID for authentication
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the profile to be removed from wishlist
 *     responses:
 *       200:
 *         description: Profile removed from wishlist
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       404:
 *         description: Wishlist entry not found
 *       500:
 *         description: Server error
 */
router.delete("/:profileId", authenticateUser, deleteWishlist);

export default router;
