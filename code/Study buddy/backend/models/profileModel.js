const db = require("../db/db");

function getProfile(userId, callback) {
  db.get("SELECT * FROM profiles WHERE user_id = ?", [userId], (err, row) => {
    callback(err, row);
  });
}

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
