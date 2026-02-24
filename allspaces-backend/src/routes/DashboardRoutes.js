import express from "express";
import {
  getDashboardAnalytics,
  getDashboardStats,
  getRevenueStats,
  getDashboardData,
  getOrdersOverviewStats,
} from "../controllers/DashboardController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/analytics:
 *   get:
 *     summary: Get user dashboard analytics
 *     description: Fetch total spending categorized by booking status for graphical representation.
 *     security:
 *       - BearerAuth: []
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Successful response with analytics data
 *       401:
 *         description: Unauthorized (user must be logged in)
 */
router.get("/analytics", authMiddleware, getDashboardAnalytics);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics for completed bookings
 *     description: Returns completed bookings statistics with current month count, percentage change, and graph data.
 *     tags: [Dashboard]
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
 *                 key:
 *                   type: string
 *                   example: "1"
 *                 title:
 *                   type: string
 *                   example: "Completed Bookings"
 *                 value:
 *                   type: string
 *                   example: "05"
 *                 percentage:
 *                   type: string
 *                   example: "+32%"
 *                 graphData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: "Oct 2025"
 *                       bookings:
 *                         type: integer
 *                         example: 5
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/stats", authMiddleware, getDashboardStats);

/**
 * @swagger
 * /api/dashboard/revenue:
 *   get:
 *     summary: Get revenue statistics for last 6 months
 *     description: Returns revenue data for the last 6 months from all bookings.
 *     tags: [Dashboard]
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
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "Oct 2025"
 *                       revenue:
 *                         type: number
 *                         example: 1250.50
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/revenue", authMiddleware, getRevenueStats);

/**
 * @swagger
 * /api/dashboard/data:
 *   get:
 *     summary: Get comprehensive dashboard data
 *     description: Returns all dashboard information including 6 booking stat cards (each with graphData for last 30 days), revenue data for last 6 months, and pie chart data for last 6 months. Upcoming bookings are based on check_in date >= current date.
 *     tags: [Dashboard]
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
 *                 bookingStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                         example: "1"
 *                       title:
 *                         type: string
 *                         example: "Pending Bookings"
 *                       value:
 *                         type: string
 *                         example: "05"
 *                       percentage:
 *                         type: string
 *                         example: "+32%"
 *                       graphData:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             date:
 *                               type: string
 *                               example: "Oct 13"
 *                             bookings:
 *                               type: integer
 *                               example: 5
 *                 revenue:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "Oct 2025"
 *                       revenue:
 *                         type: number
 *                         example: 1250.50
 *                 pieChartData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: "Pending Bookings"
 *                       value:
 *                         type: integer
 *                         example: 12
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/data", authMiddleware, getDashboardData);

/**
 * @swagger
 * /api/dashboard/orders_overview_stats:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Fetches total bookings, cancelled bookings, and completed bookings
 *     tags: [Dashboard]
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
 *                 bookingStats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       total_count:
 *                         type: number
 *                         example: 41
 *                       cancelled_count:
 *                         type: number
 *                         example: 6
 *                       completed_count:
 *                         type: number
 *                         example: 10
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/orders_overview_stats", authMiddleware, getOrdersOverviewStats);

export default router;
