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
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.post("/me", (req, res) => {
  const { duration } = req.body;

  // verify input
  if (!duration || typeof duration !== "number" || duration <= 0) {
    return res.status(400).json({ error: "Invalid study duration" });
  }

  // generate start and end time
  const start_time = new Date();
  const end_time = new Date(start_time.getTime() + duration * 60000); // duration to mins

  Study.addSession(req.user.id, duration, start_time.toISOString(), end_time.toISOString(), (err, session) => {
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

/**
 * @swagger
 * /api/study/me/latest:
 *   get:
 *     summary: Get the latest study session of the logged-in user
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest study session
 *       404:
 *         description: No session found
 *       401:
 *         description: Unauthorized
 */
router.get("/me/latest", (req, res) => {
  Study.getLatestSession(req.user.id, (err, session) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!session) return res.status(404).json({ message: "No study session found" });
    res.json(session);
  });
});

module.exports = router;
