/*
  90% Human
  10% framework
*/

const db = require("../../db/db");
const Stats = require("../../models/statsModel");

let userId;

beforeAll((done) => {
  db.serialize(() => {
    // clear db
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_sessions");

    // insert test user
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["testuser", "123456"],
      function (err) {
        if (err) return done(err);
        userId = this.lastID;
        done();
      }
    );
  });
});

describe("Stats Model Integration Tests", () => {

  test("should return 0 stats and empty recentSessions for a new user", (done) => {
    Stats.getStats(userId, (err, stats) => {
      expect(err).toBeNull();
      expect(stats.totalDuration).toBe(0);
      expect(stats.totalSessions).toBe(0);
      expect(stats.weeklyDuration).toBe(0);
      expect(stats.monthlyDuration).toBe(0);

      Stats.getRecentSessions(userId, (err, recent) => {
        expect(err).toBeNull();
        expect(Array.isArray(recent)).toBe(true);
        expect(recent.length).toBe(0);
        done();
      });
    });
  });

  test("should return correct stats after inserting sessions", (done) => {
    const now = new Date().toISOString();
    const insert = db.prepare(`
      INSERT INTO study_sessions (user_id, duration, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);

    // insert two sessions
    insert.run(userId, 30, now, now); // 30
    insert.run(userId, 45, now, now); // 45
    insert.finalize(() => {

      Stats.getStats(userId, (err, stats) => {
        expect(err).toBeNull();
        expect(stats.totalDuration).toBe(75);
        expect(stats.totalSessions).toBe(2);
        expect(stats.weeklyDuration).toBe(75);
        expect(stats.monthlyDuration).toBe(75);

        Stats.getRecentSessions(userId, (err, recent) => {
          expect(err).toBeNull();
          expect(Array.isArray(recent)).toBe(true);
          expect(recent.length).toBe(2);
          expect(recent[0]).toHaveProperty("duration");
          done();
        });
      });
    });
  });

  test("should correctly handle more than 10 sessions for recentSessions", (done) => {
    const insert = db.prepare(`
      INSERT INTO study_sessions (user_id, duration, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);

    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const time = new Date(now.getTime() + i * 60000).toISOString(); // one per minute
      insert.run(userId, 10 + i, time, time);
    }
    insert.finalize(() => {
      Stats.getRecentSessions(userId, (err, recent) => {
        expect(err).toBeNull();
        expect(Array.isArray(recent)).toBe(true);
        expect(recent.length).toBe(10); // return latest 10
        done();
      });
    });
  });

});

afterAll(() => db.close());
