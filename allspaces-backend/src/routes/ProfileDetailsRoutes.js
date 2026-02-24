import express from "express";
import authMiddleware from "../middlewares/AuthMiddleware.js";
import {
  addFacility,
  updateFacility,
  deleteFacility,
  addMedia,
  updateMedia,
  deleteMedia,
} from "../controllers/ProfilesDetailsController.js";
import upload from "../middlewares/UploadMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/profiles/{id}/facilities:
 *   post:
 *     summary: Add a facility to a profile
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the facility (Required)
 *                 example: "Swimming Pool"
 *     responses:
 *       201:
 *         description: Facility added successfully
 *       400:
 *         description: Bad request
 */
router.post("/:id/facilities", authMiddleware, addFacility);

/**
 * @swagger
 * /api/profiles/{profileId}/facilities/{facilityId}:
 *   put:
 *     summary: Update a facility
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Updates a facility name for a specific profile.
 *       User can only update facilities that belong to their own profiles.
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *       - in: path
 *         name: facilityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Facility ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the facility
 *                 example: "Updated Swimming Pool"
 *     responses:
 *       200:
 *         description: Facility updated successfully
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
 *                   example: "Facility updated successfully"
 *                 facility:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     profileId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request - Facility name is required
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User can only update facilities for their own profiles
 *       404:
 *         description: Profile or facility not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:profileId/facilities/:facilityId",
  authMiddleware,
  updateFacility
);

/**
 * @swagger
 * /api/profiles/{profileId}/facilities/{facilityId}:
 *   delete:
 *     summary: Delete a facility
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Deletes a facility from a specific profile.
 *       User can only delete facilities that belong to their own profiles.
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *       - in: path
 *         name: facilityId
 *         required: true
 *         schema:
 *           type: string
 *         description: Facility ID
 *     responses:
 *       200:
 *         description: Facility deleted successfully
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
 *                   example: "Facility deleted successfully"
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User can only delete facilities for their own profiles
 *       404:
 *         description: Profile or facility not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:profileId/facilities/:facilityId",
  authMiddleware,
  deleteFacility
);

/**
 * @swagger
 * /api/profiles/{id}/medias:
 *   post:
 *     summary: Upload media to a profile
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Upload media files to a profile. Only PNG, JPG, and JPEG images are allowed.
 *       Maximum file size is 10MB per file.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medias:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Media files (PNG, JPG, JPEG only, max 10MB each)
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Media files uploaded to S3 successfully"
 *                 media:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       filePath:
 *                         type: string
 *                       fileType:
 *                         type: string
 *                         enum: [PNG, JPG]
 *                       profileId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 count:
 *                   type: number
 *                   description: Number of files successfully uploaded
 *       400:
 *         description: Bad request - Invalid file type or missing files
 *       408:
 *         description: Request timeout - Upload took too long
 *       500:
 *         description: Server error
 */
router.post("/:id/medias", authMiddleware, upload.array("medias", 5), addMedia);

/**
 * @swagger
 * /api/profiles/{profileId}/medias/{mediaId}:
 *   put:
 *     summary: Update a media file
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Updates a media file for a specific profile by replacing it with a new file.
 *       User can only update media that belongs to their own profiles.
 *       Only PNG, JPG, and JPEG images are allowed. Maximum file size is 10MB.
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - media
 *             properties:
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: New media file to replace the existing one (PNG, JPG, JPEG only, max 10MB)
 *     responses:
 *       200:
 *         description: Media updated successfully
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
 *                   example: "Media updated successfully"
 *                 media:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     filePath:
 *                       type: string
 *                     fileType:
 *                       type: string
 *                       enum: [PNG, JPG]
 *                     profileId:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Bad request - Invalid file type or no file provided
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User can only update media for their own profiles
 *       404:
 *         description: Profile or media not found
 *       408:
 *         description: Request timeout - Upload took too long
 *       500:
 *         description: Server error
 */
router.put(
  "/:profileId/medias/:mediaId",
  authMiddleware,
  upload.single("media"),
  updateMedia
);

/**
 * @swagger
 * /api/profiles/{profileId}/medias/{mediaId}:
 *   delete:
 *     summary: Delete a media file
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Deletes a media file from a specific profile.
 *       User can only delete media that belongs to their own profiles.
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: Profile ID
 *       - in: path
 *         name: mediaId
 *         required: true
 *         schema:
 *           type: string
 *         description: Media ID
 *     responses:
 *       200:
 *         description: Media deleted successfully
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
 *                   example: "Media deleted successfully"
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized - Authentication required
 *       403:
 *         description: Forbidden - User can only delete media for their own profiles
 *       404:
 *         description: Profile or media not found
 *       500:
 *         description: Server error
 */
router.delete("/:profileId/medias/:mediaId", authMiddleware, deleteMedia);

export default router;
