/*
  100% human
*/

const db = require("../db/db");

function getBuddy(userId, callback) {
  db.get("SELECT * FROM study_buddies WHERE user_id = ?", [userId], callback);
}

function createBuddy(userId, name, callback) {
  const query = `INSERT INTO study_buddies (user_id, name) VALUES (?, ?)`;
  db.run(query, [userId, name], function(err) {
    callback(err, { id: this.lastID, user_id: userId, name, energy: 100, exp: 0, status: 4 });
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

function updateBuddy(userId, name, callback) {
  const query = `UPDATE study_buddies SET name = ? WHERE user_id = ?`;
  db.run(query, [name, userId], function(err) {
    callback(err);
  });
}

module.exports = { getBuddy, createBuddy, updateEnergy, getStatusByEnergy, updateBuddy };
