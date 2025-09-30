const request = require("supertest");
const app = require("../server");

describe("API Tests", () => {
  let userId;

  test("Register User", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  test("Login User", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user_id");
  });

  test("Add Study Session", async () => {
    const res = await request(app)
      .post(`/api/study/${userId}`)
      .send({ duration: 30 });
    expect(res.statusCode).toBe(201);
    expect(res.body.duration).toBe(30);
  });

  test("Get Study Sessions", async () => {
    const res = await request(app).get(`/api/study/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
