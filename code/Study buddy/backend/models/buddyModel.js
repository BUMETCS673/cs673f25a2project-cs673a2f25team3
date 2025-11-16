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

function updateExp(userId, exp, callback) {
  const query = `UPDATE study_buddies SET exp = exp + ? WHERE user_id = ?`;
  db.run(query, [exp, userId], function(err) {
    callback(err);
  });
}

function updateStatus(userId, status, callback) {
  const last_updated = Date.now();
  const query = `UPDATE study_buddies SET status = status + ?, last_updated = ? WHERE user_id = ?`;
  db.run(query, [status, last_updated, userId], function(err) {
    callback(err);
  });
}

function deleteBuddy(userId, callback) {
  const query = `DELETE FROM study_buddies WHERE user_id = ?`;
  db.run(query, [userId], function(err) {
    callback(err);
  });
}

module.exports = { getBuddy, createBuddy, updateExp, updateStatus, deleteBuddy };
