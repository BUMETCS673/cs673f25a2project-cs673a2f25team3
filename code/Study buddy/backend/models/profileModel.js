const db = require("../db/db");

/**
 * Retrieve a user's profile from the database by userId.
 *
 * @param {number} userId - The ID of the user whose profile to fetch
 * @param {function} callback - Callback function (err, row)
 */
function getProfile(userId, callback) {
  db.get("SELECT * FROM profiles WHERE user_id = ?", [userId], (err, row) => {
    callback(err, row);
  });
}


/**
 * Insert or update a user's profile in the database.
 *
 * - If a profile with the same user_id exists, it will be updated.
 * - If no profile exists, a new record will be inserted.
 *
 * @param {number} userId - The ID of the user
 * @param {string} bio - User's bio text
 * @param {string} avatarUrl - URL of the user's avatar image
 * @param {function} callback - Callback function (err, updatedProfile)
 */
function updateProfile(userId, bio, avatarUrl, callback) {
  const query = `
    INSERT INTO profiles (user_id, bio, avatar_url)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET bio = ?, avatar_url = ?`;
  db.run(query, [userId, bio, avatarUrl, bio, avatarUrl], function (err) {
    callback(err, { user_id: userId, bio, avatar_url: avatarUrl });
  });
}

module.exports = { getProfile, updateProfile };
