/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],

  // Keep SQLite happy in CI and avoid file locks if a file DB sneaks in
  maxWorkers: 1,

  clearMocks: true,
  restoreMocks: true,

  // Avoid flaky first-run timeouts during DB init
  testTimeout: 10000,
};
