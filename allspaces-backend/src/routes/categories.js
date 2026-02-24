import express from "express";
import {
  getAllCategories,
  getCategoryById,
  getCategoriesByType,
  getCategoriesWithServices,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  getRootCategories,
} from "../controllers/CategoriesController.js";

import authMiddleware from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier
 *         title:
 *           type: string
 *           description: Category title
 *         image:
 *           type: string
 *           description: URL to category image
 *         type:
 *           type: string
 *           enum: [WORKSPACE, RELAXATION, LEISURE, DINING, SLEEP, TRAVEL, OTHER]
 *           description: Category type
 *         services:
 *           type: array
 *           description: Services associated with this category
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *         profiles:
 *           type: array
 *           description: Profiles associated with this category
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Category management API
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     description: Retrieve a list of all categories
 *     parameters:
 *       - in: query
 *         name: includeSubcategories
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: false
 *         description: Whether to include subcategories in the response
 *     responses:
 *       200:
 *         description: A list of categories
 *       500:
 *         description: Server error
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/root:
 *   get:
 *     summary: Get all root categories
 *     tags: [Categories]
 *     description: Retrieve a list of all root categories (categories without parents)
 *     responses:
 *       200:
 *         description: A list of root categories
 *       500:
 *         description: Server error
 */
router.get("/root", getRootCategories);

// /**
//  * @swagger
//  * /api/categories/with-services:
//  *   get:
//  *     summary: Get all categories with their services
//  *     tags: [Categories]
//  *     description: Retrieve a list of all categories with their associated services
//  *     parameters:
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *           enum: [title, type, id]
//  *           default: type
//  *         description: Field to sort categories by
//  *       - in: query
//  *         name: includeSubcategories
//  *         schema:
//  *           type: string
//  *           enum: [true, false]
//  *           default: false
//  *         description: Whether to include subcategories in the response
//  *     responses:
//  *       200:
//  *         description: A list of categories with their services
//  *       500:
//  *         description: Server error
//  */
// router.get("/with-services", getCategoriesWithServices);

// /**
//  * @swagger
//  * /api/categories/type/{type}:
//  *   get:
//  *     summary: Get categories by type
//  *     tags: [Categories]
//  *     description: Retrieve categories of a specific type
//  *     parameters:
//  *       - in: path
//  *         name: type
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Category type
//  *     responses:
//  *       200:
//  *         description: Categories of the specified type
//  *       400:
//  *         description: Category type is required
//  *       500:
//  *         description: Server error
//  */
// router.get("/type/:type", getCategoriesByType);

/**
 * @swagger
 * /api/categories/{parentId}/subcategories:
 *   get:
 *     summary: Get subcategories for a category
 *     tags: [Categories]
 *     description: Retrieve all subcategories for a specific parent category
 *     parameters:
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent category ID
 *     responses:
 *       200:
 *         description: A list of subcategories
 *       404:
 *         description: Parent category not found
 *       500:
 *         description: Server error
 */
router.get("/:parentId/subcategories", getSubcategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     description: Retrieve a category by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getCategoryById);

// /**
//  * @swagger
//  * /api/categories:
//  *   post:
//  *     summary: Create a new category
//  *     tags: [Categories]
//  *     description: Create a new category with optional parent category
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - title
//  *             properties:
//  *               title:
//  *                 type: string
//  *                 description: Category title
//  *               type:
//  *                 type: string
//  *                 description: Category type (WORKSPACE, RELAXATION, etc.)
//  *               image:
//  *                 type: string
//  *                 description: URL or path to category image
//  *               parentId:
//  *                 type: string
//  *                 description: ID of the parent category (if this is a subcategory)
//  *     responses:
//  *       201:
//  *         description: Category created successfully
//  *       400:
//  *         description: Invalid input or category with this title already exists
//  *       500:
//  *         description: Server error
//  */
// router.post("/", authMiddleware, createCategory);

// /**
//  * @swagger
//  * /api/categories/{id}:
//  *   put:
//  *     summary: Update a category
//  *     tags: [Categories]
//  *     description: Update an existing category
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Category ID
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               title:
//  *                 type: string
//  *                 description: Category title
//  *               type:
//  *                 type: string
//  *                 description: Category type (WORKSPACE, RELAXATION, etc.)
//  *               image:
//  *                 type: string
//  *                 description: URL or path to category image
//  *               parentId:
//  *                 type: string
//  *                 description: ID of the parent category (if this is a subcategory)
//  *     responses:
//  *       200:
//  *         description: Category updated successfully
//  *       400:
//  *         description: Invalid input or category with this title already exists
//  *       404:
//  *         description: Category not found
//  *       500:
//  *         description: Server error
//  */
// router.put("/:id", authMiddleware, updateCategory);

// /**
//  * @swagger
//  * /api/categories/{id}:
//  *   delete:
//  *     summary: Delete a category
//  *     tags: [Categories]
//  *     description: Delete a category and optionally reassign its subcategories
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Category ID
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               reassignSubcategoriesTo:
//  *                 type: string
//  *                 description: ID of the category to reassign subcategories to
//  *     responses:
//  *       200:
//  *         description: Category deleted successfully
//  *       404:
//  *         description: Category not found
//  *       500:
//  *         description: Server error
//  */
// router.delete("/:id", authMiddleware, deleteCategory);

export default router;
