import { createTreeDataSetter, ITreeDataSetterProps } from '../TreeDataSetter';

export const RouterSetter: React.FC<ITreeDataSetterProps> = createTreeDataSetter({
  localeTokenPrefix: 'SettingComponents.RouterSetter',
  type: 'Router',
});
