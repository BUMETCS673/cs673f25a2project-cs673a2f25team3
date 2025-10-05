const db = require("../db/db");
const Buddy = require("../models/buddyModel");

let userId;

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_buddies");

    db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["energyUser", "pass"], function(err) {
      if (err) return done(err);
      userId = this.lastID;

      Buddy.createBuddy(userId, "EnergyBuddy", (err) => {
        if (err) return done(err);
        done();
      });
    });
  });
});

// energy decay
function decayEnergyForUser(userId, hours = 1) {
  return new Promise((resolve, reject) => {
    Buddy.getBuddy(userId, (err, buddy) => {
      if (err) return reject(err);
      const newEnergy = Math.max(0, buddy.energy - hours);
      Buddy.updateEnergy(userId, newEnergy, (err) => {
        if (err) return reject(err);
        resolve(newEnergy);
      });
    });
  });
}

describe("Study Buddy energy decay", () => {
  test("Energy decreases and status updates correctly", async () => {
    let buddy = await new Promise((res) => Buddy.getBuddy(userId, (_, b) => res(b)));
    expect(buddy.energy).toBe(100);
    expect(buddy.status).toBe(4);

    await decayEnergyForUser(userId, 30); // 30hrs
    buddy = await new Promise((res) => Buddy.getBuddy(userId, (_, b) => res(b)));
    expect(buddy.energy).toBe(70);
    expect(buddy.status).toBe(3);

    await decayEnergyForUser(userId, 100); // 100hrs
    buddy = await new Promise((res) => Buddy.getBuddy(userId, (_, b) => res(b)));
    expect(buddy.energy).toBe(0);
    expect(buddy.status).toBe(0);
  });
});

afterAll(() => db.close());
