const express = require("express");
const auth = require("../middleware/auth");
const Profile = require("../models/profileModel");

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
 *   name: Profiles
 *   description: User profile management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *         bio:
 *           type: string
 *         avatar_url:
 *           type: string
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         user_id: 1
 *         bio: "I love studying!"
 *         avatar_url: "https://example.com/avatar.jpg"
 *         updated_at: "2025-10-14T21:00:00.000Z"
 */

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
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
  Profile.getProfile(req.user.id, (err, profile) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(profile);
  });
});

/**
 * @swagger
 * /api/profiles/me:
 *   post:
 *     summary: Update user's profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bio
 *               - avatar_url
 *             properties:
 *               bio:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *             example:
 *               bio: "I love studying!"
 *               avatar_url: "https://example.com/avatar.jpg"
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               error: "Bio and avatar_url cannot be empty"
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
  const { bio, avatar_url } = req.body;
  if (!bio || !avatar_url) {
    return res.status(400).json({ error: "Bio and avatar_url cannot be empty" });
  }
  Profile.updateProfile(req.user.id, bio, avatar_url, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
});

/**
 * @swagger
 * /api/profiles/me:
 *   put:
 *     summary: Replace user's profile
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bio
 *               - avatar_url
 *             properties:
 *               bio:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *             example:
 *               bio: "Updated bio"
 *               avatar_url: "https://example.com/new-avatar.jpg"
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               error: "Bio and avatar_url cannot be empty"
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
  const { bio, avatar_url } = req.body;
  if (!bio || !avatar_url) {
    return res.status(400).json({ error: "Bio and avatar_url cannot be empty" });
  }
  Profile.updateProfile(req.user.id, bio, avatar_url, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(updated);
  });
});

module.exports = router;
