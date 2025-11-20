/*
  90% human
  10% AI
*/

const db = require("../db/db");

function getBuddy(userId, callback) {
  db.get("SELECT * FROM study_buddies WHERE user_id = ?", [userId], callback);
}

function createBuddy(userId, name, callback) {
  const query = `INSERT INTO study_buddies (user_id, name) VALUES (?, ?)`;
  db.run(query, [userId, name], function(err) {
    callback(err, { id: this.lastID, user_id: userId, name });
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

  if (status == 0 || !Number.isInteger(status)) {
    return callback("Invalid status update");
  }

  db.get(`SELECT * FROM study_buddies WHERE user_id = ?`, [userId], function(err, buddy) {
    if (err) {
      callback(err);
    } else if (!buddy) {
      callback(new Error("Buddy not found"));
    } else {
      const newStatus = buddy.status + status;
      var finalStatus = newStatus;

      if (newStatus >= 4) {
        finalStatus = 4;
      } else if (newStatus <= 0) {
        finalStatus = 0;
      }

      if (buddy.status == finalStatus) return callback("Status capped");

      db.run(
        `UPDATE study_buddies SET status = ?, last_updated = ? WHERE user_id = ?`,
        [finalStatus, last_updated, userId],
        function(err) {
          callback(err);
        }
      );
    }
  });
}

function updateBuddy(userId, name, type, callback) {
  if (type != "cat" && type != "deer") return callback(new Error("Invalid buddy type selection"));
  const query = `UPDATE study_buddies SET name = ?, type = ? WHERE user_id = ?`;
  db.run(query, [name, type, userId], function(err) {
    callback(err);
  });
}

module.exports = { getBuddy, createBuddy, updateExp, updateStatus, updateBuddy };
