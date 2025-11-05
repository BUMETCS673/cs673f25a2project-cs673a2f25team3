/*
  60% AI
  40% Human
*/

const db = require("../db/db");

// Save or update the latest snapshot of the user's study timer.
function upsertProgress(
  userId,
  targetMinutes,
  elapsedSeconds,
  sessionStart,
  status,
  callback
) {
  const query = `
    INSERT INTO study_progress (user_id, target_minutes, elapsed_seconds, session_start, status, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      target_minutes = excluded.target_minutes,
      elapsed_seconds = excluded.elapsed_seconds,
      session_start = excluded.session_start,
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
  `;

  db.run(
    query,
    [userId, targetMinutes, elapsedSeconds, sessionStart, status],
    (err) => {
      if (err) return callback(err);
      getProgress(userId, callback);
    }
  );
}

// Fetch any active snapshot so the frontend can rehydrate the timer.
function getProgress(userId, callback) {
  const query = `
    SELECT user_id, target_minutes, elapsed_seconds, session_start, status, updated_at
    FROM study_progress
    WHERE user_id = ?
  `;

  db.get(query, [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row || null);
  });
}

// Remove the snapshot when the session is finished or discarded.
function clearProgress(userId, callback) {
  const query = `DELETE FROM study_progress WHERE user_id = ?`;
  db.run(query, [userId], (err) => {
    if (err) return callback(err);
    callback(null);
  });
}

module.exports = { upsertProgress, getProgress, clearProgress };
