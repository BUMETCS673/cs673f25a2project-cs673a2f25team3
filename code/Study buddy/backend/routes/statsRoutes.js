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
 *                 totalSessions:
 *                   type: integer
 *                 weeklyDuration:
 *                   type: integer
 *                 monthlyDuration:
 *                   type: integer
 *                 recentSessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       duration:
 *                         type: integer
 *                       start_time:
 *                         type: string
 *                       end_time:
 *                         type: string
 *                       created_at:
 *                         type: string
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal server error
 */
router.get("/me", (req, res) => {
  const userId = req.user.id;

  Stats.getTotalStudyDuration(userId, (err, totalDuration) => {
    if (err) return res.status(500).json({ error: err.message });

    Stats.getTotalSessions(userId, (err, totalSessions) => {
      if (err) return res.status(500).json({ error: err.message });

      Stats.getWeeklyStudyDuration(userId, (err, weeklyDuration) => {
        if (err) return res.status(500).json({ error: err.message });

        Stats.getMonthlyStudyDuration(userId, (err, monthlyDuration) => {
          if (err) return res.status(500).json({ error: err.message });

          Stats.getRecentSessions(userId, (err, recentSessions) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
              totalDuration,
              totalSessions,
              weeklyDuration,
              monthlyDuration,
              recentSessions,
            });
          });
        });
      });
    });
  });
});

module.exports = router;
