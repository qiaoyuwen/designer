import { Settings as LayoutSettings } from '@ant-design/pro-components';
const { REACT_APP_ENV } = process.env;

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Designer',
  pwa: false,
  logo: REACT_APP_ENV === 'pro' ? '/designer/logo.svg' : '/logo.svg',
  iconfontUrl: '',
};

export default Settings;
