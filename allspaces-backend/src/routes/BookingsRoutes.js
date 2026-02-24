import express from "express";

import authMiddleware from "../middlewares/AuthMiddleware.js";
import { getCurrentUser } from "../controllers/UsersController.js";
import {
  bookingsForCalendar,
  getBooking,
  getBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/BookingsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/bookings/calendar:
 *   get:
 *     summary: Get all bookings for the logged-in user and map them to calendar
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings for calendar view
 */
router.get("/calendar", authMiddleware, bookingsForCalendar);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings for the logged-in user
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get("/", authMiddleware, getBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: Booking status update
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, CANCELLED, COMPLETED]
 *                 description: New status for the booking
 *     responses:
 *       200:
 *         description: Booking status update
 */
router.patch("/:id", authMiddleware, updateBookingStatus);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Find a Booking against an ID
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
router.get("/:id", authMiddleware, getBooking);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a booking (Vendor/Admin)
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
 *                 example: "Venue unavailable due to maintenance"
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
 *                   description: The cancelled booking details
 *       400:
 *         description: Bad request - Invalid cancellation reason or booking cannot be cancelled
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Booking not found or vendor doesn't have permission
 *       500:
 *         description: Server error
 */
router.post("/:id/cancel", authMiddleware, cancelBooking);

export default router;
