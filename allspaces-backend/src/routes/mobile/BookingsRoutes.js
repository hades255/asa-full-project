import express from "express";

import {
  getBookings,
  createBooking,
  getBookingById,
  getUpcomingBooking,
  cancelBooking,
  startBooking,
} from "../../controllers/mobile/BookingsController.js";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";
import { authenticateConciergeUser } from "../../middlewares/ClerkAuthConcierge.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile Booking APIs
 *   description: Bookings APIs for mobile users
 */

/**
 * @swagger
 * /api/mobile/bookings:
 *   get:
 *     summary: Get all bookings for the logged-in user
 *     tags: [Mobile Booking APIs]
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
 *         description: Number of bookings per page
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, CANCELLED, COMPLETED]
 *         description: Filter bookings by status
 *     responses:
 *       200:
 *         description: List of bookings with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       description: Total number of bookings
 *                     page:
 *                       type: number
 *                       description: Current page number
 *                     limit:
 *                       type: number
 *                       description: Number of bookings per page
 *                     pages:
 *                       type: number
 *                       description: Total number of pages
 *       400:
 *         description: Bad request - Invalid pagination parameters or status
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       500:
 *         description: Server error
 */
router.get("/", authenticateUser, getBookings);

/**
 * @swagger
 * /api/mobile/bookings/create:
 *   post:
 *     summary: Create a new booking
 *     tags: [Mobile Booking APIs]
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
 *             required:
 *               - profile_id
 *               - check_in
 *               - no_of_guests
 *               - source
 *             properties:
 *               profile_id:
 *                 type: string
 *                 description: The profile ID
 *               check_in:
 *                 type: string
 *                 format: date-time
 *                 description: The check-in date and time (ISO 8601 format)
 *               no_of_guests:
 *                 type: number
 *                 format: integer
 *                 description: No of guests for the booking
 *               source:
 *                 type: string
 *                 enum: [SPACE, ACCOR]
 *                 description: Source of the profile (SPACE or ACCOR)
 *               duration:
 *                 type: number
 *                 format: integer
 *                 description: Duration of the booking in minutes
 *                 example: 120
 *               time:
 *                 type: string
 *                 description: Time of the booking (can be in any format like "14:30" or "2:30 PM")
 *                 example: "14:30"
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of service IDs to book with this profile
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     format: float
 *                     description: Latitude coordinate
 *                   lng:
 *                     type: number
 *                     format: float
 *                     description: Longitude coordinate
 *                 description: Location coordinates for the booking
 *               address:
 *                 type: string
 *                 description: Human-readable address for the booking location
 *                 example: "123 Main Street, New York, NY 10001"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking created successfully"
 *                 booking:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The booking ID
 *                     duration:
 *                       type: number
 *                       format: integer
 *                       description: Duration of the booking in minutes
 *                     time:
 *                       type: string
 *                       description: Time of the booking
 *       400:
 *         description: Validation error (e.g., missing fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
router.post("/create", authenticateUser, createBooking);

/**
 * @swagger
 * /api/mobile/bookings/upcoming:
 *   get:
 *     summary: Find a Upcoming Booking
 *     tags: [Mobile Booking APIs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: session-id
 *         required: true
 *         schema:
 *         type: string
 *         description: Clerk session ID for authentication
 *     responses:
 *       200:
 *         description: Find a Upcoming Booking
 */
router.get("/upcoming", authenticateUser, getUpcomingBooking);

/**
 * @swagger
 * /api/mobile/bookings/{id}:
 *   get:
 *     summary: Find a Booking against an ID
 *     tags: [Mobile Booking APIs]
 *     security:
 *       - BearerAuth: []
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
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Find a Booking against an ID
 */
router.get("/:id", authenticateConciergeUser, getBookingById);

/**
 * @swagger
 * /api/mobile/bookings/{id}/start:
 *   post:
 *     summary: Start a booking (Mark as In Progress)
 *     tags: [Mobile Booking APIs]
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID to start
 *     responses:
 *       200:
 *         description: Booking started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking started successfully"
 *                 booking:
 *                   type: object
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request - Booking cannot be started (already cancelled, completed or in progress)
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       404:
 *         description: Booking not found or user doesn't have permission
 *       500:
 *         description: Server error
 */
router.post("/:id/start", authenticateUser, startBooking);

/**
 * @swagger
 * /api/mobile/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Mobile Booking APIs]
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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID to cancel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancellationReason
 *             properties:
 *               cancellationReason:
 *                 type: string
 *                 description: Reason for cancelling the booking
 *                 example: "Change of plans - unable to attend"
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Booking cancelled successfully"
 *                 booking:
 *                   type: object
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request - Invalid cancellation reason or booking cannot be cancelled
 *       401:
 *         description: Unauthorized - Invalid or missing session ID
 *       404:
 *         description: Booking not found or user doesn't have permission
 *       500:
 *         description: Server error
 */
router.post("/:id/cancel", authenticateUser, cancelBooking);

export default router;
