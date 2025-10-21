/*
  20% AI
  80% Human
*/

const db = require("../db/db");

/**
 * Get total study duration for a user (in minutes or seconds depending on your db)
 */
function getTotalStudyDuration(userId, callback) {
  const query = `
    SELECT SUM(duration) AS totalDuration
    FROM study_sessions
    WHERE user_id = ?
  `;
  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row?.totalDuration || 0);
  });
}

/**
 * Get recent 10 study sessions
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

/**
 * Get total session count for a user
 */
function getTotalSessions(userId, callback) {
  const query = `
    SELECT COUNT(*) AS totalSessions
    FROM study_sessions
    WHERE user_id = ?
  `;
  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row?.totalSessions || 0);
  });
}


/**
 * Get weekly study duration
 * SQLite: %W gives the week number of the year
 */
function getWeeklyStudyDuration(userId, callback) {
  const query = `
    SELECT SUM(duration) AS weeklyDuration
    FROM study_sessions
    WHERE user_id = ?
    AND STRFTIME('%W', start_time) = STRFTIME('%W', 'now')
    AND STRFTIME('%Y', start_time) = STRFTIME('%Y', 'now')
  `;
  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row?.weeklyDuration || 0);
  });
}

/**
 * Get monthly study duration
 */
function getMonthlyStudyDuration(userId, callback) {
  const query = `
    SELECT SUM(duration) AS monthlyDuration
    FROM study_sessions
    WHERE user_id = ?
    AND STRFTIME('%m', start_time) = STRFTIME('%m', 'now')
    AND STRFTIME('%Y', start_time) = STRFTIME('%Y', 'now')
  `;
  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row?.monthlyDuration || 0);
  });
}

module.exports = {
  getTotalStudyDuration,
  getRecentSessions,
  getTotalSessions,
  getWeeklyStudyDuration,
  getMonthlyStudyDuration,
};
