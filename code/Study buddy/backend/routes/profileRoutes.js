const express = require("express");
const auth = require("../middleware/auth");
const Profile = require("../models/profileModel");

const router = express.Router();
router.use(auth);

// GET /api/profiles/me
router.get("/me", (req, res) => {
  Profile.getProfile(req.user.id, (err, profile) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(profile);
  });
});

// POST /api/profiles/me
router.post("/me", (req, res) => {
  const { bio, avatar_url } = req.body;
  if (!bio || !avatar_url) {
    return res.status(400).json({ error: "Bio and avatar_url cannot be empty" });
  }
  Profile.updateProfile(req.user.id, bio, avatar_url, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(updated);
  });
});

// ✅ PUT /api/profiles/me
router.put("/me", (req, res) => {
  const { bio, avatar_url } = req.body;
  if (!bio || !avatar_url) {
    return res.status(400).json({ error: "Bio and avatar_url cannot be empty" });
  }
  Profile.updateProfile(req.user.id, bio, avatar_url, (err, updated) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(updated);
  });
});

module.exports = router;
