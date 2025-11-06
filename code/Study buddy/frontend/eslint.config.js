// eslint.config.js — Flat config compatible with ESLint 8/9
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import testingLibrary from 'eslint-plugin-testing-library';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      'node_modules/**',
      'coverage/**', // ignore generated reports
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'testing-library': testingLibrary,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Tests & setup overrides
  {
    files: [
      '**/__tests__/**/*.js',
      '**/__tests__/**/*.jsx',
      'jest.setup.js',
    ],
    languageOptions: {
      globals: {
        // Jest globals
        jest: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        // Web-ish globals common in test envs
        document: 'readonly',
        window: 'readonly',
        // fetch mocking
        fetch: 'readonly',
        fetchMock: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'off',
    },
  },
];
