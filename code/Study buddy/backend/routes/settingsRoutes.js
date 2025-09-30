const express = require("express");
const auth = require("../middleware/auth");
const Settings = require("../models/settingsModel");

const router = express.Router();
router.use(auth);

// GET /api/settings/me Get setting data
router.get("/me", (req, res) => {
  Settings.getSettings(req.user.id, (err, settings) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(settings);
  });
});

// POST /api/settings/me Add setting data
router.post("/me", (req, res) => {
  const { theme, daily_goal } = req.body;
  Settings.updateSettings(req.user.id, theme, daily_goal, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
});

module.exports = router;