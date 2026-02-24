import express from "express";

import { createFAQ, deleteFAQ, getAllFAQs, updateFAQ } from "../controllers/FaqsController.js";
import { createContact, getAllContacts, updateContactStatus } from "../controllers/ContactUsController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: FAQ management
 */

/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of FAQs
 *       500:
 *         description: Internal server error
 */
router.get("/faqs", getAllFAQs);

/**
 * @swagger
 * /api/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/faqs", createFAQ);

/**
 * @swagger
 * /api/faqs/{id}:
 *   put:
 *     summary: Update an existing FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The FAQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *     responses:
 *       200:
 *         description: FAQ updated successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.put("/faqs/:id", updateFAQ);

/**
 * @swagger
 * /api/faqs/{id}:
 *   delete:
 *     summary: Delete an FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The FAQ ID
 *     responses:
 *       200:
 *         description: FAQ deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete("/faqs/:id", deleteFAQ);

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact Us management
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Get all contact messages
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: List of contact messages
 *       500:
 *         description: Internal server error
 */
router.get("/contacts", getAllContacts);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Submit a contact message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact message submitted successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/contacts", createContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Update contact message status
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contact message ID
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
 *                 enum: [PENDING, RESOLVED]
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *       400:
 *         description: Invalid status value
 *       500:
 *         description: Internal server error
 */
router.put("/contacts/:id", updateContactStatus);

export default router;
