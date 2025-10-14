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
  // Clear database and register test user
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM profiles");

    request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "123456" })
      .end((err, res) => {
        if (err) return done(err);
        userId = res.body.user.id;

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

describe("Profile API", () => {
  // 200 fetch profile
  test("Get Profile - initially empty", async () => {
    const res = await request(app)
      .get("/api/profiles/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.any(Object));
  });

  // 401 test: no token
  test("Get Profile - no token should return 401", async () => {
    const res = await request(app).get("/api/profiles/me");
    expect(res.statusCode).toBe(401);
  });

  // 200 update profile
  test("Update Profile - valid data", async () => {
    const res = await request(app)
      .post("/api/profiles/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Hello", avatar_url: "avatar.png" });

    expect(res.statusCode).toBe(200);
    expect(res.body.bio).toBe("Hello");
    expect(res.body.avatar_url).toBe("avatar.png");
  });

  // 400 test: invalid data
  test("Update Profile - invalid data", async () => {
    const res = await request(app)
      .post("/api/profiles/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "", avatar_url: "" });

    expect(res.statusCode).toBe(400);
  });

  // 401 test: update profile without token
  test("Update Profile - no token should return 401", async () => {
    const res = await request(app)
      .post("/api/profiles/me")
      .send({ bio: "Hacker", avatar_url: "hack.png" });

    expect(res.statusCode).toBe(401);
  });
});

afterAll(() => db.close());
