const express = require("express");
const auth = require("../middleware/auth");
const Study = require("../models/studyModel");

const router = express.Router();
router.use(auth);

/*
  20% AI
  70% human
  10% framework
*/


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
 *     summary: Add a new study session for the authenticated user
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - duration
 *             properties:
 *               duration:
 *                 type: integer
 *                 description: Duration of study session in minutes
 *             example:
 *               duration: 60
 *     responses:
 *       201:
 *         description: Study session added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudySession'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid study duration"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
 */
router.post("/me", (req, res) => {
  const { duration } = req.body;

  if (!duration || typeof duration !== "number" || duration <= 0) {
    return res.status(400).json({ error: "Invalid study duration" });
  }

  const start_time = new Date();
  const end_time = new Date(start_time.getTime() + duration * 60000);

  Study.addSession(
    req.user.id,
    duration,
    start_time.toISOString(),
    end_time.toISOString(),
    (err, session) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(session);
    }
  );
});

/**
 * @swagger
 * /api/study/me:
 *   get:
 *     summary: Get all study sessions of the authenticated user
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
 *                 $ref: '#/components/schemas/StudySession'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
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
 *     summary: Get the latest study session of the authenticated user
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Latest study session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudySession'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No session found
 *         content:
 *           application/json:
 *             example:
 *               message: "No study session found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
 */
router.get("/me/latest", (req, res) => {
  Study.getLatestSession(req.user.id, (err, session) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!session) return res.status(404).json({ message: "No study session found" });
    res.json(session);
  });
});

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     StudySession:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the study session
 *         user_id:
 *           type: integer
 *           description: ID of the user
 *         duration:
 *           type: integer
 *           description: Duration of the study session in minutes
 *         start_time:
 *           type: string
 *           format: date-time
 *           description: Start time of the study session
 *         end_time:
 *           type: string
 *           format: date-time
 *           description: End time of the study session
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the session was created
 *       example:
 *         id: 1
 *         user_id: 123
 *         duration: 60
 *         start_time: "2025-10-14T21:00:00.000Z"
 *         end_time: "2025-10-14T22:00:00.000Z"
 *         created_at: "2025-10-14T21:00:00.000Z"
 */
