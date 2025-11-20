/*
  Study Buddy - user routes
  Fixed register: safe default buddy insert
*/
console.log("USING THIS USER ROUTES FILE >>>>>>>>>");
console.log(require("fs").readFileSync(__filename, "utf8"));
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

    // create profile + settings (safe)
    db.run("INSERT OR IGNORE INTO profiles (user_id) VALUES (?)", [user.id]);
    db.run("INSERT OR IGNORE INTO settings (user_id) VALUES (?)", [user.id]);

    // create default buddy (only once)
    db.run(
      "INSERT OR IGNORE INTO study_buddies (user_id, name) VALUES (?, ?)",
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

module.exports = router;
