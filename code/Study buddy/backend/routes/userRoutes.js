require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const db = require("../db/db");

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  User.createUser(username, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });

    // Automatically create default profile & settings data 
    db.run("INSERT INTO profiles (user_id) VALUES (?)", [user.id]);
    db.run("INSERT INTO settings (user_id) VALUES (?)", [user.id]);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username }
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  User.getUserByUsername(username, (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
      token
    });
  });
});

// Get registered user data
router.get("/me", auth, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username
  });
});

module.exports = router;
