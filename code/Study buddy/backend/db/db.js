/*
  100% Human
*/

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { Z_HUFFMAN_ONLY } = require("zlib");

// added in for testing
const isTest = process.env.NODE_ENV === "test";

// For tests: default to in-memory. You can override with SQLITE_DB=<path>.
const resolvedDbPath = isTest
  ? (process.env.SQLITE_DB || ":memory:")
  : path.resolve(__dirname, "./database.sqlite");

const dbPath = path.resolve(__dirname, "./database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ DB Connection Error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// initializing tables (make sure userId is unique)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      theme TEXT DEFAULT 'light',
      goal INTEGER DEFAULT 18000000,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    ALTER TABLE settings RENAME COLUMN daily_goal TO goal
  `, (err) => {
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      bio TEXT,
      avatar_url TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS study_buddies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      name TEXT NOT NULL,
      energy INTEGER DEFAULT 100,
      exp INTEGER DEFAULT 0,
      status INTEGER DEFAULT 4,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `)
});


db.reset = function reset(cb) {
  db.exec(
    `
      DELETE FROM study_sessions;
      DELETE FROM study_buddies;
      DELETE FROM settings;
      DELETE FROM profiles;
      DELETE FROM users;
    `,
    cb
  );
};

db.closeAsync = function closeAsync() {
  return new Promise((resolve, reject) => {
    db.close((err) => (err ? reject(err) : resolve()));
  });
};

module.exports = db;
