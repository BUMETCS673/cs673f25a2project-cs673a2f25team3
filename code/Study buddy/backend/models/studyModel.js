const db = require("../db/db");


/**
 * Add a new study session for a user.
 *
 * @param {number} userId - The ID of the user
 * @param {number} duration - Length of the study session (e.g., in minutes)
 * @param {function} callback - Callback function (err, newSession)
 */
function addSession(userId, duration, callback) {
  const query = "INSERT INTO study_sessions (user_id, duration) VALUES (?, ?)";
  db.run(query, [userId, duration], function (err) {
    callback(err, { id: this.lastID, user_id: userId, duration });
  });
}


/**
 * Retrieve all study sessions for a user, ordered by creation time (newest first).
 *
 * @param {number} userId - The ID of the user
 * @param {function} callback - Callback function (err, rows)
 */
function getSessions(userId, callback) {
  const query = "SELECT * FROM study_sessions WHERE user_id = ? ORDER BY created_at DESC";
  db.all(query, [userId], (err, rows) => {
    callback(err, rows);
  });
}

module.exports = { addSession, getSessions };
