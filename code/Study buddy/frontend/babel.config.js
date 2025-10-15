// 100% AI generated to ensure frontend tests to work on CI setup

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-react'
    ]
  };
};