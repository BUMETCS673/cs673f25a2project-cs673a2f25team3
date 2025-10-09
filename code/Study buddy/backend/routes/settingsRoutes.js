const express = require("express");
const auth = require("../middleware/auth");
const Settings = require("../models/settingsModel");

const router = express.Router();
router.use(auth);

// GET /api/settings/me
router.get("/me", (req, res) => {
  Settings.getSettings(req.user.id, (err, settings) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(settings);
  });
});

// POST /api/settings/me
router.post("/me", (req, res) => {
  const { theme, daily_goal } = req.body;
  const validThemes = ["light", "dark"];
  if (!validThemes.includes(theme) || typeof daily_goal !== "number" || daily_goal < 0) {
    return res.status(400).json({ error: "Invalid settings data" });
  }
  Settings.updateSettings(req.user.id, theme, daily_goal, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
});

// ✅ PUT /api/settings/me
router.put("/me", (req, res) => {
  const { theme, daily_goal } = req.body;
  const validThemes = ["light", "dark"];
  if (!validThemes.includes(theme) || typeof daily_goal !== "number" || daily_goal < 0) {
    return res.status(400).json({ error: "Invalid settings data" });
  }
  Settings.updateSettings(req.user.id, theme, daily_goal, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(updated);
  });
});

module.exports = router;
