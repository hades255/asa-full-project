import express from "express";

import authMiddleware from "../middlewares/AuthMiddleware.js";
import {
  createUsersForVendor,
  updateUsersForVendor,
  deleteUsersForVendor,
  getCurrentUser,
  getEmployeesForVendor,
  searchEmployeesForVendor,
} from "../controllers/UsersController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users APIs
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized - No token provided
 *       500:
 *         description: Server error
 */
router.get("/me", authMiddleware, getCurrentUser);

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123!"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, VENDOR]
 *                 example: "ADMIN"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, BLOCKED]
 *                 example: "ACTIVE"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already in use
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post("/create", authMiddleware, createUsersForVendor);

/**
 * @swagger
 * /api/users/{staff_id}:
 *   put:
 *     summary: Update a staff member
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staff_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the staff member to update
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "NewPassword123!"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, VENDOR]
 *                 example: "ADMIN"
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, BLOCKED]
 *                 example: "ACTIVE"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                     status:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Email already in use
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/:staff_id", authMiddleware, updateUsersForVendor);

/**
 * @swagger
 * /api/users/{staff_id}:
 *   delete:
 *     summary: Delete a staff member
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staff_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the staff member to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/:staff_id", authMiddleware, deleteUsersForVendor);

/**
 * @swagger
 * /api/users/employees:
 *   get:
 *     summary: Get all employees under a specific vendor
 *     description: Retrieves all employees (users) that belong to the authenticated vendor (where parent_id matches the vendor's id)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved employees list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "clx1234567890abcdef"
 *                   first_name:
 *                     type: string
 *                     example: "John"
 *                   last_name:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["EMPLOYEE"]
 *                   status:
 *                     type: string
 *                     enum: [ACTIVE, BLOCKED]
 *                     example: "ACTIVE"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get("/employees", authMiddleware, getEmployeesForVendor);

/**
 * @swagger
 * /api/users/search_employees:
 *   get:
 *     summary: Search employees under a specific vendor
 *     description: Search and filter employees (users) that belong to the authenticated vendor using a keyword. Searches across first_name, last_name, email, and phone fields.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: Search keyword to filter employees by name, email, or phone
 *         example: "john"
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered employees list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "clx1234567890abcdef"
 *                   first_name:
 *                     type: string
 *                     example: "John"
 *                   last_name:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *                   phone:
 *                     type: string
 *                     example: "+1234567890"
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["EMPLOYEE"]
 *                   status:
 *                     type: string
 *                     enum: [ACTIVE, BLOCKED]
 *                     example: "ACTIVE"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-01-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 */
router.get("/search_employees", authMiddleware, searchEmployeesForVendor);

export default router;
