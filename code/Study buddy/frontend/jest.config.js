/** @type {import('jest').Config} */
const wantStrict = process.env.COVERAGE_80 === '1';

module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '@testing-library/jest-native/extend-expect'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native'
      + '|@react-native'
      + '|@react-navigation'
      + '|react-native-vector-icons'
      + '|expo'
      + '|expo-.*'
      + '|@expo(nent)?/.*'
      + ')/)',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__tests__/__mocks__/fileMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/__mocks__/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'screens/**/*.{js,jsx,ts,tsx}',
    'util/**/*.{js,jsx,ts,tsx}',
    'AuthContext.{js,ts,tsx}',
    '!**/index.{js,ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: wantStrict
    ? { global: { branches: 80, functions: 80, lines: 80, statements: 80 } }
    : { global: { branches: 0, functions: 0, lines: 0, statements: 0 } },
};
