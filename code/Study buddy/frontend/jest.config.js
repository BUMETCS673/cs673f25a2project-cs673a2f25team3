// jest.config.js
module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^@env$': '<rootDir>/__mocks__/envMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '(jest-)?react-native' +
      '|@react-native' +
      '|react-native-.*' +
      '|@react-navigation' +
      '|expo' +
      '|expo-.*' +
      '|@expo/.*' +
      '|react-native-paper' +
      '|lucide-react-native' +
    ')/)',
  ],
  clearMocks: true,
  resetMocks: false,
};
