/* global jest */

/*
  Jest setup for Expo + React Native
*/
require('jest-fetch-mock').enableMocks();

// Provide a default API base to avoid 'API_BASE_URL is not defined' in tests
if (typeof globalThis.API_BASE_URL === 'undefined') {
  globalThis.API_BASE_URL = 'http://localhost:3000';
}

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));

jest.mock('expo-modules-core', () => ({
  EventEmitter: class {
    addListener() {}
    removeAllListeners() {}
  },
}));

// React Navigation helpers: include reset()
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),   // <- add reset to fix Home test
    }),
    useRoute: () => ({ params: {} }),
  };
});

// Silence RN Animated warnings (RN ≥0.81 compatible)
try {
  const helperPath = require.resolve('react-native/Libraries/Animated/NativeAnimatedHelper');
  jest.mock(helperPath);
} catch (e) {
  try {
    const altPath = require.resolve('react-native/Libraries/Animated/NativeAnimatedModule');
    jest.mock(altPath);
  } catch (e2) {
    // ignore if none exist
  }
}

// Optional: mute act() warning noise in console.error to keep CI logs clean
const origError = console.error;
console.error = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('not wrapped in act(')) return;
  origError(...args);
};

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});
