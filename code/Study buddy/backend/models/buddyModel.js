// models/buddyModel.js
// Works with SQLite3 + the 'study_buddies' view defined in db.js (with triggers).

/*
  100% HUman
*/

const db = require('../db/db');

function computeStatus(energy) {
  if (energy <= 0) return 0;     // exhausted
  if (energy < 20) return 1;     // tired
  if (energy < 50) return 2;     // meh
  if (energy < 80) return 3;     // not happy
  return 4;                      // energetic
}

const Buddy = {
  // ---- Queries ----
  getBuddy(userId, cb) {
    const sql = `SELECT id, user_id AS userId, name, energy, status, last_update_ms AS lastUpdate
                 FROM study_buddies WHERE user_id = ? LIMIT 1`;
    db.get(sql, [userId], (err, row) => cb(err, row));
  },

  findByUserId(userId, cb) {
    // alias of getBuddy to satisfy various callers
    Buddy.getBuddy(userId, cb);
  },

  getByUserId(userId, cb) {
    Buddy.getBuddy(userId, cb);
  },

  // ---- Mutations ----
  createBuddy(userId, name, cb) {
    // use the updatable view; triggers in db.js will write to 'buddies'
    const sql = `INSERT INTO study_buddies (user_id, name, energy, status, last_update_ms)
                 VALUES (?, ?, 100, 4, (strftime('%s','now')*1000))`;
    db.run(sql, [userId, name], function (err) {
      if (err) return cb(err);
      Buddy.getBuddy(userId, cb);
    });
  },

  create({ userId, name, energy = 100, status = 4 }, cb) {
    const sql = `INSERT INTO study_buddies (user_id, name, energy, status, last_update_ms)
                 VALUES (?, ?, ?, ?, (strftime('%s','now')*1000))`;
    db.run(sql, [userId, name, energy, status], function (err) {
      if (err) return cb(err);
      Buddy.getBuddy(userId, cb);
    });
  },

  updateEnergy(userId, newEnergy, cb) {
    const newStatus = computeStatus(newEnergy);
    const sql = `UPDATE study_buddies
                 SET energy = ?, status = ?, last_update_ms = (strftime('%s','now')*1000)
                 WHERE user_id = ?`;
    db.run(sql, [newEnergy, newStatus, userId], (err) => cb(err));
  },

  // helper for GET route to decay by elapsed hours
  decayByElapsedHours(userId, cb) {
    Buddy.getBuddy(userId, (err, buddy) => {
      if (err) return cb(err);
      if (!buddy) return cb(null, null);
      const now = Date.now();
      const elapsedMs = Math.max(0, now - (buddy.lastUpdate || buddy.last_update_ms || 0));
      const hours = Math.floor(elapsedMs / 3600000);
      if (hours <= 0) return cb(null, buddy); // no change

      const newEnergy = Math.max(0, buddy.energy - hours);
      Buddy.updateEnergy(userId, newEnergy, (err2) => {
        if (err2) return cb(err2);
        Buddy.getBuddy(userId, cb);
      });
    });
  },
};

module.exports = Buddy;
