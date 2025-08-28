// app-tv/.eslintrc.cjs
module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: { 'no-console': 'off' },
  ignorePatterns: ['node_modules/', 'dist/', 'build/'],
};
