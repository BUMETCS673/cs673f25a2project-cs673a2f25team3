/*
  40% AI
  50% Human
  10% Framework
*/

const express = require("express");
const auth = require("../middleware/auth");
const Study = require("../models/studyModel");
const StudyProgress = require("../models/studyProgressModel");

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
  const { duration, start_time, end_time } = req.body;
  Study.addSession(req.user.id, duration, start_time, end_time, (err, session) => {
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

// Return any persisted in-progress timer for the authenticated user so the client can resume.
router.get("/progress", (req, res) => {
  StudyProgress.getProgress(req.user.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(204).send();
    res.json(row);
  });
});

// Upsert the current timer snapshot; the client periodically sends this while running/paused.
router.put("/progress", (req, res) => {
  const { target_minutes, elapsed_seconds, session_start, status } = req.body || {};
  if (
    typeof target_minutes !== "number" ||
    typeof elapsed_seconds !== "number" ||
    !session_start ||
    typeof status !== "string"
  ) {
    return res.status(400).json({ error: "Invalid progress payload" });
  }

  if (target_minutes <= 0 || elapsed_seconds < 0) {
    return res.status(400).json({ error: "Progress values must be positive" });
  }

  const normalizedStatus = status.toLowerCase();
  if (!["running", "paused", "complete"].includes(normalizedStatus)) {
    return res.status(400).json({ error: "Unsupported progress status" });
  }

  StudyProgress.upsertProgress(
    req.user.id,
    Math.round(target_minutes),
    Math.round(elapsed_seconds),
    session_start,
    normalizedStatus,
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});

// Clear the stored snapshot once the timer is complete or reset.
router.delete("/progress", (req, res) => {
  StudyProgress.clearProgress(req.user.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
});

module.exports = router;
