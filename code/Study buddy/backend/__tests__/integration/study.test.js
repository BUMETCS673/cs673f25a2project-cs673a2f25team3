const db = require("../../db/db");
const Study = require("../../models/studyModel");

let userId;

// Helper functions
const addSession = (user_id, duration, start_time, end_time) =>
  new Promise((resolve, reject) =>
    Study.addSession(user_id, duration, start_time, end_time, (err, session) =>
      err ? reject(err) : resolve(session)
    )
  );

const getSessions = (user_id) =>
  new Promise((resolve, reject) =>
    Study.getSessions(user_id, (err, sessions) => (err ? reject(err) : resolve(sessions)))
  );

const getLatestSession = (user_id) =>
  new Promise((resolve, reject) =>
    Study.getLatestSession(user_id, (err, session) => (err ? reject(err) : resolve(session)))
  );

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_sessions");

    // create a test user
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["studyuser", "pass"],
      function (err) {
        if (err) return done(err);
        userId = this.lastID;
        done();
      }
    );
  });
});

describe("Study Model Integration Tests", () => {
  test("Add a new study session", async () => {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 60 * 1000); // +30 minutes

    const session = await addSession(userId, 30, now.toISOString(), end.toISOString());

    expect(session).toHaveProperty("id");
    expect(session.user_id).toBe(userId);
    expect(session.duration).toBe(30);
    expect(session.start_time).toBe(now.toISOString());
    expect(session.end_time).toBe(end.toISOString());
  });

  test("Get all study sessions", async () => {
    const sessions = await getSessions(userId);
    expect(Array.isArray(sessions)).toBe(true);
    expect(sessions.length).toBeGreaterThanOrEqual(1);
    expect(sessions[0]).toHaveProperty("id");
    expect(sessions[0].user_id).toBe(userId);
  });

  test("Get latest study session", async () => {
    const latest = await getLatestSession(userId);
    expect(latest).toHaveProperty("id");
    expect(latest.user_id).toBe(userId);
  });

  test("Return empty array for non-existent user", async () => {
    const sessions = await getSessions(9999);
    expect(sessions).toEqual([]);
  });

  test("Return undefined for latest session of non-existent user", async () => {
    const latest = await getLatestSession(9999);
    expect(latest).toBeUndefined();
  });
});

afterAll(() => db.close());
