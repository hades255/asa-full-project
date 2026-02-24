import express from "express";
import {
  createCustomerFromClerk,
  getCurrentUserForMobile,
  createVendorAccount,
} from "../../controllers/mobile/UsersController.js";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile Users APIs
 *   description: APIs for mobile users
 */

/**
 * @swagger
 * /api/mobile/users/me:
 *   get:
 *     summary: Get current authenticated user details for mobile app
 *     tags: [Mobile Users APIs]
 *     security:
 *       - SessionAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID from Clerk
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 first_name:
 *                   type: string
 *                   example: "John"
 *                 last_name:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 phone:
 *                   type: string
 *                   example: "+1234567890"
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["USER"]
 *                 status:
 *                   type: string
 *                   example: "ACTIVE"
 *                 clerk_user_id:
 *                   type: string
 *                   example: "user_2abc123def456"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 confirmed_at:
 *                   type: string
 *                   format: date-time
 *                 averageRating:
 *                   type: number
 *                   format: float
 *                   example: 4.5
 *                 totalReviews:
 *                   type: number
 *                   example: 12
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       rating:
 *                         type: number
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: "Great experience!"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized - Invalid session ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/me", authenticateUser, getCurrentUserForMobile);

/**
 * @swagger
 * /api/mobile/users/vendor:
 *   post:
 *     summary: Create a vendor user
 *     tags: [Mobile Users APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Vendor email address
 *     responses:
 *       201:
 *         description: Vendor account created and invitation email sent
 *       400:
 *         description: Missing or invalid email
 *       409:
 *         description: User already exists for the provided email
 *       500:
 *         description: Server error
 */
router.post("/vendor", createVendorAccount);

/**
 * @swagger
 * /api/mobile/users:
 *   post:
 *     summary: Create a User against clerk ID
 *     tags: [Mobile Users APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clerk_user_id
 *             properties:
 *               clerk_user_id:
 *                 type: string
 *                 description: Clerk User ID
 *     responses:
 *       500:
 *         description: Server error
 */
router.post("/", createCustomerFromClerk);

export default router;
