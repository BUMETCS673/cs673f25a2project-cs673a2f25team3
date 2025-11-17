/*
  20% AI
  70% Human
  10% Framework
*/

const express = require("express");
const auth = require("../middleware/auth");
const Buddy = require("../models/buddyModel");

const router = express.Router();
router.use(auth);

router.get("/me", (req, res) => {
  Buddy.getBuddy(req.user.id, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(buddy);
  });
});

router.post("/me", (req, res) => {
  const { name } = req.body;
  Buddy.createBuddy(req.user.id, name, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

router.post("/update", (req, res) => {
  const { name } = req.body;
  Buddy.updateBuddy(req.user.id, name, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

router.post("/exp", (req, res) => {
  const { exp } = req.body;
  Buddy.updateExp(req.user.id, exp, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

router.post("/status", (req, res) => {
  const { status } = req.body;
  Buddy.updateStatus(req.user.id, status, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

router.post("/reset", (req, res) => {
  Buddy.deleteBuddy(req.user.id, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
  });
  Buddy.createBuddy(req.user.id, "Buddy", (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

module.exports = router;
