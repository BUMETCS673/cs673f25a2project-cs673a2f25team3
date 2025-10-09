const express = require("express");
const auth = require("../middleware/auth");
const Buddy = require("../models/buddyModel");

const router = express.Router();
router.use(auth);

router.post("/me", (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required" });
  }
  Buddy.createBuddy(req.user.id, name, (err, buddy) => {
    if (err) {
      if (err.message && err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Buddy already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ buddy });
  });
});

router.get("/me", (req, res) => {
  Buddy.applyEnergyDecay(req.user.id, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!buddy) return res.status(404).json({ error: "Buddy not found" });
    res.status(200).json({ buddy });
  });
});

module.exports = router;
