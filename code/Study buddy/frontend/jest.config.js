/*
  100% AI generate
*/

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],  
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|expo-linear-gradient|expo-modules-core|expo-font|react-native-reanimated|@react-native|@expo/vector-icons|react-navigation|@react-navigation)/)"
  ],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
};
