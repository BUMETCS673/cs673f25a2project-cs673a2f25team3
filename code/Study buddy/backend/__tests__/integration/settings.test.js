const db = require("../../db/db");
const Settings = require("../../models/settingsModel");

let userId;

// Helper to get settings as a promise
const getSettings = (userId) =>
  new Promise((resolve, reject) =>
    Settings.getSettings(userId, (err, row) => (err ? reject(err) : resolve(row)))
  );

// Helper to update settings as a promise
const updateSettings = (userId, theme, dailyGoal) =>
  new Promise((resolve, reject) =>
    Settings.updateSettings(userId, theme, dailyGoal, (err, updated) =>
      err ? reject(err) : resolve(updated)
    )
  );

beforeAll((done) => {
  db.serialize(() => {
    // Clear tables
    db.run("DELETE FROM users");
    db.run("DELETE FROM settings");

    // Create a test user
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["testuser", "pass"],
      function (err) {
        if (err) return done(err);
        userId = this.lastID;
        done();
      }
    );
  });
});

describe("Settings Integration Tests", () => {
  test("Should insert new settings for a user", async () => {
    const settings = await updateSettings(userId, "dark", 60);
    expect(settings).toEqual({
      user_id: userId,
      theme: "dark",
      daily_goal: 60,
    });

    const dbSettings = await getSettings(userId);
    expect(dbSettings.theme).toBe("dark");
    expect(dbSettings.daily_goal).toBe(60);
  });

  test("Should update existing settings for a user", async () => {
    // First update
    await updateSettings(userId, "light", 30);

    const updated = await updateSettings(userId, "dark", 90);
    expect(updated).toEqual({
      user_id: userId,
      theme: "dark",
      daily_goal: 90,
    });

    const dbSettings = await getSettings(userId);
    expect(dbSettings.theme).toBe("dark");
    expect(dbSettings.daily_goal).toBe(90);
  });

  test("Should return null if user has no settings", async () => {
    const dbSettings = await getSettings(userId + 999); // non-existent user
    expect(dbSettings).toBeNull();
  });
});

afterAll(() => db.close());
