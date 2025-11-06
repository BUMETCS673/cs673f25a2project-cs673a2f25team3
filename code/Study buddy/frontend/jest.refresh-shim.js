// Provide Fast Refresh globals so expo/react-refresh packages don't crash under Jest
/* eslint-disable no-undef */
global.$RefreshReg$ = () => {};
global.$RefreshSig$ = () => (type) => type;
// Expo tooling often relies on __DEV__
global.__DEV__ = true;
