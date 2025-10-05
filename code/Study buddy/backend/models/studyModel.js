const db = require("../db/db");

/**
 * Add a new study session for a user.
 *
 * @param {number} userId - The ID of the user
 * @param {number} duration - Length of the study session (e.g., in minutes)
 * @param {string} [startTime] - Optional ISO start time
 * @param {string} [endTime] - Optional ISO end time
 * @param {function} callback - Callback function (err, newSession)
 */
function addSession(userId, duration, startTime, endTime, callback) {
  // ✅ Default values if not provided
  const start = startTime || new Date().toISOString();
  const end =
    endTime || new Date(Date.now() + duration * 60000).toISOString();

  const query = `
    INSERT INTO study_sessions (user_id, duration, start_time, end_time)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [userId, duration, start, end], function (err) {
    if (err) {
      console.error("❌ addSession error:", err);
      return callback(err);
    }
    callback(null, {
      id: this.lastID,
      user_id: userId,
      duration,
      start_time: start,
      end_time: end,
    });
  });
}

/**
 * Retrieve all study sessions for a user, ordered by creation time (newest first).
 *
 * @param {number} userId - The ID of the user
 * @param {function} callback - Callback function (err, rows)
 */
function getSessions(userId, callback) {
  const query =
    "SELECT * FROM study_sessions WHERE user_id = ? ORDER BY created_at DESC";
  db.all(query, [userId], (err, rows) => {
    callback(err, rows);
  });
}

module.exports = { addSession, getSessions };
