const express = require("express");
require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const db = require("../db/db");

const router = express.Router();

/*
  20% AI
  70% Human
  10% Framweork
*/

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User registration, login, and profile
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *       example:
 *         id: 1
 *         username: "johndoe"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 *         token:
 *           type: string
 *       example:
 *         message: "Login successful"
 *         user:
 *           id: 1
 *           username: "johndoe"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 *             example:
 *               username: "johndoe"
 *               password: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *               example:
 *                 message: "User registered successfully"
 *                 user:
 *                   id: 1
 *                   username: "johndoe"
 *       400:
 *         description: Bad request, e.g., missing username/password
 *         content:
 *           application/json:
 *             example:
 *               error: "Username and password are required"
 */
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  User.createUser(username, password, (err, user) => {
    if (err) return res.status(400).json({ error: err.message });

    db.run("INSERT INTO profiles (user_id) VALUES (?)", [user.id]);
    db.run("INSERT INTO settings (user_id) VALUES (?)", [user.id]);

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
 *             example:
 *               username: "johndoe"
 *               password: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: User not found or bad request
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid credentials"
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 */
router.get("/me", auth, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username
  });
});

module.exports = router;
