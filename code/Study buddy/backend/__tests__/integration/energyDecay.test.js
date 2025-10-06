const db = require("../../db/db");
const Buddy = require("../../models/buddyModel");

let userId;

// Helper: get Buddy
const getBuddy = (userId) =>
  new Promise((resolve, reject) =>
    Buddy.getBuddy(userId, (err, buddy) => (err ? reject(err) : resolve(buddy)))
  );

// Helper: decay energy
const decayEnergyForUser = async (userId, hours = 1) => {
  const buddy = await getBuddy(userId);
  const newEnergy = Math.max(0, buddy.energy - hours);
  await new Promise((resolve, reject) =>
    Buddy.updateEnergy(userId, newEnergy, (err) => (err ? reject(err) : resolve()))
  );
  return newEnergy;
};

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_buddies");

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["energyUser", "pass"],
      function (err) {
        if (err) return done(err);
        userId = this.lastID;

        Buddy.createBuddy(userId, "EnergyBuddy", (err) => {
          if (err) return done(err);
          done();
        });
      }
    );
  });
});

describe("Study Buddy energy decay", () => {
  test("Energy decreases and status updates correctly", async () => {
    let buddy = await getBuddy(userId);
    expect(buddy.energy).toBe(100);
    expect(buddy.status).toBe(4); // energetic

    await decayEnergyForUser(userId, 30); // -30 energy
    buddy = await getBuddy(userId);
    expect(buddy.energy).toBe(70);
    expect(buddy.status).toBe(3); // not happy

    await decayEnergyForUser(userId, 100); // -100 energy -> 0
    buddy = await getBuddy(userId);
    expect(buddy.energy).toBe(0);
    expect(buddy.status).toBe(0); // exhausted
  });
});

afterAll(() => db.close());
