import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByProfile,
  getReviewById,
  createCustomerReview,
  getCustomerReviewsByVendor,
} from "../controllers/ReviewsController.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - userId
 *         - profileId
 *         - bookingId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         userId:
 *           type: string
 *           description: ID of the user who created the review
 *         profileId:
 *           type: string
 *           description: ID of the profile being reviewed
 *         bookingId:
 *           type: string
 *           description: ID of the booking associated with this review
 *         rating:
 *           type: integer
 *           minimum: 0
 *           maximum: 5
 *           description: Rating from 0-5 stars
 *         comment:
 *           type: string
 *           description: Review comment text
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Review creation timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management API
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - profileId
 *               - bookingId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user creating the review
 *               profileId:
 *                 type: string
 *                 description: ID of the profile being reviewed
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking associated with this review
 *               rating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Rating from 0-5 stars
 *               comment:
 *                 type: string
 *                 description: Review comment text
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - Missing required fields or review already exists
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, createReview);

/**
 * @swagger
 * /api/reviews/profile/{profileId}:
 *   get:
 *     summary: Get all reviews for a profile
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     responses:
 *       200:
 *         description: List of reviews for the profile
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       500:
 *         description: Server error
 */
router.get("/profile/:profileId", authMiddleware, getReviewsByProfile);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getReviewById);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 5
 *                 description: Updated rating from 0-5 stars
 *               comment:
 *                 type: string
 *                 description: Updated review comment text
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteReview);

/**
 * @swagger
 * /api/reviews/customer/create:
 *   post:
 *     summary: Vendor gives review/rating to customer (mobile user)
 *     description: Allows vendor to rate and review a customer based on a completed booking
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 description: ID of the booking to review
 *                 example: "clx123456789"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1-5 stars
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: Review comment about the customer
 *                 example: "Great customer, very professional and punctual"
 *     responses:
 *       201:
 *         description: Customer review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer review created successfully"
 *                 review:
 *                   type: object
 *                   properties:
 *                     bookingId:
 *                       type: string
 *                     customerId:
 *                       type: string
 *                     customerName:
 *                       type: string
 *                     rating:
 *                       type: integer
 *                     comment:
 *                       type: string
 *                     reviewedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad request - Missing required fields, invalid rating, or review already exists
 *       404:
 *         description: Booking not found or vendor doesn't have permission
 *       500:
 *         description: Server error
 */
router.post("/customer/create", authMiddleware, createCustomerReview);

/**
 * @swagger
 * /api/reviews/customer/my-reviews:
 *   get:
 *     summary: Get all customer reviews given by the vendor
 *     description: Retrieves all reviews that the authenticated vendor has given to customers
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of customer reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of customer reviews
 *                   example: 15
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookingId:
 *                         type: string
 *                       customerId:
 *                         type: string
 *                       customerName:
 *                         type: string
 *                       customerEmail:
 *                         type: string
 *                       profileName:
 *                         type: string
 *                       rating:
 *                         type: integer
 *                       comment:
 *                         type: string
 *                       reviewedAt:
 *                         type: string
 *                         format: date-time
 *                       checkIn:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Server error
 */
router.get("/customer/my-reviews", authMiddleware, getCustomerReviewsByVendor);

export default router;
