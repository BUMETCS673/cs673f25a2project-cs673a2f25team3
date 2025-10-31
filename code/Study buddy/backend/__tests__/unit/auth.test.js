/*
  50% AI
  50% Human
*/

const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

describe("Auth Middleware Unit Tests", () => {
  const secret = "test_secret"; // secret for testing

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  test("should return 401 if no Authorization header provided", () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing or invalid Authorization header" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if invalid token provided", () => {
    const req = { headers: { authorization: "Bearer invalid.token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token invalid or expired" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next if valid token provided", () => {
    // generate token
    const token = jwt.sign(
      { id: 1, username: "testuser" },
      secret,
      { expiresIn: "1h" }
    );

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: 1, username: "testuser" });
  });
});
