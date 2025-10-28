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

// shim
function updateExp(userId, exp, callback) {
  const last_updated = Date.now();
  const query = `UPDATE study_buddies SET exp = ? WHERE user_id = ?`;
  db.run(query, [exp, userId], function(err) {
    callback(err);
  });
}

// shim
function updateStatus(userId, status, callback) {
  const query = `UPDATE study_buddies SET status = ? WHERE user_id = ?`;
  db.run(query, [status, userId], function(err) {
    callback(err);
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

module.exports = { getBuddy, createBuddy, updateEnergy, getStatusByEnergy, updateExp, updateStatus };
