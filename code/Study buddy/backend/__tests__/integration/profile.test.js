const db = require("../../db/db");
const Profile = require("../../models/profileModel");

let userId;

beforeAll((done) => {
  // Clear users and profiles tables
  db.serialize(() => {
    db.run("DELETE FROM users");
    db.run("DELETE FROM profiles");

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

describe("Profile Model Integration Tests", () => {
  test("should create a new profile", (done) => {
    Profile.updateProfile(userId, "Hello world", "avatar.png", (err, profile) => {
      expect(err).toBeNull();
      expect(profile).toEqual({
        user_id: userId,
        bio: "Hello world",
        avatar_url: "avatar.png",
      });

      // verify it is actually in the database
      Profile.getProfile(userId, (err, row) => {
        expect(err).toBeNull();
        expect(row.bio).toBe("Hello world");
        expect(row.avatar_url).toBe("avatar.png");
        done();
      });
    });
  });

  test("should update an existing profile", (done) => {
    Profile.updateProfile(userId, "Updated bio", "updated.png", (err, profile) => {
      expect(err).toBeNull();
      expect(profile.bio).toBe("Updated bio");
      expect(profile.avatar_url).toBe("updated.png");

      // verify update persisted
      Profile.getProfile(userId, (err, row) => {
        expect(err).toBeNull();
        expect(row.bio).toBe("Updated bio");
        expect(row.avatar_url).toBe("updated.png");
        done();
      });
    });
  });

  test("should return null for non-existent user profile", (done) => {
    Profile.getProfile(9999, (err, row) => {
      expect(err).toBeNull();
      expect(row).toBeUndefined();
      done();
    });
  });
});

afterAll(() => db.close());
