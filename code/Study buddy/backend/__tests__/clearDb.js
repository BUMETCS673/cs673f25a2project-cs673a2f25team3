const db = require("../../db/db");

function clearAll() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("PRAGMA foreign_keys = OFF;");
      db.run("DELETE FROM study_sessions");
      db.run("DELETE FROM buddies");
      db.run("DELETE FROM settings");
      db.run("DELETE FROM profiles");
      db.run("DELETE FROM users", (err) => {
        if (err) return reject(err);
        db.run("PRAGMA foreign_keys = ON;", (err2) => (err2 ? reject(err2) : resolve()));
      });
    });
  });
}

module.exports = { clearAll };
