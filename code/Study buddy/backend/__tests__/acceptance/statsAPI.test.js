/*
  90% Human
  10% framework
*/

const request = require("supertest");
const app = require("../../server");
const db = require("../../db/db");
const Stats = require("../../models/statsModel");

let token;
let userId;

// Use normal file-based DB, clear relevant tables first
beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_sessions");

    // Register test user
    request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "123456" })
      .end((err, res) => {
        if (err) return done(err);
        userId = res.body.user.id;

        // Login to get token
        request(app)
          .post("/api/users/login")
          .send({ username: "testuser", password: "123456" })
          .end((err, res) => {
            if (err) return done(err);
            token = res.body.token;
            done();
          });
      });
  });
});

// Each test clears study_sessions for isolation
beforeEach((done) => {
  db.run("DELETE FROM study_sessions", done);
});

describe("Stats API", () => {

  test("GET /api/stats/me - new user should return empty stats", async () => {
    const res = await request(app)
      .get("/api/stats/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDuration).toBe(0);
    expect(res.body.totalSessions).toBe(0);
    expect(res.body.monthlyDuration).toBe(0);
    expect(Array.isArray(res.body.recentSessions)).toBe(true);
    expect(res.body.recentSessions.length).toBe(0);
  });

  test("GET /api/stats/me - after inserting valid sessions", async () => {
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO study_sessions (user_id, duration, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);
    insert.run(userId, 30, now, now);
    insert.run(userId, 45, now, now);
    insert.finalize();

    const res = await request(app)
      .get("/api/stats/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDuration).toBe(75);
    expect(res.body.totalSessions).toBe(2);
    expect(res.body.monthlyDuration).toBe(75);
    expect(Array.isArray(res.body.recentSessions)).toBe(true);
    expect(res.body.recentSessions.length).toBe(2);
    expect(res.body.recentSessions[0]).toHaveProperty("duration");
  });

  test("GET /api/stats/me - edge cases: ignore invalid sessions", async () => {
    const now = new Date().toISOString();
    const future = new Date(Date.now() + 3600 * 1000).toISOString();

    const insert = db.prepare(`
      INSERT INTO study_sessions (user_id, duration, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);
    insert.run(userId, 50, now, now);        // valid
    insert.run(userId, -10, now, now);       // invalid duration
    insert.run(userId, 20, future, now);     // start_time > end_time
    insert.finalize();

    const res = await request(app)
      .get("/api/stats/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDuration).toBe(50);
    expect(res.body.totalSessions).toBe(1);
    expect(res.body.monthlyDuration).toBe(50);
  });

  test("GET /api/stats/me - recentSessions returns max 10 records", async () => {
    const insert = db.prepare(`
      INSERT INTO study_sessions (user_id, duration, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);

    const now = Date.now();
    for (let i = 0; i < 12; i++) {
      const ts = new Date(now + i * 60000).toISOString(); // unique timestamps
      insert.run(userId, 10 + i, ts, ts);
    }

    await new Promise((resolve) => insert.finalize(resolve)); // wait for all inserts

    const res = await request(app)
      .get("/api/stats/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.recentSessions)).toBe(true);
    expect(res.body.recentSessions.length).toBe(10); // latest 10 sessions
  });


  test("GET /api/stats/me - no token should return 401", async () => {
    const res = await request(app)
      .get("/api/stats/me");
    expect(res.statusCode).toBe(401);
  });

});

afterAll(() => db.close());
