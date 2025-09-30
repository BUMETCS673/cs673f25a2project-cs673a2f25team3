const express = require("express");
const Study = require("../models/studyModel");
const router = express.Router();

router.post("/:userId", (req, res) => {
  const { duration } = req.body;
  Study.addSession(req.params.userId, duration, (err, session) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(session);
  });
});

router.get("/:userId", (req, res) => {
  Study.getSessions(req.params.userId, (err, sessions) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(sessions);
  });
});

module.exports = router;
