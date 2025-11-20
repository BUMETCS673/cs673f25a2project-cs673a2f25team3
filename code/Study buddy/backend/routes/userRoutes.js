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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User registration, login, and profile
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request, e.g., missing username/password
 */
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
    db.run("INSERT INTO study_buddies (user_id) VALUES (?)", [user.id]);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, username: user.username }
    });
  });
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *       400:
 *         description: User not found or bad request
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  User.getUserByUsername(username, (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // make sure jwt secret exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env!");
      return res.status(500).json({ error: "Internal server error: JWT secret missing" });
    }

    let token;
    try {
      token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
      );
    } catch (err) {
      console.error("JWT generation failed:", err);
      return res.status(500).json({ error: "Internal server error: JWT generation failed" });
    }

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username },
      token
    });
  });
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current logged-in user info
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
router.get("/me", auth, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username
  });
});

module.exports = router;
