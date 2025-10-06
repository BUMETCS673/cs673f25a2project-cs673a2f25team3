/**
 * System Test - Full Workflow with Energy Decay and Multi-user
 *
 * This test simulates the entire app flow:
 * - Two users register, login, and create buddies
 * - Each adds study sessions
 * - Then time is simulated to test energy decay
 * - Profiles and settings are updated
 * - Finally, data access rules are verified
 */

const request = require("supertest");
const app = require("../server");
const db = require("../db/db");

let tokenUser1, tokenUser2;
let userId1, userId2;

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM buddies");
    db.run("DELETE FROM study_sessions");
    db.run("DELETE FROM profiles");
    db.run("DELETE FROM settings");

    // Register User1
    request(app)
      .post("/api/users/register")
      .send({ username: "user1", password: "123456" })
      .end((err, res) => {
        if (err) return done(err);
        userId1 = res.body.user.id;

        // Register User2
        request(app)
          .post("/api/users/register")
          .send({ username: "user2", password: "abcdef" })
          .end((err, res) => {
            if (err) return done(err);
            userId2 = res.body.user.id;

            // Login User1
            request(app)
              .post("/api/users/login")
              .send({ username: "user1", password: "123456" })
              .end((err, res) => {
                if (err) return done(err);
                tokenUser1 = res.body.token;

                // Login User2
                request(app)
                  .post("/api/users/login")
                  .send({ username: "user2", password: "abcdef" })
                  .end((err, res) => {
                    if (err) return done(err);
                    tokenUser2 = res.body.token;
                    done();
                  });
              });
          });
      });
  });
});

describe("System Test - Full Workflow with Energy Decay", () => {
  test("User1 creates Buddy", async () => {
    const res = await request(app)
      .post("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({ name: "Buddy1" });

    expect(res.statusCode).toBe(201);
    expect(res.body.buddy.name).toBe("Buddy1");
  });

  test("User2 creates Buddy", async () => {
    const res = await request(app)
      .post("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({ name: "Buddy2" });

    expect(res.statusCode).toBe(201);
    expect(res.body.buddy.name).toBe("Buddy2");
  });

  test("User1 adds Study Session", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({ duration: 60 });

    expect(res.statusCode).toBe(201);
  });

  test("User2 adds Study Session", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({ duration: 45 });

    expect(res.statusCode).toBe(201);
  });

  test("User1 updates Profile", async () => {
    const res = await request(app)
      .put("/api/profiles/me")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({ bio: "Hardworking student", avatar_url: "http://avatar1.com" });

    expect([200, 201]).toContain(res.statusCode);
  });

  test("User2 updates Settings", async () => {
    const res = await request(app)
      .put("/api/settings/me")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({ theme: "dark", daily_goal: 120 });

    expect([200, 201]).toContain(res.statusCode);
  });

  // ✅ 模拟时间流逝，测试能量衰减
  test("Energy Decay for User1's Buddy after 2 hours", async () => {
    // ⏰ 人为修改数据库中的最后学习时间为 2 小时前
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE study_sessions SET created_at = datetime('now', '-2 hours') WHERE user_id = ?`,
        [userId1],
        (err) => (err ? reject(err) : resolve())
      );
    });

    // 再次请求 Buddy 信息
    const res = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.buddy.energy).toBeLessThan(100); // ✅ now should decay
  });

  test("Retrieve all user data", async () => {
    const res1 = await request(app)
      .get("/api/profiles/me")
      .set("Authorization", `Bearer ${tokenUser1}`);
    const res2 = await request(app)
      .get("/api/settings/me")
      .set("Authorization", `Bearer ${tokenUser2}`);
    const res3 = await request(app)
      .get("/api/study/me")
      .set("Authorization", `Bearer ${tokenUser1}`);
    const res4 = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(res1.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res3.statusCode).toBe(200);
    expect(res4.statusCode).toBe(200);
  });

  test("User2 cannot access User1's Buddy", async () => {
    const res = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.buddy.name).toBe("Buddy2");
  });
});

afterAll(() => db.close());
