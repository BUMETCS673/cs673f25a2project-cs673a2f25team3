// routes/buddyRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Buddy = require('../models/buddyModel');

// All buddy endpoints require auth
router.use(auth);

// POST /api/buddy/me  -> create buddy for current user
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
      // tests expect { buddy: {...} }
      return res.status(201).json({ buddy });
    });
  });
});

// GET /api/buddy/me  -> fetch buddy for current user, with auto energy decay by elapsed hours
router.get('/me', (req, res) => {
  const userId = req.user.id;
  Buddy.decayByElapsedHours(userId, (err, buddy) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!buddy) return res.status(404).json({ error: 'Buddy not found' });
    return res.status(200).json({ buddy });
  });
});

module.exports = router;
