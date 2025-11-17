/*
  20% AI
  70% Human
  10% Framework
*/

require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const db = require("../db/db");

const router = express.Router();

// Register User
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  User.createUser(username, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });

    // Auto create default profile and settings
    db.run("INSERT INTO profiles (user_id) VALUES (?)", [user.id]);
    db.run("INSERT INTO settings (user_id) VALUES (?)", [user.id]);

    // Auto create default buddy in buddies table
    db.run(
      "INSERT INTO buddies (user_id, name) VALUES (?, ?)",
      [user.id, "Buddy"],
      (err) => {
        if (err) {
          console.error("Error inserting default buddy:", err.message);
        }
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username },
    });
  });
});

// keep your other routes below if you want (login, me, etc.)
// For now, only register is included.

module.exports = router;
