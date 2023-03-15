import { defineConfig } from 'umi';
import { join } from 'path';

const resolvePakcage = (relativePath: string) => join(__dirname, relativePath);

const extraBabelIncludes = [
  resolvePakcage('../utils/src'),
  resolvePakcage('../core/src'),
  resolvePakcage('../react/src'),
  resolvePakcage('../react-settings-form/src'),
  resolvePakcage('../formily-antd/src'),
  resolvePakcage('../designer-antd/src'),
];

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/test', component: '@/pages/test' },
    { path: '/preview', component: '@/pages/preview' },
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
  alias: {
    '@designer/utils': resolvePakcage('../utils/src'),
    '@designer/core': resolvePakcage('../core/src'),
    '@designer/react': resolvePakcage('../react/src'),
    '@designer/react-settings-form': resolvePakcage('../react-settings-form/src'),
    '@designer/formily-antd': resolvePakcage('../formily-antd/src'),
    '@designer/designer-antd': resolvePakcage('../designer-antd/src'),
  },
  chainWebpack(config) {
    config.module.rules.get('ts-in-node_modules').include.add(extraBabelIncludes);
  },
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
    },
  },
});
