// __mocks__/react-native-gesture-handler.js
// Minimal placeholder so Jest can resolve the module if it's referenced.
module.exports = new Proxy({}, {
  get: () => ({ children }) => (children ?? null),
});
