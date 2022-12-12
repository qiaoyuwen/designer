require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [require.resolve('@designer/eslint/dist/react')],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {
    'dot-notation': 'off',
    'no-bitwise': 'off',
    'no-new-func': 'off',
    'no-empty': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/typedef': 'off',
    '@rushstack/typedef-var': 'off',
  },
};
