// 100% AI generated to fix bugs on backend test on CI/CD

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

  // ============================
  // Added: Coverage configuration
  // ============================
  collectCoverage: true,
  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
    "db/**/*.js",
    "server.js",
    "!**/__tests__/**",
    "!**/node_modules/**"
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "html"]
};
