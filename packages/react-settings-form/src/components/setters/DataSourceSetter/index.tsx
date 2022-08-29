import { createTreeDataSetter, ITreeDataSetterProps } from '../TreeDataSetter';

export const DataSourceSetter: React.FC<ITreeDataSetterProps> = createTreeDataSetter({
  localeTokenPrefix: 'SettingComponents.DataSourceSetter',
  type: 'Option',
});
