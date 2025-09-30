const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  User.createUser(username, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json(user);
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.getUserByUsername(username, (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ message: "Login successful", user_id: user.id });
  });
});

module.exports = router;
