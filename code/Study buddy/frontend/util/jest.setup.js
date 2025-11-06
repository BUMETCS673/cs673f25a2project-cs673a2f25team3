// jest.setup.js
const { enableMocks } = require('jest-fetch-mock');
enableMocks();
fetchMock.doMock();

global.API_BASE_URL = 'http://localhost:8000';

/******************
 * Track current test file so we can pick a sensible initial route per suite
 ******************/
beforeEach(() => {
  try {
    const st = expect.getState && expect.getState();
    global.__TEST_ACTIVE_FILE__ = (st && st.testPath) || '';
  } catch {}
});

// Quiet noisy warnings
const origError = console.error;
console.error = (...args) => {
  const msg = args?.[0] || '';
  if (
    typeof msg === 'string' &&
    (
      msg.includes('useNativeDriver') ||
      msg.includes('Require cycle') ||
      msg.includes('not wrapped in act(') ||
      msg.includes('wrap-tests-with-act') ||
      msg.includes('Non-serializable values')
    )
  ) return;
  origError(...args);
};

// AsyncStorage
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// React Navigation mocks (stateful & per-test initial route)
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
    dispatch: jest.fn(),
    setOptions: jest.fn(),
    reset: jest.fn(),
  };

  const NavContext = React.createContext('Login');

  const pickInitial = () => {
    const file = (global.__TEST_ACTIVE_FILE__ || '').toLowerCase();
    // Home-related suites start on Home; otherwise default to Login
    if (file.includes('home')) return 'Home';
    return 'Login';
  };

  const NavigationContainer = ({ children }) => {
    const [active, setActive] = React.useState(pickInitial());
    mockNavigation._setRoute = setActive;
    return React.createElement(NavContext.Provider, { value: active }, children);
  };

  const useNavigation = () => ({
    ...mockNavigation,
    reset: ({ routes, index = 0 }) => {
      const target = routes && routes[index] ? routes[index].name : 'Login';
      mockNavigation._setRoute && mockNavigation._setRoute(target);
    },
  });

  const useRoute = () => ({ params: {} });

  return { NavigationContainer, useNavigation, useRoute, __context: NavContext };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const { useContext } = React;
  const { __context } = require('@react-navigation/native');

  const Navigator = ({ children }) => {
    const active = useContext(__context);
    const arr = React.Children.toArray(children);
    const match = arr.find(el => el.props.name === active) || arr[0];
    return React.createElement(React.Fragment, null, match);
  };

  const Screen = ({ component: Comp, children }) =>
    React.createElement(React.Fragment, null, Comp ? React.createElement(Comp) : children);

  return { createNativeStackNavigator: () => ({ Navigator, Screen }) };
});

// Expo/RN mocks
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }) => children,
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

try { jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); } catch {}

// ✅ Added missing module mock for react-native-calendars
jest.mock(
  'react-native-calendars',
  () => ({
    Calendar: () => null,
  }),
  { virtual: true }
);
