/*
  90% Human
  10% framework
*/

const db = require("../../db/db");
const Stats = require("../../models/statsModel");

let userId;

beforeAll((done) => {
  db.serialize(() => {
    // clear table
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_sessions");

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

  test("should return 0 stats for a new user with no sessions", (done) => {
    Stats.getTotalStudyDuration(userId, (err, totalDuration) => {
      expect(err).toBeNull();
      expect(totalDuration).toBe(0);

      Stats.getTotalSessions(userId, (err, totalSessions) => {
        expect(err).toBeNull();
        expect(totalSessions).toBe(0);

        Stats.getWeeklyStudyDuration(userId, (err, weekly) => {
          expect(err).toBeNull();
          expect(weekly).toBe(0);

          Stats.getMonthlyStudyDuration(userId, (err, monthly) => {
            expect(err).toBeNull();
            expect(monthly).toBe(0);

            Stats.getRecentSessions(userId, (err, sessions) => {
              expect(err).toBeNull();
              expect(Array.isArray(sessions)).toBe(true);
              expect(sessions.length).toBe(0);
              done();
            });
          });
        });
      });
    });
  });

  test("should return correct stats after inserting sessions", (done) => {
    db.serialize(() => {
      const insert = db.prepare(`
        INSERT INTO study_sessions (user_id, duration, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `);

      const now = new Date().toISOString();
      insert.run(userId, 30, now, now); // 30 mins
      insert.run(userId, 45, now, now); // 45 mins
      insert.finalize();

      Stats.getTotalStudyDuration(userId, (err, totalDuration) => {
        expect(err).toBeNull();
        expect(totalDuration).toBe(75); // 30 + 45

        Stats.getTotalSessions(userId, (err, count) => {
          expect(err).toBeNull();
          expect(count).toBe(2);

          Stats.getWeeklyStudyDuration(userId, (err, weekly) => {
            expect(err).toBeNull();
            expect(weekly).toBe(75);

            Stats.getMonthlyStudyDuration(userId, (err, monthly) => {
              expect(err).toBeNull();
              expect(monthly).toBe(75);

              Stats.getRecentSessions(userId, (err, sessions) => {
                expect(err).toBeNull();
                expect(sessions.length).toBeGreaterThan(0);
                expect(sessions[0]).toHaveProperty("duration");
                done();
              });
            });
          });
        });
      });
    });
  });

});

afterAll(() => db.close());
