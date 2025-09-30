const db = require("../db/db");
const bcrypt = require("bcrypt");

function createUser(username, password, callback) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.run(query, [username, hashedPassword], function (err) {
    callback(err, { id: this.lastID, username });
  });
}

function getUserByUsername(username, callback) {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    callback(err, row);
  });
}

module.exports = { createUser, getUserByUsername };
