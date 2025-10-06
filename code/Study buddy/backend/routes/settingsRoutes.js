const express = require("express");
const auth = require("../middleware/auth");
const Settings = require("../models/settingsModel");

const router = express.Router();
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings management
 */

/**
 * @swagger
 * /api/settings/me:
 *   get:
 *     summary: Get the settings of the logged-in user
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 theme:
 *                   type: string
 *                 daily_goal:
 *                   type: integer
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
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
 *     summary: Update the settings of the logged-in user
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *               daily_goal:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 theme:
 *                   type: string
 *                 daily_goal:
 *                   type: integer
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
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

module.exports = router;
