const request = require("supertest");
const app = require("../../server");
const db = require("../../db/db");

let token;

beforeAll((done) => {
  // Clear database and register test user
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM settings");

    request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "123456" })
      .end((err, res) => {
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

describe("Settings API", () => {
  // 200 fetch profile
  test("Get Settings - success", async () => {
    const res = await request(app)
      .get("/api/settings/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.any(Object));
  });

  // 401 test: no token
  test("Get Settings - no token should return 401", async () => {
    const res = await request(app).get("/api/settings/me");
    expect(res.statusCode).toBe(401);
  });

  // 200 update settings
  test("Update Settings - valid", async () => {
    const res = await request(app)
      .post("/api/settings/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ theme: "dark", daily_goal: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body.theme).toBe("dark");
    expect(res.body.daily_goal).toBe(50);
  });

  // 400 test: invalid data
  test("Update Settings - invalid data", async () => {
    const res = await request(app)
      .post("/api/settings/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ theme: "invalid", daily_goal: -10 });

    expect(res.statusCode).toBe(400);
  });

  // 401 test: update settings without token
  test("Update Settings - no token should return 401", async () => {
    const res = await request(app)
      .post("/api/settings/me")
      .send({ theme: "dark", daily_goal: 50 });

    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => db.close());
