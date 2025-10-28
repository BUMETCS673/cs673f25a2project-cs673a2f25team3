const db = require("../../db/db");
const BuddyModel = require("../../models/buddyModel");

/*
  90% Human
  10% framework
*/

let userId;

beforeAll((done) => {
  db.serialize(() => {
    // Clear database
    db.run("DELETE FROM users");
    db.run("DELETE FROM study_buddies");

    // Insert a test user
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      ["testuser", "123456"],
      function (err) {
        if (err) return done(err);
        userId = this.lastID;
        done();
      }
    );
  });
});

describe("Buddy Model Integration Tests", () => {

  test("Create default buddy", (done) => {
    BuddyModel.createBuddy(userId, "Buddy", (err) => {
      expect(err).toBeNull();
    });
    
    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(buddy.name).toBe("Buddy");
      expect(buddy.exp).toBe(0);
      expect(buddy.status).toBe(4);
      expect(buddy.last_updated).toBeGreaterThan(0);
      done();
    });
  });

  test("When updating exp, last_updated changes", (done) => {
    var origionalLastUpdated = 0;
    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      origionalLastUpdated = buddy.last_updated;
    });

    BuddyModel.updateExp(userId, 5, (err) => {
      expect(err).toBeNull();
    });

    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(buddy.last_updated).not.toBe(origionalLastUpdated);
      done();
    });
  });

  test("When updating status, last_updated changes", (done) => {
    var origionalLastUpdated = 0;
    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      origionalLastUpdated = buddy.last_updated;
    });

    BuddyModel.updateStatus(userId, 1, (err) => {
      expect(err).toBeNull();
    });

    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(buddy.last_updated).not.toBe(origionalLastUpdated);
      done();
    });
  });
});

afterAll(() => db.close());
