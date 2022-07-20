require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [require.resolve('@designer/eslint/dist/node')],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    'no-bitwise': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@rushstack/typedef-var': 'off',
  },
};
