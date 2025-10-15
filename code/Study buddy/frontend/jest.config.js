// 100% AI generated to get CI working for tests

module.exports = {
  preset: "react-native",
  testEnvironment: "jsdom",
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation)/)"
  ],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"]
};
