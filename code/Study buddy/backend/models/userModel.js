const db = require("../db/db");
const bcrypt = require("bcrypt");

/*
  100% HUman
*/

/**
 * Create a new user in the database.
 */
function createUser(username, password, callback) {
  const hashed = bcrypt.hashSync(password, 10);
  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;
  db.run(sql, [username, hashed], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, username });
  });
}

/**
 * Fetch a user by their username.
 */
function getUserByUsername(username, callback) {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    callback(err, row);
  });
}

module.exports = { createUser, getUserByUsername };
