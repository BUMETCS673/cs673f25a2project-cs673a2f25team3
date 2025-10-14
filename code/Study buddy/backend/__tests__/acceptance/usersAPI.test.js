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

describe("Auth API", () => {
  //200 test: Login sucessfully
  test("Login - success", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  // 401 test: login with wrong password
  test("Login - wrong password should return 401", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "wrong" });

    expect(res.statusCode).toBe(401);
  });

  // 400 test: login with non-existent user 
  test("Login - non-existent user should return 400", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "nouser", password: "123456" });

    expect(res.statusCode).toBe(400);
  });

  // 400 test: empty username
  test("Login - empty username should return 400", async () =>{
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "", password: "123456" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/username/i)
  });

  // 400 test: Empty password
  test("Login - empty password should return 400", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  // 400 test: Both empty
  test("Login - empty username and password should return 400", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "", password: "" });

    expect(res.statusCode).toBe(400);
  });

  // 400 test: Extremely long username
  test("Login - very long username", async () => {
    const longUsername = "a".repeat(1000);
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: longUsername, password: "123456" });

    expect(res.statusCode).toBe(400); // Expect validation error
  });

  // 400 test: Extremely long password
  test("Login - very long password", async () => {
    const longPassword = "a".repeat(1000);
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: longPassword });

    expect(res.statusCode).toBe(401); // Wrong password
  });

  // 400 test: Malformed input (non-string username/password)
  test("Login - non-string input should return 400", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: 12345, password: true });

    expect(res.statusCode).toBe(400);
  });
});

afterAll(() => db.close());
