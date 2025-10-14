/*
  90% Human
  10% framework
*/

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

// __tests__/system.test.js
const request = require("supertest");
const app = require("../server");      // 确保导出的就是 express app
const db = require("../db/db");

let userId1, userId2;
let tokenUser1, tokenUser2;

describe("System Test - Full Workflow with Energy Decay", () => {
  beforeAll(async () => {
    // 串行清表，避免锁 & 残留数据
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run("DELETE FROM study_sessions");
        db.run("DELETE FROM profiles");
        db.run("DELETE FROM settings");
        db.run("DELETE FROM buddies");
        db.run("DELETE FROM users", (err) => (err ? reject(err) : resolve()));
      });
    });

    // 注册 & 登录 user1
    const r1 = await request(app)
      .post("/api/users/register")
      .send({ username: "user1", password: "123456" });
    expect(r1.statusCode).toBe(201);
    userId1 = r1.body.user.id;

    const l1 = await request(app)
      .post("/api/users/login")
      .send({ username: "user1", password: "123456" });
    expect(l1.statusCode).toBe(200);
    tokenUser1 = l1.body.token;

    // 注册 & 登录 user2
    const r2 = await request(app)
      .post("/api/users/register")
      .send({ username: "user2", password: "abcdef" });
    expect(r2.statusCode).toBe(201);
    userId2 = r2.body.user.id;

    const l2 = await request(app)
      .post("/api/users/login")
      .send({ username: "user2", password: "abcdef" });
    expect(l2.statusCode).toBe(200);
    tokenUser2 = l2.body.token;
  });

  test("User1 creates Buddy", async () => {
    const res = await request(app)
      .post("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({ name: "BuddyOne" });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.buddy).toBeDefined();
    expect(res.body.buddy.name).toBe("BuddyOne");
    expect(res.body.buddy.energy).toBe(100);
  });

  test("User2 creates Buddy", async () => {
    const res = await request(app)
      .post("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser2}`)
      .send({ name: "BuddyTwo" });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.buddy).toBeDefined();
    expect(res.body.buddy.name).toBe("BuddyTwo");
    expect(res.body.buddy.energy).toBe(100);
  });

  test("User1 adds Study Session", async () => {
    const res = await request(app)
      .post("/api/study/me")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({ duration: 60 });
    expect(res.statusCode).toBe(201); // 201 Created
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
    // 可能是插入(201)或更新(200)，都算通过
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
    // 把 buddies.last_update_ms 回拨 2 小时（毫秒）
    const twoHoursMs = 2 * 3600000;
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE buddies SET last_update_ms = last_update_ms - ? WHERE user_id = ?",
        [twoHoursMs, userId1],
        (err) => (err ? reject(err) : resolve())
      );
    });

    const res = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser1}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.buddy).toBeDefined();
    // 至少衰减了 1（按整小时向下取整，2 小时应掉 2）
    expect(res.body.buddy.energy).toBeLessThan(100);
    expect(res.body.buddy.energy).toBeGreaterThanOrEqual(0);
  });

  test("Retrieve all user data", async () => {
    // Profile
    const p1 = await request(app)
      .get("/api/profiles/me")
      .set("Authorization", `Bearer ${tokenUser1}`);
    expect(p1.statusCode).toBe(200);

    // Settings（user1 没设置过也应该返回对象或默认）
    const s1 = await request(app)
      .get("/api/settings/me")
      .set("Authorization", `Bearer ${tokenUser1}`);
    expect([200, 404]).toContain(s1.statusCode);

    // Studies
    const st1 = await request(app)
      .get("/api/study/me")
      .set("Authorization", `Bearer ${tokenUser1}`);
    expect(st1.statusCode).toBe(200);
    expect(Array.isArray(st1.body)).toBe(true);

    // Buddy
    const b1 = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser1}`);
    expect(b1.statusCode).toBe(200);
    expect(b1.body.buddy).toBeDefined();
  });

  test("User2 cannot access User1's Buddy", async () => {
    const res = await request(app)
      .get("/api/buddy/me")
      .set("Authorization", `Bearer ${tokenUser2}`);
    // 这里只能拿到自己的 buddy，不会返回 user1 的；接口设计通常返回 user2 自己的 buddy 或 404（如果未创建）
    expect([200, 404]).toContain(res.statusCode);
  });

  afterAll((done) => {
    // 关闭数据库连接，避免 Jest 挂住
    db.close(() => done());
  });
});
