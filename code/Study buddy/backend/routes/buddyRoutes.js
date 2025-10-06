const express = require("express");
const auth = require("../middleware/auth");
const Buddy = require("../models/buddyModel");
const db = require("../db/db"); // 引入数据库连接

const router = express.Router();
router.use(auth);

// ✅ 获取当前用户的 Buddy（含动态能量衰减计算）
router.get("/me", (req, res) => {
  const userId = req.user.id;

  // Step 1: 获取当前用户的 buddy
  Buddy.getBuddy(userId, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!buddy) return res.status(404).json({ error: "Buddy not found" });

    // Step 2: 查询用户最近一次学习记录的时间
    const query = `
      SELECT created_at FROM study_sessions 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `;

    db.get(query, [userId], (err, session) => {
      if (err) return res.status(500).json({ error: err.message });

      // Step 3: 如果存在学习记录，则计算时间差（小时）
      if (session && session.created_at) {
        const lastActive = new Date(session.created_at);
        const now = new Date();
        const hoursDiff = Math.floor((now - lastActive) / (1000 * 60 * 60));

        // Step 4: 动态计算 energy（假设每小时衰减 1 点）
        const decayedEnergy = Math.max(0, buddy.energy - hoursDiff);

        // ✅ 返回动态计算后的结果（不更新数据库）
        return res.status(200).json({
          buddy: {
            ...buddy,
            energy: decayedEnergy,
            last_active: session.created_at,
          },
        });
      }

      // 没有学习记录则原样返回
      res.status(200).json({ buddy });
    });
  });
});

// ✅ 创建当前用户的 Buddy
router.post("/me", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  // 检查是否已有 Buddy
  Buddy.getBuddy(req.user.id, (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) return res.status(400).json({ error: "Buddy already exists" });

    // 创建新 Buddy
    Buddy.createBuddy(req.user.id, name, (err, buddy) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ buddy });
    });
  });
});

module.exports = router;
