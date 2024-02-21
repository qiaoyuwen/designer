require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [require.resolve('@designer/eslint/dist/react')],
  parserOptions: { tsconfigRootDir: __dirname },
  rules: {},
};
