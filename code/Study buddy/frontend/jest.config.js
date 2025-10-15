// 100 AI generated to fix issues with CI npm test run

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testMatch: ['**/__tests__/**/*.test.@(js|jsx|ts|tsx)'],
};
