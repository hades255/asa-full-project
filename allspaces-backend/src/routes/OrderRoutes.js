import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import {
  getOrdersList,
  getOrdersOverview,
} from "../controllers/OrdersController.js";

const router = express.Router();

/**
 * @swagger
 * /api/orders/overview:
 *   get:
 *     summary: Get overview of orders (bookings)
 *     description: Shows total bookings and percentage of completed & cancelled bookings.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBookings:
 *                   type: number
 *                   example: 100
 *                 statusBreakdown:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       label:
 *                         type: string
 *                         example: "Completed"
 *                       percentage:
 *                         type: number
 *                         example: 40.5
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/overview", authMiddleware, getOrdersOverview);

/**
 * @swagger
 * /api/orders/list:
 *   get:
 *     summary: Get list of orders with their booking and user details
 *     description: Fetch all orders along with their associated booking and user information.
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   check_in:
 *                     type: string
 *                     format: date
 *                     example: "2025-02-21"
 *                   time:
 *                     type: string
 *                     example: "14:00:00"
 *                   status:
 *                     type: string
 *                     example: "confirmed"
 *                   amount:
 *                     type: number
 *                     example: 200.50
 *                   booking:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 5
 *                       check_in:
 *                         type: string
 *                         format: date
 *                         example: "2025-02-21"
 *                       status:
 *                         type: string
 *                         example: "completed"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 10
 *                       first_name:
 *                         type: string
 *                         example: "John"
 *                       last_name:
 *                         type: string
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         example: "john@example.com"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/list", authMiddleware, getOrdersList);

export default router;
