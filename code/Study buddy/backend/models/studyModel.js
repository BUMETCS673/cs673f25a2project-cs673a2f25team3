const db = require("../db/db");

function addSession(userId, duration, callback) {
  const query = "INSERT INTO study_sessions (user_id, duration) VALUES (?, ?)";
  db.run(query, [userId, duration], function (err) {
    callback(err, { id: this.lastID, user_id: userId, duration });
  });
}

function getSessions(userId, callback) {
  const query = "SELECT * FROM study_sessions WHERE user_id = ? ORDER BY created_at DESC";
  db.all(query, [userId], (err, rows) => {
    callback(err, rows);
  });
}

module.exports = { addSession, getSessions };
