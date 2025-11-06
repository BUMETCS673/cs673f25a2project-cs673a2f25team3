// code/Study buddy/frontend/eslint.config.js
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: [
      // 忽略测试与配置、mock 等
      "**/__tests__/**",
      "**/*.test.*",
      "**/__mocks__/**",
      "jest.config.*",
      "jest.setup.*",
      "jest.refresh-shim.*",
      "babel.config.*",
      "metro.config.*",
      "coverage/**",
      "node_modules/**"
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        // 常见全局，避免 'is not defined'
        React: "writable",
        require: "readonly",
        module: "writable",
        fetch: "readonly",
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly"
      }
    },
    rules: {}
  }
];
