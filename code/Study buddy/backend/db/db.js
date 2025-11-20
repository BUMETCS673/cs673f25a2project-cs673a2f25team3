/*
  100% Human
*/

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Determine if running under test mode
const isTest = process.env.NODE_ENV === "test";

// Use in-memory DB for tests; persistent file DB otherwise
const resolvedDbPath = isTest
  ? (process.env.SQLITE_DB || ":memory:")
  : path.resolve(__dirname, "./database.sqlite");

// Main database connection
const db = new sqlite3.Database(resolvedDbPath, (err) => {
  if (err) console.error("❌ DB Connection Error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// Initialize tables
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
      goal INTEGER DEFAULT 300,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Handle legacy column rename (ignore if not exists)
  db.run(`
    ALTER TABLE settings RENAME COLUMN daily_goal TO goal
  `, () => {});

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
    CREATE TABLE IF NOT EXISTS study_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL UNIQUE,
      target_minutes INTEGER NOT NULL,
      elapsed_seconds INTEGER NOT NULL,
      session_start TIMESTAMP NOT NULL,
      status TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
      name TEXT NOT NULL DEFAULT 'Buddy',
      energy INTEGER DEFAULT 100,
      exp INTEGER DEFAULT 0,
      status INTEGER DEFAULT 4,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  // Add last_updated column if missing
  db.run(`
    ALTER TABLE study_buddies ADD COLUMN last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  `, () => {});
});

// Helper to reset all tables (used in tests)
db.reset = function reset(cb) {
  db.exec(
    `
      DELETE FROM study_sessions;
      DELETE FROM study_progress;
      DELETE FROM study_buddies;
      DELETE FROM settings;
      DELETE FROM profiles;
      DELETE FROM users;
    `,
    cb
  );
};

// Async wrapper to close DB
db.closeAsync = function closeAsync() {
  return new Promise((resolve, reject) => {
    db.close((err) => (err ? reject(err) : resolve()));
  });
};

module.exports = db;
