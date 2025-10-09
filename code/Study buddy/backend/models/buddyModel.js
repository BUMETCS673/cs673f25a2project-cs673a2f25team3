const db = require("../db/db");

function getStatusByEnergy(energy) {
  if (energy >= 75) return 4;
  if (energy >= 50) return 3;
  if (energy >= 25) return 2;
  if (energy >= 1)  return 1;
  return 0;
}

function getBuddy(userId, callback) {
  db.get("SELECT * FROM buddies WHERE user_id = ?", [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row || null);
  });
}

function createBuddy(userId, name, callback) {
  const now = Date.now();
  const sql = `
    INSERT INTO buddies (user_id, name, energy, status, last_update_ms)
    VALUES (?, ?, 100, 4, ?)
    ON CONFLICT(user_id) DO UPDATE SET name = excluded.name
  `;
  db.run(sql, [userId, name, now], function (err) {
    if (err) return callback(err);
    getBuddy(userId, callback);
  });
}

function saveEnergy(userId, energy, callback) {
  const clamped = Math.max(0, Math.min(100, energy));
  const status = getStatusByEnergy(clamped);
  const now = Date.now();
  db.run(
    "UPDATE buddies SET energy = ?, status = ?, last_update_ms = ? WHERE user_id = ?",
    [clamped, status, now, userId],
    function (err) {
      if (err) return callback(err);
      getBuddy(userId, callback);
    }
  );
}

function applyEnergyDecay(userId, callback) {
  getBuddy(userId, (err, buddy) => {
    if (err) return callback(err);
    if (!buddy) return callback(null, null);
    const now = Date.now();
    const last = Number(buddy.last_update_ms || 0);
    const elapsedHours = Math.floor((now - last) / 3600000);
    if (elapsedHours <= 0) return callback(null, buddy);
    const newEnergy = Math.max(0, buddy.energy - elapsedHours);
    const newStatus = getStatusByEnergy(newEnergy);
    db.run(
      "UPDATE buddies SET energy = ?, status = ?, last_update_ms = ? WHERE user_id = ?",
      [newEnergy, newStatus, now, userId],
      function (uerr) {
        if (uerr) return callback(uerr);
        getBuddy(userId, callback);
      }
    );
  });
}

module.exports = {
  getBuddy,
  createBuddy,
  saveEnergy,
  applyEnergyDecay,
  getStatusByEnergy,
};
