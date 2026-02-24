import express from "express";
import {
  getWishlists,
  createWishlist,
  deleteWishlist,
} from "../../controllers/mobile/WishlistsController.js";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";
import { generateReviewsAndRatings } from "../../controllers/mobile/ReviewsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile Reviews and Ratings APIs
 *   description: Wishlist APIs for mobile users
 */

/**
 * @swagger
 * /api/mobile/reviews:
 *   post:
 *     summary: Submit a review and rating for a profile
 *     tags: [Mobile Reviews and Ratings APIs]
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
 *               - bookingId
 *               - rating
 *             properties:
 *               profileId:
 *                 type: string
 *                 description: ID of the profile to be reviewed
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking related to this review
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating value between 1 and 5
 *               comment:
 *                 type: string
 *                 description: Optional comment for the review
 *     responses:
 *       201:
 *         description: Review and rating submitted successfully
 *       400:
 *         description: Bad request - Missing or invalid parameters
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       500:
 *         description: Server error
 */
router.post("/", authenticateUser, generateReviewsAndRatings);

export default router;
