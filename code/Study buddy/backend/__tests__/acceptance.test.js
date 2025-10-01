// __tests__/acceptance.test.js
const request = require("supertest");
const app = require("../server");
const db = require("../db/db");

describe("Study Buddy Backend Acceptance Tests", () => {
  let token;
  let userId;

  const testUsername = "acceptanceUser";
  const testPassword = "123456";

  beforeAll((done) => {
    // Delete test user to ensure a clean state
    db.run("DELETE FROM users WHERE username = ?", [testUsername], done);
  });

  afterAll((done) => {
    // Clean up after tests
    db.run("DELETE FROM users WHERE username = ?", [testUsername], done);
  });

  test("Register User Successfully", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: testUsername, password: testPassword });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.username).toBe(testUsername);
    userId = res.body.user.id;
  });

  test("Register Duplicate User (Edge Case)", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: testUsername, password: testPassword });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("Login Successfully", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: testUsername, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Login with Wrong Password (Edge Case)", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: testUsername, password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("Get Profile Before Update", async () => {
    const res = await request(app)
      .get("/api/profiles/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.any(Object));
  });

  test("Update Profile Successfully", async () => {
    const res = await request(app)
      .post("/api/profiles/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Edge Case Bio", avatar_url: "avatar.png" });

    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe("Edge Case Bio");
    expect(res.body.avatar_url).toBe("avatar.png");
  });

  test("Get Settings Default", async () => {
    const res = await request(app)
      .get("/api/settings/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.any(Object));
  });

  test("Update Settings Successfully", async () => {
    const res = await request(app)
      .post("/api/settings/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ theme: "dark", daily_goal: 60 });

    expect(res.statusCode).toBe(200);
    expect(res.body.theme).toBe("dark");
    expect(res.body.daily_goal).toBe(60);
  });

  test("Add Study Session Successfully", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ duration: 45 });

    expect(res.statusCode).toBe(201);
    expect(res.body.duration).toBe(45);
  });

  test("Get Study Sessions", async () => {
    const res = await request(app)
      .get("/api/study/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("duration");
  });

  test("Access Protected Route Without Token (Edge Case)", async () => {
    const res = await request(app).get("/api/profiles/me");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("Access Protected Route With Invalid Token (Edge Case)", async () => {
    const res = await request(app)
      .get("/api/profiles/me")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
  
  test("Register with empty username", async () => {
    const res = await request(app)
        .post("/api/users/register")
        .send({ username: "", password: "123456" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    });

    test("Add study session with negative duration", async () => {
    const res = await request(app)
        .post("/api/study/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ duration: -10 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    });

});
