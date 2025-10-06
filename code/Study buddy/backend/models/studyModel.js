const db = require("../db/db");

const Study = {
  // 新增学习记录
  addSession(user_id, duration, start_time, end_time, callback) {
    const sql = `
      INSERT INTO study_sessions (user_id, duration, start_time, end_time, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `;
    db.run(sql, [user_id, duration, start_time, end_time], function (err) {
      if (err) return callback(err);
      callback(null, {
        id: this.lastID,
        user_id,
        duration,
        start_time,
        end_time,
      });
    });
  },

  // 获取所有学习记录（按时间降序）
  getSessions(user_id, callback) {
    const sql = `
      SELECT * FROM study_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;
    db.all(sql, [user_id], callback);
  },

  // 获取最新一条学习记录
  getLatestSession(user_id, callback) {
    const sql = `
      SELECT * FROM study_sessions
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    db.get(sql, [user_id], callback);
  },
};

module.exports = Study;
