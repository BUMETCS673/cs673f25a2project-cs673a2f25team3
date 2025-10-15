/*
  90% Human
  10% framework
*/

const db = require("../../db/db");
const User = require("../../models/userModel");
const bcrypt = require("bcrypt");

let testUserId;

// Helper: promisify createUser
const createUser = (username, password) =>
  new Promise((resolve, reject) =>
    User.createUser(username, password, (err, user) => (err ? reject(err) : resolve(user)))
  );

// Helper: promisify getUserByUsername
const getUserByUsername = (username) =>
  new Promise((resolve, reject) =>
    User.getUserByUsername(username, (err, user) => (err ? reject(err) : resolve(user)))
  );

beforeAll((done) => {
  db.serialize(() => {
    db.run("DELETE FROM users", done);
  });
});

describe("User Model Integration Tests", () => {
  test("Should create a new user with hashed password", async () => {
    const newUser = await createUser("testuser", "password123");
    testUserId = newUser.id;

    expect(newUser).toHaveProperty("id");
    expect(newUser.username).toBe("testuser");

    // Check database directly
    const dbUser = await getUserByUsername("testuser");
    expect(dbUser).toBeDefined();
    expect(dbUser.username).toBe("testuser");
    expect(dbUser.password).not.toBe("password123"); // password should be hashed
    expect(bcrypt.compareSync("password123", dbUser.password)).toBe(true);
  });

  test("Should fetch existing user by username", async () => {
    const dbUser = await getUserByUsername("testuser");
    expect(dbUser).toBeDefined();
    expect(dbUser.username).toBe("testuser");
    expect(dbUser.id).toBe(testUserId);
  });

  test("Should return undefined for non-existent user", async () => {
    const dbUser = await getUserByUsername("nonexistent");
    expect(dbUser).toBeUndefined();
  });
});

afterAll(() => db.close());
