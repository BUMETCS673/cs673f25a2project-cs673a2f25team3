/** Minimal Jest config for expo/react-native unit tests in CI.
 *  It loads a small shim that defines Fast Refresh globals ($RefreshReg$, $RefreshSig$)
 *  so that modules from expo/react-refresh won't crash in Jest.
 */
module.exports = {
  preset: 'jest-expo',
 setupFilesAfterEnv: [
   "<rootDir>/jest.setup.js",
   "<rootDir>/jest.refresh-shim.js"
 ],
  testPathIgnorePatterns: ['StudyTimerInterface.test.js'],
};
