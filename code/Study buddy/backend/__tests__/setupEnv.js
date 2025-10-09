// backend/__tests__/setupEnv.js
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
process.env.DB_PATH = process.env.DB_PATH || './db/test.sqlite';
