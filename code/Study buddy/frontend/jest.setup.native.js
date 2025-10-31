/* 100% AI generate */

const resolveNativeAnimatedHelper = () => {
  const candidates = [
    'react-native/Libraries/Animated/NativeAnimatedHelper',
    'react-native/Libraries/Animated/NativeAnimatedHelper.js',
    'react-native/Libraries/Animated/src/NativeAnimatedHelper',
  ];

  for (const candidate of candidates) {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      return require(candidate);
    } catch (err) {
      // ignore and try next path
    }
  }
  return null;
};

const NativeAnimatedHelper = resolveNativeAnimatedHelper();

if (NativeAnimatedHelper && NativeAnimatedHelper.API) {
  const noop = () => {};

  NativeAnimatedHelper.API.connectAnimatedView = noop;
  NativeAnimatedHelper.API.connectAnimatedNodes = noop;
  NativeAnimatedHelper.API.disconnectAnimatedNodes = noop;
  NativeAnimatedHelper.API.disconnectAnimatedView = noop;
  NativeAnimatedHelper.API.startAnimatingNode = noop;
}

// TouchableOpacity uses Animated APIs internally; swap to Pressable to avoid native animation hooks.
const ReactNative = require('react-native'); // eslint-disable-line global-require
if (ReactNative.TouchableOpacity && ReactNative.Pressable) {
  ReactNative.TouchableOpacity = ReactNative.Pressable;
}

// Ensure Animated.createAnimatedComponent returns the base component in tests.
try {
  // eslint-disable-next-line global-require
  const Animated = require('react-native/Libraries/Animated/Animated');
  if (Animated && typeof Animated.createAnimatedComponent === 'function') {
    Animated.createAnimatedComponent = (Component) => Component;
  }
  if (Animated && typeof Animated.timing === 'function') {
    Animated.timing = (value, config = {}) => ({
      start: (onComplete) => {
        if (value && typeof value.setValue === 'function' && typeof config.toValue === 'number') {
          value.setValue(config.toValue);
        }
        if (typeof onComplete === 'function') {
          onComplete({ finished: true });
        }
      },
      stop: () => {},
    });
  }
} catch (err) {
  // ignore loading failures; not all environments expose this path
}
