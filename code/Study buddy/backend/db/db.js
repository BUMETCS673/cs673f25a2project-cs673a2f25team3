/*
  100% Human
*/

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

if (dbPath !== ":memory:") {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

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

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON;");

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')*1000)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      bio TEXT,
      avatar_url TEXT,
      updated_at INTEGER DEFAULT (strftime('%s','now')*1000),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      user_id INTEGER PRIMARY KEY,
      theme TEXT DEFAULT 'light',
      daily_goal INTEGER DEFAULT 60,
      updated_at INTEGER DEFAULT (strftime('%s','now')*1000),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS buddies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      name TEXT NOT NULL,
      energy INTEGER NOT NULL DEFAULT 100,
      status INTEGER NOT NULL DEFAULT 4,
      last_update_ms INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // View for compatibility
  db.run(`DROP VIEW IF EXISTS study_buddies;`);
  db.run(`
    CREATE VIEW study_buddies AS
    SELECT id, user_id, name, energy, status, last_update_ms FROM buddies;
  `);

  // Triggers to allow writing to the view
  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_study_buddies_update
    INSTEAD OF UPDATE ON study_buddies
    BEGIN
      UPDATE buddies
      SET user_id = NEW.user_id,
          name = NEW.name,
          energy = NEW.energy,
          status = NEW.status,
          last_update_ms = NEW.last_update_ms
      WHERE id = OLD.id;
    END;
  `);

  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_study_buddies_insert
    INSTEAD OF INSERT ON study_buddies
    BEGIN
      INSERT INTO buddies (user_id, name, energy, status, last_update_ms)
      VALUES (NEW.user_id, NEW.name, NEW.energy, NEW.status, NEW.last_update_ms);
    END;
  `);

  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_study_buddies_delete
    INSTEAD OF DELETE ON study_buddies
    BEGIN
      DELETE FROM buddies WHERE id = OLD.id;
    END;
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS study_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s','now')*1000),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
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
