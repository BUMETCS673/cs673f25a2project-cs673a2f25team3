/*
  50% AI
  50% Human
*/

const request = require("supertest");
const app = require("../../server");
const db = require("../../db/db");

let token;

// Recreate a clean user/token for every test suite.
beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM study_progress");
    db.run("DELETE FROM study_sessions");
    db.run("DELETE FROM users");

    request(app)
      .post("/api/users/register")
      .send({ username: "progressUser", password: "password" })
      .end((err) => {
        if (err) return done(err);

        request(app)
          .post("/api/users/login")
          .send({ username: "progressUser", password: "password" })
          .end((err, res) => {
            if (err) return done(err);
            token = res.body.token;
            done();
          });
      });
  });
});

// Ensure each test starts with no persisted progress.
beforeEach((done) => {
  db.run("DELETE FROM study_progress", done);
});

describe("Study Progress API", () => {
  test("GET /api/study/progress returns 204 when no progress", async () => {
    const res = await request(app)
      .get("/api/study/progress")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  test("PUT /api/study/progress upserts progress payload", async () => {
    const payload = {
      target_minutes: 60,
      elapsed_seconds: 300,
      session_start: "2025-03-10T10:00:00.000Z",
      status: "running",
    };

    const putRes = await request(app)
      .put("/api/study/progress")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.target_minutes).toBe(payload.target_minutes);
    expect(putRes.body.elapsed_seconds).toBe(payload.elapsed_seconds);
    expect(putRes.body.status).toBe(payload.status);

    const getRes = await request(app)
      .get("/api/study/progress")
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.elapsed_seconds).toBe(payload.elapsed_seconds);
  });

  test("DELETE /api/study/progress clears stored progress", async () => {
    await request(app)
      .put("/api/study/progress")
      .set("Authorization", `Bearer ${token}`)
      .send({
        target_minutes: 25,
        elapsed_seconds: 120,
        session_start: "2025-03-10T11:00:00.000Z",
        status: "paused",
      });

    const deleteRes = await request(app)
      .delete("/api/study/progress")
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(204);

    const getRes = await request(app)
      .get("/api/study/progress")
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.statusCode).toBe(204);
  });
});
