const path = require('path');

export default {
  npmClient: 'pnpm',
  alias: {
    '@designer/utils': path.join(__dirname, '../utils/src'),
    '@designer/core': path.join(__dirname, '../core/src'),
    '@designer/react': path.join(__dirname, '../react/src'),
    '@designer/react-settings-form': path.join(__dirname, '../react-settings-form/src'),
    '@designer/formily-antd': path.join(__dirname, '../formily-antd/src'),
    '@designer/designer-antd': path.join(__dirname, '../designer-antd/src'),
  },
  mfsu: false,
};
