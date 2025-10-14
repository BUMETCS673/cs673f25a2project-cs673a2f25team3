const express = require("express");
const auth = require("../middleware/auth");
const Settings = require("../models/settingsModel");

const router = express.Router();
router.use(auth);

/*
  20% AI
  70% Human
  10% Framework
*/

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         theme:
 *           type: string
 *           enum: [light, dark]
 *         daily_goal:
 *           type: integer
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         user_id: 1
 *         theme: "dark"
 *         daily_goal: 50
 *         updated_at: "2025-10-14T21:00:00.000Z"
 */

/**
 * @swagger
 * /api/settings/me:
 *   get:
 *     summary: Get current user's settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
 */
router.get("/me", (req, res) => {
  Settings.getSettings(req.user.id, (err, settings) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(settings);
  });
});

/**
 * @swagger
 * /api/settings/me:
 *   post:
 *     summary: Update user's settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *               - daily_goal
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *               daily_goal:
 *                 type: integer
 *             example:
 *               theme: "dark"
 *               daily_goal: 50
 *     responses:
 *       200:
 *         description: Updated settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid settings data"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
 */
router.post("/me", (req, res) => {
  const { theme, daily_goal } = req.body;
  const validThemes = ["light", "dark"];
  if (!validThemes.includes(theme) || typeof daily_goal !== "number" || daily_goal < 0) {
    return res.status(400).json({ error: "Invalid settings data" });
  }
  Settings.updateSettings(req.user.id, theme, daily_goal, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
});

/**
 * @swagger
 * /api/settings/me:
 *   put:
 *     summary: Replace user's settings
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - theme
 *               - daily_goal
 *             properties:
 *               theme:
 *                 type: string
 *                 enum: [light, dark]
 *               daily_goal:
 *                 type: integer
 *             example:
 *               theme: "light"
 *               daily_goal: 60
 *     responses:
 *       200:
 *         description: Updated settings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Settings'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid settings data"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
 */
router.put("/me", (req, res) => {
  const { theme, daily_goal } = req.body;
  const validThemes = ["light", "dark"];
  if (!validThemes.includes(theme) || typeof daily_goal !== "number" || daily_goal < 0) {
    return res.status(400).json({ error: "Invalid settings data" });
  }
  Settings.updateSettings(req.user.id, theme, daily_goal, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(updated);
  });
});

module.exports = router;
