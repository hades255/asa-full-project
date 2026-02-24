import express from "express";
import {
  getTerms,
  createTerms,
  updateTerms,
  deleteTerms,
  getPrivacyPolicy,
  createPrivacyPolicy,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
} from "../controllers/TermsPrivacyController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Terms and Conditions
 *   description: Terms and Conditions management
 */

// ============= TERMS AND CONDITIONS ROUTES =============

/**
 * @swagger
 * /api/terms-and-conditions:
 *   get:
 *     summary: Get Terms and Conditions
 *     tags: [Terms and Conditions]
 *     responses:
 *       200:
 *         description: Terms and conditions content
 *       404:
 *         description: Terms not found
 *       500:
 *         description: Internal server error
 */
router.get("/terms-and-conditions", getTerms);

/**
 * @swagger
 * /api/terms-and-conditions:
 *   post:
 *     summary: Create Terms and Conditions (deletes existing and creates new)
 *     tags: [Terms and Conditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Terms and conditions content
 *     responses:
 *       201:
 *         description: Terms and conditions created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/terms-and-conditions", createTerms);

/**
 * @swagger
 * /api/terms-and-conditions:
 *   put:
 *     summary: Update existing Terms and Conditions
 *     tags: [Terms and Conditions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Terms and conditions content
 *     responses:
 *       200:
 *         description: Terms and conditions updated successfully
 *       404:
 *         description: Terms not found
 *       500:
 *         description: Internal server error
 */
router.put("/terms-and-conditions", updateTerms);

/**
 * @swagger
 * /api/terms-and-conditions:
 *   delete:
 *     summary: Delete Terms and Conditions
 *     tags: [Terms and Conditions]
 *     responses:
 *       200:
 *         description: Terms and conditions deleted successfully
 *       404:
 *         description: Terms not found
 *       500:
 *         description: Internal server error
 */
router.delete("/terms-and-conditions", deleteTerms);

/**
 * @swagger
 * tags:
 *   name: Privacy Policy
 *   description: Privacy Policy management
 */

// ============= PRIVACY POLICY ROUTES =============

/**
 * @swagger
 * /api/privacy-policy:
 *   get:
 *     summary: Get Privacy Policy
 *     tags: [Privacy Policy]
 *     responses:
 *       200:
 *         description: Privacy policy content
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal server error
 */
router.get("/privacy-policy", getPrivacyPolicy);

/**
 * @swagger
 * /api/privacy-policy:
 *   post:
 *     summary: Create Privacy Policy (deletes existing and creates new)
 *     tags: [Privacy Policy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Privacy policy content
 *     responses:
 *       201:
 *         description: Privacy policy created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/privacy-policy", createPrivacyPolicy);

/**
 * @swagger
 * /api/privacy-policy:
 *   put:
 *     summary: Update existing Privacy Policy
 *     tags: [Privacy Policy]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Privacy policy content
 *     responses:
 *       200:
 *         description: Privacy policy updated successfully
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal server error
 */
router.put("/privacy-policy", updatePrivacyPolicy);

/**
 * @swagger
 * /api/privacy-policy:
 *   delete:
 *     summary: Delete Privacy Policy
 *     tags: [Privacy Policy]
 *     responses:
 *       200:
 *         description: Privacy policy deleted successfully
 *       404:
 *         description: Policy not found
 *       500:
 *         description: Internal server error
 */
router.delete("/privacy-policy", deletePrivacyPolicy);

export default router;
