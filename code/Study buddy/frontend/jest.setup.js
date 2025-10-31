/* global jest */

/*
  100% AI generate
*/

import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock AsyncStorage globally
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// React Native Fast Refresh stubs (used by React Navigation in tests)
global.$RefreshReg$ = () => {};
global.$RefreshSig$ = () => (type) => type;

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  return {
    LinearGradient: ({ children }) => children,
  };
});

// Mock expo-modules-core EventEmitter
jest.mock('expo-modules-core', () => {
  return {
    EventEmitter: class {
      addListener() {}
      removeAllListeners() {}
    },
  };
});

// Mock fetch globally
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
