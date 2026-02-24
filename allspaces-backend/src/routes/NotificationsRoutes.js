import express from "express";

import authMiddleware from "../middlewares/AuthMiddleware.js";
import { getCurrentUser } from "../controllers/UsersController.js";
import { getNotifications, markAsRead } from "../controllers/NotificationsController.js";

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/", authMiddleware, getNotifications);

/**
 * @swagger
 * /api/notifications/read:
 *   patch:
 *     summary: Mark notifications as read
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
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
router.patch("/read", authMiddleware, markAsRead);

export default router;
