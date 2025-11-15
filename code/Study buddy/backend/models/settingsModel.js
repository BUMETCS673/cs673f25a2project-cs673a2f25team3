/*
  20% AI
  80% human
*/

const db = require("../db/db");

/**
 * Retrieve a user's settings from the database by userId.
 *
 * @param {number} userId - The ID of the user whose settings to fetch
 * @param {function} callback - Callback function (err, row)
 */
function getSettings(userId, callback) {
  db.get("SELECT * FROM settings WHERE user_id = ?", [userId], (err, row) => {
    callback(err, row);
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
 * @param {number} goal - The study goal (e.g., in ms)
 * @param {function} callback - Callback function (err, updatedSettings)
 */
function updateSettings(userId, theme, goal, callback) {
  const query = `
    INSERT INTO settings (user_id, theme, goal)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET theme = ?, goal = ?`;
  db.run(query, [userId, theme, goal, theme, goal], function (err) {
    callback(err, { user_id: userId, theme, goal: goal });
  });
}

module.exports = { getSettings, updateSettings };
