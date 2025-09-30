const express = require("express");
const auth = require("../middleware/auth");
const Study = require("../models/studyModel");

const router = express.Router();
router.use(auth);

// POST /api/study/me  Add study history
router.post("/me", (req, res) => {
  const { duration } = req.body;
  Study.addSession(req.user.id, duration, (err, session) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(session);
  });
});

// GET /api/study/me  Get study history
router.get("/me", (req, res) => {
  Study.getSessions(req.user.id, (err, sessions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(sessions);
  });
});

module.exports = router;
