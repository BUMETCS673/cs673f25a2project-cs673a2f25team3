const db = require("../db/db");

function getSettings(userId, callback) {
  db.get("SELECT * FROM settings WHERE user_id = ?", [userId], (err, row) => {
    callback(err, row);
  });
}

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
