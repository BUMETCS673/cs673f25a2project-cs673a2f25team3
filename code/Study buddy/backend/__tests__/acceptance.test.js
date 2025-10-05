const request = require("supertest");
const app = require("../server");
const db = require("../db/db");
const Buddy = require("../models/buddyModel");

let token;
let userId;

beforeAll((done) => {
  // clear database
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_buddies");
    db.run("DELETE FROM study_sessions");

    // create test user
    request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "123456" })
      .end((err, res) => {
        if (err) return done(err);
        userId = res.body.user.id;

        // register to get token
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

describe("Study Buddy Acceptance Tests", () => {
  test("Create a buddy", async () => {
    const res = await request(app)
      .post("/api/buddy/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "BuddyOne" });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("BuddyOne");
    expect(res.body.energy).toBe(100);
    expect(res.body.status).toBe(4); // energetic
  });

  test("Update buddy energy and status", async () => {
    await new Promise((resolve) =>
      Buddy.updateEnergy(userId, 60, resolve)
    );

    const buddy = await new Promise((resolve) =>
      Buddy.getBuddy(userId, (_, b) => resolve(b))
    );
    expect(buddy.energy).toBe(60);
    expect(buddy.status).toBe(3); // not happy
  });

  test("Add a study session with start/end time", async () => {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 60 * 1000); // 30mins

    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        duration: 30,
        start_time: now.toISOString(),
        end_time: end.toISOString(),
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.duration).toBe(30);
    expect(new Date(res.body.start_time).toISOString()).toBe(now.toISOString());
    expect(new Date(res.body.end_time).toISOString()).toBe(end.toISOString());
  });

  test("Get all study sessions", async () => {
    const res = await request(app)
      .get("/api/study/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("duration");
  });
});

afterAll(() => db.close());
