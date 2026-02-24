import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import { getMedia, uploadMedia } from "../controllers/MediaController.js";
import upload from "../middlewares/UploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload media file
 *     tags: [Media]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               resourceType:
 *                 type: string
 *                 enum: [PROFILE, SERVICE]
 *               resourceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 */
router.post("/upload", authMiddleware, upload.single("file"), uploadMedia);

/**
 * @swagger
 * /api/media/{id}:
 *   get:
 *     summary: Get media file details
 *     tags: [Media]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Media details
 */
router.get("/:id", getMedia);

export default router;
