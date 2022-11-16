/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    // '/api/': {
    //   // 要代理的地址
    //   // target: 'http://127.0.0.1:8080',
    //   // 内测服务地址
    //   target: 'http://10.10.11.102:61080',
    //   // 配置了这个可以从 http 代理到 https
    //   // 依赖 origin 的功能可能需要这个，比如 cookie
    //   changeOrigin: true,
    // },
    '/api': {
      // 谭斌服务
      target: 'http://10.10.15.56:28011',
      changeOrigin: true,
      pathRewrite: { '^/api': '' }
    },
  },
};
