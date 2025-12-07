/*
  80% AI
  15% Human
  5% Framework
*/

const express = require("express");
const auth = require("../middleware/auth");
const Buddy = require("../models/buddyModel");

const router = express.Router();
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Buddy
 *   description: Study buddy management
 */

/**
 * @swagger
 * /api/buddy/me:
 *   get:
 *     summary: Get the study buddy of the logged-in user
 *     tags: [Buddy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buddy data retrieved successfully
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
 *                   enum: [cat, deer]
 *                 exp:
 *                   type: integer
 *                 status:
 *                   type: integer
 *                 last_updated:
 *                   type: string
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
 * /api/buddy/me:
 *   post:
 *     summary: Create a new study buddy for the logged-in user
 *     tags: [Buddy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the buddy
 *     responses:
 *       201:
 *         description: Buddy created successfully
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
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
 * /api/buddy/update:
 *   post:
 *     summary: Update the name and type of the logged-in user's buddy
 *     tags: [Buddy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the buddy
 *               type:
 *                 type: string
 *                 enum: [cat, deer]
 *                 description: Type of the buddy
 *     responses:
 *       201:
 *         description: Buddy updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request (invalid buddy type)
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
 * /api/buddy/exp:
 *   post:
 *     summary: Update the experience points of the logged-in user's buddy
 *     tags: [Buddy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exp
 *             properties:
 *               exp:
 *                 type: integer
 *                 description: Experience points to add (can be positive or negative)
 *     responses:
 *       201:
 *         description: Experience updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
 * /api/buddy/status:
 *   post:
 *     summary: Update the status of the logged-in user's buddy
 *     tags: [Buddy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: integer
 *                 description: Status change value (positive to increase, negative to decrease, capped between 0 and 4)
 *     responses:
 *       201:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request (invalid status value or status capped)
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
 * /api/buddy/reset:
 *   post:
 *     summary: Reset the logged-in user's buddy (delete and create a new default buddy)
 *     tags: [Buddy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Buddy reset successfully
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
 *                   default: "Buddy"
 *       401:
 *         description: Unauthorized (invalid or missing token)
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
