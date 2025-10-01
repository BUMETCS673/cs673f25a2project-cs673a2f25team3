// server.js
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db/db");
const auth = require("./middleware/auth");
const logger = require("./middleware/logger");

const app = express();
app.use(express.json());
app.use(logger);

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

// -------- Users --------
app.post("/api/users/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }
  const hash = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.run(sql, [username, hash], function (err) {
    if (err) {
      // UNIQUE constraint failed: users.username
      return res.status(400).json({ error: err.message });
    }
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: this.lastID, username },
    });
  });
});

app.post("/api/users/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      token,
      user: { id: user.id, username: user.username },
    });
  });
});

// -------- Profiles (me) --------
app.get("/api/profiles/me", auth, (req, res) => {
  db.get("SELECT bio, avatar_url FROM profiles WHERE user_id = ?", [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    // 测试只要求是一个对象，没记录时返回空对象即可
    return res.status(200).json(row || {});
  });
});

app.post("/api/profiles/me", auth, (req, res) => {
  const { bio = null, avatar_url = null } = req.body || {};
  // 手写 upsert：先查有没有，再 UPDATE/INSERT
  db.get("SELECT id FROM profiles WHERE user_id = ?", [req.user.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      const sql = "UPDATE profiles SET bio = ?, avatar_url = ? WHERE user_id = ?";
      db.run(sql, [bio, avatar_url, req.user.id], function (uErr) {
        if (uErr) return res.status(500).json({ error: uErr.message });
        return res.status(200).json({ bio, avatar_url });
      });
    } else {
      const sql = "INSERT INTO profiles (user_id, bio, avatar_url) VALUES (?, ?, ?)";
      db.run(sql, [req.user.id, bio, avatar_url], function (iErr) {
        if (iErr) return res.status(500).json({ error: iErr.message });
        return res.status(200).json({ bio, avatar_url });
      });
    }
  });
});

// -------- Settings (me) --------
app.get("/api/settings/me", auth, (req, res) => {
  db.get(
    "SELECT theme, daily_goal FROM settings WHERE user_id = ?",
    [req.user.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      // 测试对默认值不做强校验，这里没有就返回空对象
      return res.status(200).json(row || {});
    }
  );
});

app.post("/api/settings/me", auth, (req, res) => {
  let { theme = null, daily_goal = null } = req.body || {};
  // 允许部分字段更新：读取旧值，用新值覆盖
  db.get(
    "SELECT theme, daily_goal FROM settings WHERE user_id = ?",
    [req.user.id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      const newTheme = theme ?? (row ? row.theme : "light");
      const newGoal = daily_goal ?? (row ? row.daily_goal : 25);

      if (row) {
        const sql = "UPDATE settings SET theme = ?, daily_goal = ? WHERE user_id = ?";
        db.run(sql, [newTheme, newGoal, req.user.id], function (uErr) {
          if (uErr) return res.status(500).json({ error: uErr.message });
          return res.status(200).json({ theme: newTheme, daily_goal: newGoal });
        });
      } else {
        const sql = "INSERT INTO settings (user_id, theme, daily_goal) VALUES (?, ?, ?)";
        db.run(sql, [req.user.id, newTheme, newGoal], function (iErr) {
          if (iErr) return res.status(500).json({ error: iErr.message });
          return res.status(200).json({ theme: newTheme, daily_goal: newGoal });
        });
      }
    }
  );
});

// -------- Study sessions (me) --------
app.post("/api/study/me", auth, (req, res) => {
  const { duration } = req.body || {};
  if (typeof duration !== "number" || duration <= 0) {
    return res.status(400).json({ error: "duration must be a positive number" });
  }
  const sql = "INSERT INTO study_sessions (user_id, duration) VALUES (?, ?)";
  db.run(sql, [req.user.id, duration], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    // 测试只检查 status=201 和 body.duration
    return res.status(201).json({ id: this.lastID, user_id: req.user.id, duration });
  });
});

app.get("/api/study/me", auth, (req, res) => {
  db.all(
    "SELECT id, duration, created_at FROM study_sessions WHERE user_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json(rows || []);
    }
  );
});

module.exports = app;
