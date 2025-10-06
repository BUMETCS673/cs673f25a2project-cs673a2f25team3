const db = require("../db/db");

function getBuddy(userId, callback) {
  db.get("SELECT * FROM study_buddies WHERE user_id = ?", [userId], callback);
}

function createBuddy(userId, name, callback) {
  const defaultEnergy = 100;
  const defaultStatus = 4;
  const sql = `INSERT INTO study_buddies (user_id, name, energy, status) VALUES (?, ?, ?, ?)`;
  db.run(sql, [userId, name, defaultEnergy, defaultStatus], function(err) {
    if (err) return callback(err);
    callback(null, {
      id: this.lastID,
      user_id: userId,
      name,
      energy: defaultEnergy,
      status: defaultStatus
    });
  });
}

function updateEnergy(userId, energy, callback) {
  const status = getStatusByEnergy(energy);
  const query = `UPDATE study_buddies SET energy = ?, status = ? WHERE user_id = ?`;
  db.run(query, [energy, status, userId], function(err) {
    callback(err);
  });
}

function getStatusByEnergy(energy) {
  if (energy >= 75) return 4;
  if (energy >= 50) return 3;
  if (energy >= 25) return 2;
  if (energy >= 1) return 1;
  return 0;
}

module.exports = { getBuddy, createBuddy, updateEnergy, getStatusByEnergy };
