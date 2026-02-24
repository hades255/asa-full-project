import express from "express";

import {
  createStripeCustomer,
  createStripePaymentIntent,
  createStripeSetupIntent,
  updateStripeSetupIntent,
} from "../../controllers/mobile/PaymentsController.js";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile Payment APIs
 *   description: Payment APIs for mobile users
 */

/**
 * @swagger
 * /api/mobile/payments/stripe_customers:
 *   post:
 *     summary: Create a Stripe customer ID against a Clerk user ID
 *     tags: [Mobile Payment APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - email
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The Clerk user ID (required)
 *               email:
 *                 type: string
 *                 description: The user's email (required)
 *               password:
 *                 type: string
 *                 nullable: true
 *                 description: The user's password (optional)
 *     responses:
 *       200:
 *         description: Stripe customer ID created successfully
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/stripe_customers", createStripeCustomer);

/**
 * @swagger
 * /api/mobile/payments/stripe_setup_intent:
 *   post:
 *     summary: Create a Stripe setup intent against a stripe customer ID for a Clerk user ID
 *     tags: [Mobile Payment APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - stripe_customer_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The Clerk user ID (required)
 *               stripe_customer_id:
 *                 type: string
 *                 description: The Stripe Customer ID (required)
 *     responses:
 *       200:
 *         description: Stripe setup Intent created successfully
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/stripe_setup_intent", createStripeSetupIntent);

/**
 * @swagger
 * /api/mobile/payments/update_stripe_setup_intent:
 *   post:
 *     summary: Update a Stripe setup intent against a stripe customer ID for a Clerk user ID
 *     tags: [Mobile Payment APIs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The Clerk user ID (required)
 *     responses:
 *       200:
 *         description: Stripe setup Intent updated successfully
 *       400:
 *         description: Bad request - Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/update_stripe_setup_intent", updateStripeSetupIntent);

/**
 * @swagger
 * /api/mobile/payments/create_payment_intent:
 *   post:
 *     summary: Create a Stripe payment intent for an existing booking
 *     tags: [Mobile Payment APIs]
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
 *               - booking_id
 *             properties:
 *               booking_id:
 *                 type: string
 *                 description: The booking ID to create payment intent for (required)
 *     responses:
 *       200:
 *         description: Stripe payment Intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentIntent:
 *                   type: object
 *                   description: Stripe payment intent object
 *                 ephemeralKey:
 *                   type: string
 *                   description: Stripe ephemeral key for client-side operations
 *                 user:
 *                   type: object
 *                   description: User information
 *                 booking:
 *                   type: object
 *                   description: Booking information with profile and services
 *       400:
 *         description: Bad request - Booking ID is required
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       403:
 *         description: Forbidden - Booking doesn't belong to authenticated user
 *       404:
 *         description: Not found - Booking not found
 *       500:
 *         description: Server error
 */
router.post(
  "/create_payment_intent",
  authenticateUser,
  createStripePaymentIntent
);

export default router;
