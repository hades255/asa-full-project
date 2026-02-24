import express from "express";
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesForSelection,
  getServicesByCategoryType,
  getServicesByUserId,
} from "../controllers/ServicesController.js";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/UploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         name:
 *           type: string
 *           description: Service name
 *         description:
 *           type: string
 *           description: Service description
 *         categoryId:
 *           type: string
 *           description: ID of the associated category
 *         category:
 *           type: object
 *           description: Associated category with its type
 *           properties:
 *             id:
 *               type: string
 *             title:
 *               type: string
 *             type:
 *               type: string
 *               enum: [WORKSPACE, RELAXATION, LEISURE, DINING, SLEEP, TRAVEL, OTHER]
 *         media:
 *           type: object
 *           description: Associated media file
 *         profile:
 *           type: object
 *           description: Profile using this service
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Service creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Service last update timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management API
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getAllServices);

/**
 * @swagger
 * /api/services/selection:
 *   get:
 *     summary: Get services list for dropdown selection
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     description: Returns a simplified list of services for use in dropdown menus and selection interfaces
 *     responses:
 *       200:
 *         description: List of services with essential fields for selection
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Service unique identifier
 *                   name:
 *                     type: string
 *                     description: Service name
 *                   description:
 *                     type: string
 *                     description: Brief description of the service
 *                   categoryId:
 *                     type: string
 *                     description: ID of the associated category
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [WORKSPACE, RELAXATION, LEISURE, DINING, SLEEP, TRAVEL, OTHER]
 *                   media:
 *                     type: object
 *                     description: Service thumbnail or icon
 *       500:
 *         description: Server error
 */
router.get("/selection", authMiddleware, getServicesForSelection);

/**
 * @swagger
 * /api/services/user/{userId}:
 *   get:
 *     summary: Get services by user ID
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     description: Returns services associated with a specific user through their profiles
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of services associated with the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Service'
 *                   - type: object
 *                     properties:
 *                       profiles:
 *                         type: array
 *                         description: Profiles of the user that offer this service
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: Profile ID
 *                             name:
 *                               type: string
 *                               description: Profile name
 *                             minSpend:
 *                               type: number
 *                               description: Minimum spend requirement for this service
 *                             profileId:
 *                               type: string
 *                               description: Profile ID
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", authMiddleware, getServicesByUserId);

/**
 * @swagger
 * /api/services/category-type/{type}:
 *   get:
 *     summary: Get services by category type
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     description: Returns services belonging to categories with the specified type
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [WORKSPACE, RELAXATION, LEISURE, DINING, SLEEP, TRAVEL, OTHER]
 *         description: Category type
 *     responses:
 *       200:
 *         description: List of services by category type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       400:
 *         description: Category type is required
 *       500:
 *         description: Server error
 */
router.get("/category-type/:type", authMiddleware, getServicesByCategoryType);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get a service by ID
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getServiceById);

/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - categoryId
 *               - minSpend
 *               - media
 *             properties:
 *               name:
 *                 type: string
 *                 description: Service name
 *                 example: "Room Cleaning"
 *               description:
 *                 type: string
 *                 description: Service description
 *                 example: "Professional room cleaning service"
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the category to associate with this service
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               minSpend:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum spend requirement for this service
 *                 example: 50
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Service image (.png, .jpg, .jpeg only). Required.
 *     responses:
 *       201:
 *         description: Service created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Invalid input, service with name already exists, invalid category ID, or profile not found
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, upload.single("media"), createService);

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - categoryId
 *               - minSpend
 *             properties:
 *               name:
 *                 type: string
 *                 description: Service name
 *                 example: "Updated Room Cleaning"
 *               description:
 *                 type: string
 *                 description: Service description
 *                 example: "Updated professional room cleaning service"
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the category to associate with this service
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               minSpend:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum spend requirement for this service
 *                 example: 75
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Service image (.png, .jpg, .jpeg only). Optional.
 *     responses:
 *       200:
 *         description: Service updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Service updated successfully"
 *                 service:
 *                   $ref: '#/components/schemas/Service'
 *       400:
 *         description: Bad request - Invalid input, service name already exists, invalid category ID, or profile not found
 *       401:
 *         description: Unauthorized - Authentication required
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, upload.single("media"), updateService);

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Services]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Deletes a service and all its associated data:
 *       - Removes all vendor service associations
 *       - Deletes associated media files (S3 or local)
 *       - Deletes the service record
 *       - User can only delete services that belong to their profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Service deleted successfully"
 *                 deletedService:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the deleted service
 *                     name:
 *                       type: string
 *                       description: Name of the deleted service
 *                     description:
 *                       type: string
 *                       description: Description of the deleted service
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User can only delete services that belong to their profiles
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteService);

export default router;
