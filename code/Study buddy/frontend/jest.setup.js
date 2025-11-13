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

// Mock expo-modules-core EventEmitter and requireNativeModule
jest.mock('expo-modules-core', () => {
  return {
    EventEmitter: class {
      addListener() {}
      removeAllListeners() {}
    },
    requireNativeModule: jest.fn(() => ({
      // Return a mock native module
    })),
  };
});

// Mock expo-font to prevent native module errors
jest.mock('expo-font', () => {
  return {
    loadAsync: jest.fn(() => Promise.resolve()),
    isLoaded: jest.fn(() => true),
    loadFontsAsync: jest.fn(() => Promise.resolve()),
  };
});

// Mock @expo/vector-icons to prevent native module errors
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  // Create a mock icon component
  const MockIcon = ({ name, size, color, ...props }) => {
    return React.createElement(View, {
      ...props,
      testID: `icon-${name}`,
      style: { width: size, height: size, backgroundColor: color },
    });
  };
  
  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    MaterialCommunityIcons: MockIcon,
    FontAwesome: MockIcon,
    FontAwesome5: MockIcon,
    AntDesign: MockIcon,
    Entypo: MockIcon,
    Feather: MockIcon,
    Fontisto: MockIcon,
    Foundation: MockIcon,
    Octicons: MockIcon,
    SimpleLineIcons: MockIcon,
    Zocial: MockIcon,
  };
});

// Mock react-native-calendars to prevent parsing and native module errors
jest.mock('react-native-calendars', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  
  // Create a mock Calendar component
  const MockCalendar = ({ markedDates, onDayPress, style, theme, ...props }) => {
    return React.createElement(
      View,
      { ...props, testID: 'mock-calendar', style },
      React.createElement(Text, { testID: 'calendar-text' }, 'Calendar')
    );
  };
  
  return {
    Calendar: MockCalendar,
  };
});

// Mock fetch globally
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mock requestAnimationFrame to prevent act(...) warnings in animation loops
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
