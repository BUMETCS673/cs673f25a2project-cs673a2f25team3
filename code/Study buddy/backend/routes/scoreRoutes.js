const express = require("express");
const router = express.Router();
const db = require("../db/db");
const authenticate = require("../middleware/auth");

// ========== Get highest score ==========
router.get("/:gameId", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { gameId } = req.params;

  try {
    const record = await db.get(
      "SELECT high_score FROM game_records WHERE user_id = ? AND game_id = ?",
      [userId, gameId]
    );

    if (!record) {
      return res.json({ gameId, highScore: 0 });
    }

    res.json({ gameId, highScore: record.high_score });
  } catch (err) {
    console.error("GET score error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ========== Update highest score ==========
router.post("/update", authenticate, async (req, res) => {
  const userId = req.user.id;
  const { gameId, score } = req.body;

  try {
    const existing = await db.get(
      "SELECT * FROM game_records WHERE user_id = ? AND game_id = ?",
      [userId, gameId]
    );

    // If no record → insert
    if (!existing) {
      await db.run(
        `
        INSERT INTO game_records (user_id, game_id, high_score)
        VALUES (?, ?, ?)
        `,
        [userId, gameId, score]
      );
      return res.json({ updated: true, newHighScore: score });
    }

    // If score higher → update
    if (score > existing.high_score) {
      await db.run(
        `
        UPDATE game_records 
        SET high_score = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        `,
        [score, existing.id]
      );
      return res.json({ updated: true, newHighScore: score });
    }

    // Otherwise do nothing
    return res.json({ updated: false, newHighScore: existing.high_score });
  } catch (err) {
    console.error("POST score error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
