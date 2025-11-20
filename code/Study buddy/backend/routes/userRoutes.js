/*
  Study Buddy - user routes
  Register: safe default profile/settings/buddy creation
  Login: standard JWT login
*/

require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const db = require("../db/db");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  User.createUser(username, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });

    // Safe profile + settings insert
    db.run("INSERT OR IGNORE INTO profiles (user_id) VALUES (?)", [user.id]);
    db.run("INSERT OR IGNORE INTO settings (user_id) VALUES (?)", [user.id]);

    // Create default buddy ONCE
    db.run(
      "INSERT OR IGNORE INTO study_buddies (user_id, name) VALUES (?, ?)",
      [user.id, "Buddy"]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username },
    });
  });
});

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  User.getUserByUsername(username, (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({
        token,
        user: { id: user.id, username: user.username },
      });
    });
  });
});

module.exports = router;
