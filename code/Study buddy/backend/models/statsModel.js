/*
  20% AI
  80% Human
*/

const db = require("../db/db");

/**
 * Get multiple study statistics for a user in one query.
 * Returns:
 *   totalDuration: total minutes of all valid sessions
 *   totalSessions: total count of valid sessions
 *   monthlyDuration: total duration for current month
 */
function getStats(userId, callback) {
  const query = `
    SELECT 
      COALESCE(SUM(CASE 
        WHEN duration > 0 AND start_time <= end_time THEN duration ELSE 0 END), 0) AS totalDuration,
      COUNT(CASE 
        WHEN duration > 0 AND start_time <= end_time THEN 1 ELSE NULL END) AS totalSessions,
      COALESCE(SUM(CASE
        WHEN duration > 0 AND start_time <= end_time
         AND STRFTIME('%Y', start_time) = STRFTIME('%Y', 'now')
         AND STRFTIME('%m', start_time) = STRFTIME('%m', 'now')
        THEN duration ELSE 0 END), 0) AS monthlyDuration
    FROM study_sessions
    WHERE user_id = ?
  `;

  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, {
      totalDuration: row.totalDuration || 0,
      totalSessions: row.totalSessions || 0,
      monthlyDuration: row.monthlyDuration || 0,
    });
  });
}

/**
 * Get the most recent 10 study sessions for a user.
 */
function getRecentSessions(userId, callback) {
  const query = `
    SELECT id, duration, start_time, end_time, created_at
    FROM study_sessions
    WHERE user_id = ?
    ORDER BY start_time DESC
    LIMIT 10
  `;
  db.all(query, [userId], (err, rows) => {
    callback(err, rows || []);
  });
}

module.exports = {
  getStats,
  getRecentSessions,
};
