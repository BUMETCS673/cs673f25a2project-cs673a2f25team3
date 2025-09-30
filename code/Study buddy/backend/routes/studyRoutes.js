const express = require("express");
const auth = require("../middleware/auth");
const Study = require("../models/studyModel");

const router = express.Router();
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Study
 *   description: User study session management
 */

/**
 * @swagger
 * /api/study/me:
 *   post:
 *     summary: Add a new study session for the logged-in user
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: integer
 *                 description: Duration of study session in minutes
 *     responses:
 *       201:
 *         description: Study session added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 duration:
 *                   type: integer
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.post("/me", (req, res) => {
  const { duration } = req.body;
  Study.addSession(req.user.id, duration, (err, session) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(session);
  });
});

/**
 * @swagger
 * /api/study/me:
 *   get:
 *     summary: Get all study sessions of the logged-in user
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of study sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   duration:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.get("/me", (req, res) => {
  Study.getSessions(req.user.id, (err, sessions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(sessions);
  });
});

module.exports = router;
