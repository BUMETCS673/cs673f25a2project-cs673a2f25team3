/*
  20% AI
  80% Human
*/

const db = require("../db/db");

/**
 * Get multiple study statistics for a user in one query.
 * Returns:
 *   totalDuration: total minutes/seconds of all sessions
 *   totalSessions: total count of sessions
 *   weeklyDuration: total duration for current week
 *   monthlyDuration: total duration for current month
 * 
 * Note for frontend: if totalDuration === 0 or recentSessions.length === 0,
 * display "Start your first study session!" to motivate the user.
 */
function getStats(userId, callback) {
  const query = `
    SELECT 
      COALESCE(SUM(duration), 0) AS totalDuration,
      COUNT(*) AS totalSessions,
      COALESCE(SUM(CASE 
        WHEN STRFTIME('%W', start_time) = STRFTIME('%W', 'now')
         AND STRFTIME('%Y', start_time) = STRFTIME('%Y', 'now')
        THEN duration ELSE 0 END), 0) AS weeklyDuration,
      COALESCE(SUM(CASE 
        WHEN STRFTIME('%m', start_time) = STRFTIME('%m', 'now')
         AND STRFTIME('%Y', start_time) = STRFTIME('%Y', 'now')
        THEN duration ELSE 0 END), 0) AS monthlyDuration
    FROM study_sessions
    WHERE user_id = ?
  `;

  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, {
      totalDuration: row.totalDuration || 0,
      totalSessions: row.totalSessions || 0,
      weeklyDuration: row.weeklyDuration || 0,
      monthlyDuration: row.monthlyDuration || 0,
    });
  });
}

/**
 * Get the most recent 10 study sessions for a user.
 * Returns empty array if user has no sessions.
 * Frontend should display "Start your first study session!" if array is empty.
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
