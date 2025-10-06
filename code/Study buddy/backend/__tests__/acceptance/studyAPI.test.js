const request = require("supertest");
const app = require("../../server");
const db = require("../../db/db");

let token;

beforeAll((done) => {
  // Clear database and register test user
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_sessions");

    request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "123456" })
      .end((err) => {
        if (err) return done(err);

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

describe("Study Session API", () => {
  //201 test: add a valid study session
  test("Add Study Session - valid", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ duration: 45 }); // duration in minutes

    expect(res.statusCode).toBe(201);
    expect(res.body.duration).toBe(45);
    expect(res.body.start_time).toBeDefined();
    expect(res.body.end_time).toBeDefined();
    expect(new Date(res.body.start_time)).toBeInstanceOf(Date);
    expect(new Date(res.body.end_time)).toBeInstanceOf(Date);
  });

  // 400 test: invalid negative duration
  test("Add Study Session - invalid duration (negative)", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ duration: -10 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/invalid/i);
  });

  // 400 test: invalid non-numeric duration
  test("Add Study Session - invalid duration (non-numeric)", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ duration: "abc" });

    expect(res.statusCode).toBe(400);
  });

  // 401 test: no authentication
  test("Add Study Session - no token should return 401", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .send({ duration: 30 });

    expect(res.statusCode).toBe(401);
  });

  // 200 test: retrieve all study sessions
  test("Get Study Sessions - success", async () => {
    const res = await request(app)
      .get("/api/study/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  // 401 test: retrieve sessions without token
  test("Get Study Sessions - no token should return 401", async () => {
    const res = await request(app).get("/api/study/me");
    expect(res.statusCode).toBe(401);
  });

  // 200 test: test retrieve the latest study session
  test("Get Latest Study Session - success", async () => {
    const res = await request(app)
      .get("/api/study/me/latest")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("duration");
    expect(res.body).toHaveProperty("start_time");
    expect(res.body).toHaveProperty("end_time");
  });

  // 401 test: retrieve the latest session without token
  test("Get Latest Study Session - no token should return 401", async () => {
    const res = await request(app).get("/api/study/me/latest");
    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => db.close());
