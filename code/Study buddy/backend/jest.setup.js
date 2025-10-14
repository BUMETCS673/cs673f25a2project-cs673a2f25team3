// Ensure test environment
process.env.NODE_ENV = "test";

// If you still want .env.test to be read (optional):
try {
  require("dotenv").config({
    path: `.env.test`,
    override: true,
    // remove 'quiet' if your dotenv version doesn't support it
    quiet: true,
  });
} catch (_) {
  // dotenv not installed or .env.test absent—totally fine
}

// Safe defaults so tests don't depend on any external secrets/files
process.env.JWT_SECRET = process.env.JWT_SECRET || "super-secret-test-only";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
process.env.SQLITE_DB = process.env.SQLITE_DB || ":memory:";
