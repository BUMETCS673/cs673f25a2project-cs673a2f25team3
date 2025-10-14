const db = require("../db/db");

/*
  100% HUman
*/

const Study = {
  // Add study session
  addSession(user_id, duration, start_time, end_time, callback) {
    const sql = `
      INSERT INTO study_sessions (user_id, duration, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [user_id, duration, start_time, end_time], function (err) {
      if (err) return callback(err);
      callback(null, {
        id: this.lastID,
        user_id,
        duration,
        start_time,
        end_time,
      });
    });
  },

  // Get all sessions
  getSessions(user_id, callback) {
    const sql = `
      SELECT * FROM study_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    db.all(sql, [user_id], callback);
  },

  // Get latest session
  getLatestSession(user_id, callback) {
    const sql = `
      SELECT * FROM study_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    db.get(sql, [user_id], callback);
  },
};

module.exports = Study;
