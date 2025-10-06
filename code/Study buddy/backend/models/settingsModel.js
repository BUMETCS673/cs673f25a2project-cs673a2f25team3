const db = require("../db/db");

/**
 * Retrieve a user's settings from the database by userId.
 *
 * @param {number} userId - The ID of the user whose settings to fetch
 * @param {function} callback - Callback function (err, row)
 */
function getSettings(userId, callback) {
  db.get("SELECT * FROM settings WHERE user_id = ?", [userId], (err, row) => {
    if (err) return callback(err);
    callback(null, row || null);
  });
}


/**
 * Insert or update a user's settings in the database.
 *
 * - If settings for the given user_id exist, update them.
 * - If no settings exist, insert a new row.
 *
 * @param {number} userId - The ID of the user
 * @param {string} theme - The selected theme (e.g., "light" or "dark")
 * @param {number} dailyGoal - The daily study goal (e.g., in minutes)
 * @param {function} callback - Callback function (err, updatedSettings)
 */
function updateSettings(userId, theme, dailyGoal, callback) {
  const query = `
    INSERT INTO settings (user_id, theme, daily_goal)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET theme = ?, daily_goal = ?`;
  db.run(query, [userId, theme, dailyGoal, theme, dailyGoal], function (err) {
    callback(err, { user_id: userId, theme, daily_goal: dailyGoal });
  });
}

module.exports = { getSettings, updateSettings };
