const db = require("../../db/db");
const BuddyModel = require("../../models/buddyModel");

/*
  60% Human
  10% framework
  30% AI
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
      expect(buddy.last_updated).not.toBeNull();
      done();
    });
  });

  test("Update exp", (done) => {
    BuddyModel.updateExp(userId, 5, (err) => {
      expect(err).toBeNull();
    });

    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(buddy.exp).toBe(5);
    });

    BuddyModel.updateExp(userId, 10, (err) => {
      expect(err).toBeNull();
    });

    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(buddy.exp).toBe(15);
      done();
    });
  });

  test("Update buddy with valid type 'cat'", (done) => {
    BuddyModel.updateBuddy(userId, "Fluffy", "cat", (err) => {
      expect(err).toBeNull();
    });

    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(buddy.name).toBe("Fluffy");
      expect(buddy.type).toBe("cat");
      done();
    });
  });

  test("Update buddy with valid type 'deer'", (done) => {
    BuddyModel.updateBuddy(userId, "Bambi", "deer", (err) => {
      expect(err).toBeNull();
    });

    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(buddy.name).toBe("Bambi");
      expect(buddy.type).toBe("deer");
      done();
    });
  });

  test("Update buddy with invalid type returns error", (done) => {
    BuddyModel.updateBuddy(userId, "Invalid", "this is an invalid buddy type", (err) => {
      expect(err).not.toBeNull();
      expect(err.message).toBe("Invalid buddy type selection");
      done();
    });
  });

  test("When updating status, last_updated changes", (done) => {
    var origionalLastUpdated = 0;
    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      origionalLastUpdated = new Date(buddy.last_updated).getTime();
    });

    BuddyModel.updateStatus(userId, 1, (err) => {
      expect(err).toBeNull();
    });

    BuddyModel.getBuddy(userId, (err, buddy) => {
      expect(err).toBeNull();
      expect(new Date(buddy.last_updated).getTime()).not.toBe(origionalLastUpdated);
      done();
    });
  });
});

afterAll(() => db.close());
