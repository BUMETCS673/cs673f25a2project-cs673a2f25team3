const express = require("express");
const auth = require("../middleware/auth");
const Profile = require("../models/profileModel");

const router = express.Router();
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: User profile management
 */

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Get the profile of the logged-in user
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
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
 *     summary: Update the profile of the logged-in user
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 bio:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
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

module.exports = router;
