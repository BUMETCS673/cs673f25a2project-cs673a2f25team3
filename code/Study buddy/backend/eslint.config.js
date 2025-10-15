// 100% AI generated

// eslint.config.js
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import globals from 'globals';

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // App code (React Native / Expo)
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      'node_modules/**',
      'android/**',
      'ios/**',
      '.expo/**',
      '.expo-shared/**',
      'dist/**',
      'build/**',
      'web-build/**',
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }, // enable JSX parsing
      },
      globals: {
        ...globals.es2021,
        ...globals.node,
        __DEV__: true, // Expo global
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React / JSX
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General hygiene
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off',

      // React Native
      'react-native/no-inline-styles': 'warn',
      'react-native/split-platform-components': 'warn',
      'react-native/no-raw-text': 'off',
    },
  },

  // Test files (Jest)
  {
    files: ['**/*.{test,spec}.{js,jsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.jest, // enables test, expect, describe, etc.
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
];
