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

/**
 * @swagger
 * tags:
 *   name: Buddies
 *   description: User study buddy management
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/buddies/me:
 *   get:
 *     summary: Get the study buddy of the logged-in user
 *     tags: [Buddies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buddy retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 type:
 *                   type: string
 *                 exp:
 *                   type: integer
 *                 status:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/me", (req, res) => {
  Buddy.getBuddy(req.user.id, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(buddy);
  });
});

/**
 * @swagger
 * /api/buddies/me:
 *   post:
 *     summary: Create a new study buddy for the logged-in user
 *     tags: [Buddies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Buddy"
 *     responses:
 *       201:
 *         description: Buddy created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/me", (req, res) => {
  const { name } = req.body;
  Buddy.createBuddy(req.user.id, name, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

/**
 * @swagger
 * /api/buddies/update:
 *   post:
 *     summary: Update the study buddy's name or type
 *     tags: [Buddies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Buddy updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/update", (req, res) => {
  const { name, type } = req.body;
  Buddy.updateBuddy(req.user.id, name, type, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

/**
 * @swagger
 * /api/buddies/exp:
 *   post:
 *     summary: Add experience points to the user's buddy
 *     tags: [Buddies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exp:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Buddy experience updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/exp", (req, res) => {
  const { exp } = req.body;
  Buddy.updateExp(req.user.id, exp, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

/**
 * @swagger
 * /api/buddies/status:
 *   post:
 *     summary: Update the buddy's status
 *     tags: [Buddies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Buddy status updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/status", (req, res) => {
  const { status } = req.body;
  Buddy.updateStatus(req.user.id, status, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json(buddy);
  });
});

/**
 * @swagger
 * /api/buddies/reset:
 *   post:
 *     summary: Reset the user's buddy to default
 *     tags: [Buddies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Buddy reset successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/reset", (req, res) => {
  Buddy.deleteBuddy(req.user.id, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    
    Buddy.createBuddy(req.user.id, "Buddy", (err, buddy) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(buddy);
    });
  });
});

module.exports = router;
