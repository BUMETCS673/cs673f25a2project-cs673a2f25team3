const express = require("express");
const Profile = require("../models/profileModel");
const router = express.Router();

router.get("/:userId", (req, res) => {
  Profile.getProfile(req.params.userId, (err, profile) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(profile);
  });
});

router.post("/:userId", (req, res) => {
  const { bio, avatar_url } = req.body;
  Profile.updateProfile(req.params.userId, bio, avatar_url, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
});

module.exports = router;
