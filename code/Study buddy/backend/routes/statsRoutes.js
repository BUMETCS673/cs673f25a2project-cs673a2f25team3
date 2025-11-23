/*
  20% AI Generate swagger comment
  70% Human
  10% Framework
*/

const express = require("express");
const auth = require("../middleware/auth");
const Stats = require("../models/statsModel");

const router = express.Router();
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Study statistics for the user
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/stats/me:
 *   get:
 *     summary: Get study statistics of the logged-in user
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDuration:
 *                   type: integer
 *                   example: 3600
 *                 totalSessions:
 *                   type: integer
 *                   example: 25
 *                 monthlyDuration:
 *                   type: integer
 *                   example: 600
 *                 recentSessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 101
 *                       duration:
 *                         type: integer
 *                         example: 45
 *                       start_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-23T14:00:00Z"
 *                       end_time:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-23T14:45:00Z"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-11-23T14:50:00Z"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.get("/me", (req, res) => {
  const userId = req.user.id;

  Stats.getStats(userId, (err, stats) => {
    if (err) return res.status(500).json({ error: err.message });

    Stats.getRecentSessions(userId, (err, recentSessions) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        totalDuration: stats.totalDuration,
        totalSessions: stats.totalSessions,
        monthlyDuration: stats.monthlyDuration,
        recentSessions: recentSessions || [],
      });
    });
  });
});

module.exports = router;
