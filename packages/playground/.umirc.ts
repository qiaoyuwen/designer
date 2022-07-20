const path = require('path');

export default {
  npmClient: 'pnpm',
  alias: {
    '@designer/utils': path.join(__dirname, '../utils/src'),
  },
};
