const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Buddy = require('../models/buddyModel');

/*
  20% AI
  70% Human
  10% Framework
*/

router.use(auth);

/**
 * @swagger
 * tags:
 *   name: Buddy
 *   description: User's virtual buddy management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Buddy:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         name:
 *           type: string
 *         energy:
 *           type: number
 *         level:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         userId: 123
 *         name: "BuddyBot"
 *         energy: 100
 *         level: 5
 *         created_at: "2025-10-14T21:00:00.000Z"
 */

/**
 * @swagger
 * /api/buddy/me:
 *   post:
 *     summary: Create a buddy for the authenticated user
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
 *             example:
 *               name: "BuddyBot"
 *     responses:
 *       201:
 *         description: Buddy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 buddy:
 *                   $ref: '#/components/schemas/Buddy'
 *       400:
 *         description: Invalid input or buddy already exists
 *         content:
 *           application/json:
 *             examples:
 *               invalidName:
 *                 value:
 *                   error: "Invalid buddy name"
 *               exists:
 *                 value:
 *                   error: "Buddy already exists"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
 */
router.post('/me', (req, res) => {
  const { name } = req.body || {};
  const userId = req.user.id;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Invalid buddy name' });
  }

  Buddy.findByUserId(userId, (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existing) {
      return res.status(400).json({ error: 'Buddy already exists' });
    }
    Buddy.create({ userId, name }, (err2, buddy) => {
      if (err2) return res.status(500).json({ error: err2.message });
      return res.status(201).json({ buddy });
    });
  });
});

/**
 * @swagger
 * /api/buddy/me:
 *   get:
 *     summary: Fetch the authenticated user's buddy, applying energy decay
 *     tags: [Buddy]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buddy fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 buddy:
 *                   $ref: '#/components/schemas/Buddy'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: "Unauthorized"
 *       404:
 *         description: Buddy not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Buddy not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error message"
 */
router.get('/me', (req, res) => {
  const userId = req.user.id;
  Buddy.decayByElapsedHours(userId, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!buddy) return res.status(404).json({ error: 'Buddy not found' });
    return res.status(200).json({ buddy });
  });
});

module.exports = router;
