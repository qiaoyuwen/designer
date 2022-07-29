const path = require('path');

export default {
  npmClient: 'pnpm',
  alias: {
    '@designer/utils': path.join(__dirname, '../utils/src'),
    '@designer/core': path.join(__dirname, '../core/src'),
    '@designer/react': path.join(__dirname, '../react/src'),
  },
  mfsu: false,
};
