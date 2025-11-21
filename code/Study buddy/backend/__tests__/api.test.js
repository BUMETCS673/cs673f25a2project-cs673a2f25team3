/*
  60% AI
  40% Human
*/

const request = require("supertest");
const app = require("../server");
const db = require("../db/db");

describe("API Integration Tests", () => {
  let token;
  let userId;

  const testUsername = "testuser";
  const testPassword = "123456";

  beforeAll((done) => {
    // delete test user to avoid repeat data
    db.run("DELETE FROM users WHERE username = ?", [testUsername], done);
  });

  test("Register User", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: testUsername, password: testPassword });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.username).toBe(testUsername);
    userId = res.body.user.id;
  });

  test("Login User", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: testUsername, password: testPassword });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.username).toBe(testUsername);
    token = res.body.token;
  });

  test("Get Profile (empty initially)", async () => {
    const res = await request(app)
      .get("/api/profiles/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.any(Object));
  });

  test("Update Profile", async () => {
    const res = await request(app)
      .post("/api/profiles/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Hello", avatar_url: "avatar.png" });

    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe("Hello");
    expect(res.body.avatar_url).toBe("avatar.png");
  });

  test("Get Settings (default)", async () => {
    const res = await request(app)
      .get("/api/settings/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    // default data might be empty
    expect(res.body).toEqual(expect.any(Object));
  });

  test("Update Settings", async () => {
    const res = await request(app)
      .post("/api/settings/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ theme: "dark", goal: 50 });

    expect(res.statusCode).toBe(200);
    expect(res.body.theme).toBe("dark");
    expect(res.body.goal).toBe(50);
  });

  test("Add Study Session", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ duration: 30 });

    expect(res.statusCode).toBe(201);
    expect(res.body.duration).toBe(30);
  });

  test("Get Study Sessions", async () => {
    const res = await request(app)
      .get("/api/study/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("duration");
  });

  test("Update Buddy with valid type 'cat'", async () => {
    const res = await request(app)
      .post("/api/buddy/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Fluffy", type: "cat" });

    expect(res.statusCode).toBe(201);
    
    // Verify the update by getting the buddy
    const getRes = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.name).toBe("Fluffy");
    expect(getRes.body.type).toBe("cat");
  });

  test("Update Buddy with valid type 'deer'", async () => {
    const res = await request(app)
      .post("/api/buddy/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Bambi", type: "deer" });

    expect(res.statusCode).toBe(201);
    
    // Verify the update by getting the buddy
    const getRes = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.name).toBe("Bambi");
    expect(getRes.body.type).toBe("deer");
  });

  test("Update Buddy with invalid type returns error", async () => {
    const res = await request(app)
      .post("/api/buddy/update")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Invalid", type: "this is an invalid buddy type" });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Invalid buddy type selection");
  });
});
