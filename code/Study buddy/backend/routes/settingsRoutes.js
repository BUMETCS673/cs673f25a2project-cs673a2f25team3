const express = require("express");
const Settings = require("../models/settingsModel");
const router = express.Router();

router.get("/:userId", (req, res) => {
  Settings.getSettings(req.params.userId, (err, settings) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(settings);
  });
});

router.post("/:userId", (req, res) => {
  const { theme, daily_goal } = req.body;
  Settings.updateSettings(req.params.userId, theme, daily_goal, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
});

module.exports = router;
