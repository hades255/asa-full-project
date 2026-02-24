import express from "express";
import { authenticateUser } from "../../middlewares/ClerkAuth.js";
import { getNotifications, markAsRead, searchNotifications } from "../../controllers/mobile/NotificationsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mobile Notifications APIs
 *   description: Notification APIs for mobile users
 */

/**
 * @swagger
 * /api/mobile/notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [Mobile Notifications APIs]
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
 *         description: List of notifications
 */
router.get("/", authenticateUser, getNotifications);

/**
 * @swagger
 * /api/mobile/notifications/read:
 *   patch:
 *     summary: Mark notifications as read
 *     tags: [Mobile Notifications APIs]
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
 *         name: ids
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Notification IDs
 *     responses:
 *       200:
 *         description: Notifications marked as read
 */
router.patch("/read", authenticateUser, markAsRead);

/**
 * @swagger
 * /api/mobile/notifications/search:
 *   patch:
 *     summary: Notifications as search
 *     tags: [Mobile Notifications APIs]
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
 *         name: keyword
 *         required: true
 *         type: string
 *         description: Notification Keyword
 *     responses:
 *       200:
 *         description: Notifications list
 */
router.patch("/search", authenticateUser, searchNotifications);

export default router;
