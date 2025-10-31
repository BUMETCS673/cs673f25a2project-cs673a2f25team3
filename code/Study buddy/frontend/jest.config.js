/*
  100% AI generate
*/

module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.native.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], 
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|expo-linear-gradient|expo-modules-core|react-native-reanimated|@react-native|react-navigation|@react-navigation)/)"
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};
