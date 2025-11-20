/*
  100% human
*/

const db = require("../db/db");
const bcrypt = require("bcrypt");


/**
 * Create a new user in the database.
 *
 * - Passwords are securely hashed with bcrypt before being stored.
 * - The new user's ID and username are returned in the callback.
 *
 * @param {string} username - The chosen username
 * @param {string} password - The plain-text password (will be hashed before storing)
 * @param {function} callback - Callback function (err, newUser)
 */
function createUser(username, password, callback) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.run(query, [username, hashedPassword], function (err) {
    callback(err, { id: this.lastID, username });
  });
}


/**
 * Fetch a user by their username.
 *
 * - Used for login/authentication to find a user and compare passwords.
 *
 * @param {string} username - The username to search for
 * @param {function} callback - Callback function (err, userRow)
 */
function getUserByUsername(username, callback) {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    callback(err, row);
  });
}

module.exports = { createUser, getUserByUsername };
