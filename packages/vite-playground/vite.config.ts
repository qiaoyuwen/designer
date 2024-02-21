import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { join } from 'path';

const resolvePakcage = (relativePath: string) => join(__dirname, relativePath);

const proxy = {
  dev: {
    // 接口地址代理
    '/api': {
      target: 'http://10.10.11.101:28010/ ', // 接口的域名
      secure: false, // 如果是https接口，需要配置这个参数
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/attach': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
    '/design': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
    '/prototype': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
    '/allstatic': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
  },
  test: {
    // 接口地址代理
    '/api': {
      target: 'https://moreapi.gcongo.com.cn/ ', // 接口的域名
      secure: false, // 如果是https接口，需要配置这个参数
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/attach': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
    '/design': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
    '/prototype': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
    '/allstatic': {
      target: 'https://modesign.gcongo.com.cn',
      secure: false,
      changeOrigin: true,
    },
  },
  prod: {
    // 接口地址代理
    '/api': {
      target: 'https://moreapi.onebuygz.com/ ', // 接口的域名
      secure: false, // 如果是https接口，需要配置这个参数
      changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
    '/attach': {
      target: 'https://modesign.onebuygz.com',
      secure: false,
      changeOrigin: true,
    },
    '/design': {
      target: 'https://modesign.onebuygz.com',
      secure: false,
      changeOrigin: true,
    },
    '/prototype': {
      target: 'https://modesign.onebuygz.com',
      secure: false,
      changeOrigin: true,
    },
    '/allstatic': {
      target: 'https://modesign.onebuygz.com',
      secure: false,
      changeOrigin: true,
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
        '@designer/utils': resolvePakcage('../utils/src'),
        '@designer/core': resolvePakcage('../core/src'),
        '@designer/react': resolvePakcage('../react/src'),
        '@designer/react-settings-form': resolvePakcage('../react-settings-form/src'),
        '@designer/formily-antd': resolvePakcage('../formily-antd/src'),
        '@designer/designer-antd': resolvePakcage('../designer-antd/src'),
      },
    },
    css: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
    server: {
      host: '0.0.0.0',
      port: 9000,
      proxy: proxy[mode],
    },
    build: {
      sourcemap: mode !== 'prod',
    },
  };
});
