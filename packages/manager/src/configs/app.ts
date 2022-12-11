import devConfig from './app.dev';
import testConfig from './app.test';
import prodConfig from './app.pre';
import { IAppConfig } from '@/models'

const config = (() => {
  console.log('当前环境 :>> ', REACT_APP_ENV);
  switch (REACT_APP_ENV) {
    case 'dev':
      return devConfig;
    case 'test':
      return testConfig;
    case 'pre':
      return prodConfig;
    default:
      return prodConfig;
  }
})();

export const AppCommonConfig: IAppConfig = {
  appKey: '',
  endpointCode: '',
  foundByteBigdataURL: '',
  prefixs: {
    api: ''
  }
}

export const AppConfig: IAppConfig = {
  ...AppCommonConfig,
  ...config
};
