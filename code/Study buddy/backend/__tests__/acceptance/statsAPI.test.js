/*
  90% Human
  10% framework
*/

const request = require("supertest");
const app = require("../../server");
const db = require("../../db/db");

let token;
let userId;

beforeAll((done) => {
  // clear db
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_sessions");

    // register test user
    request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "123456" })
      .end((err, res) => {
        if (err) return done(err);
        userId = res.body.user.id;

        // login to get token
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

describe("Stats API", () => {

  test("GET /api/stats/me - new user should return empty stats", async () => {
    const res = await request(app)
      .get("/api/stats/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDuration).toBe(0);
    expect(res.body.totalSessions).toBe(0);
    expect(res.body.weeklyDuration).toBe(0);
    expect(res.body.monthlyDuration).toBe(0);
    expect(Array.isArray(res.body.recentSessions)).toBe(true);
    expect(res.body.recentSessions.length).toBe(0);
  });

  test("GET /api/stats/me - after inserting sessions", async () => {
    const now = new Date().toISOString();

    // insert test session
    const insert = db.prepare(`
      INSERT INTO study_sessions (user_id, duration, start_time, end_time)
      VALUES (?, ?, ?, ?)
    `);
    insert.run(userId, 30, now, now); // 30 mins
    insert.run(userId, 45, now, now); // 45 mins
    insert.finalize();

    const res = await request(app)
      .get("/api/stats/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.totalDuration).toBe(75); // 30 + 45
    expect(res.body.totalSessions).toBe(2);
    expect(res.body.weeklyDuration).toBe(75);
    expect(res.body.monthlyDuration).toBe(75);
    expect(Array.isArray(res.body.recentSessions)).toBe(true);
    expect(res.body.recentSessions.length).toBe(2);
    expect(res.body.recentSessions[0]).toHaveProperty("duration");
  });

  test("GET /api/stats/me - no token should return 401", async () => {
    const res = await request(app)
      .get("/api/stats/me");
    expect(res.statusCode).toBe(401);
  });

});

afterAll(() => db.close());
