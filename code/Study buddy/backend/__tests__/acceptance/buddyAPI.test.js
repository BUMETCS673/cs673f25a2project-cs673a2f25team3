const request = require("supertest");
const app = require("../../server");
const db = require("../../db/db");

let token;

beforeAll((done) => {
  // Clear database
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_buddies");

    // Create test user
    request(app)
      .post("/api/users/register")
      .send({ username: "buddyUser", password: "123456" })
      .end((err, res) => {
        if (err) return done(err);

        // Register to get token
        request(app)
          .post("/api/users/login")
          .send({ username: "buddyUser", password: "123456" })
          .end((err, res) => {
            if (err) return done(err);
            token = res.body.token;
            done();
          });
      });
  });
});

// 201 test: successfully create buddy
describe("Buddy API Acceptance Tests", () => {
  test("Create a buddy", async () => {
    const res = await request(app)
      .post("/api/buddy/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "BuddyOne" });

    expect(res.statusCode).toBe(201);
    expect(res.body.buddy).toHaveProperty("id");
    expect(res.body.buddy.name).toBe("BuddyOne");
    expect(res.body.buddy.energy).toBe(100);
    expect(res.body.buddy.status).toBe(4);
  });

  // 200 test: successfully get buddy
  test("Get my buddy", async () => {
    const res = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.buddy.name).toBe("BuddyOne");
    expect(res.body.buddy.energy).toBe(100);
    expect(res.body.buddy.status).toBe(4);
  });

  // 400 test: duplicate buddy
  test("Cannot create duplicate buddy", async () => {
    const res = await request(app)
      .post("/api/buddy/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "AnotherBuddy" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Buddy already exists");
  });
 // 200 test: verify energy decay after time passes
 test("Energy decays by 1 per hour elapsed", async () => {
   const now = Date.now();
   const fiveHoursAgo = now - 5 * 3600000; // 5 hours in ms

   await new Promise((resolve, reject) => {
     db.run(
       "UPDATE study_buddies SET last_update_ms = ?",
       [fiveHoursAgo],
       (err) => (err ? reject(err) : resolve())
     );
   });

   const res = await request(app)
     .get("/api/buddy/me")
     .set("Authorization", `Bearer ${token}`);

   expect(res.statusCode).toBe(200);
   expect(res.body.buddy).toBeDefined();
   expect(res.body.buddy.energy).toBe(95);
 });


});

afterAll(() => db.close());
