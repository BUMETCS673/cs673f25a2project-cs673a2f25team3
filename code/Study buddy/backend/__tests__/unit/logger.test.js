const logger = require("../../middleware/logger");

describe("Logger Middleware Unit Tests", () => {
  let originalLog;

  beforeAll(() => {
    // store console.log
    originalLog = console.log;
    console.log = jest.fn(); // mock console.log
  });

  afterAll(() => {
    // restore console.log
    console.log = originalLog;
  });

  test("should log method and url, then call next", () => {
    const req = { method: "GET", url: "/api/test" };
    const res = {};
    const next = jest.fn();

    logger(req, res, next);

    // check console.log contain method and url
    expect(console.log).toHaveBeenCalledWith("GET /api/test");

    // check next
    expect(next).toHaveBeenCalled();
  });

  test("should still call next even if no method/url provided", () => {
    const req = {}; // empty request
    const res = {};
    const next = jest.fn();

    logger(req, res, next);

    // print undefined when no method/url
    expect(console.log).toHaveBeenCalledWith("undefined undefined");

    expect(next).toHaveBeenCalled();
  });
});
