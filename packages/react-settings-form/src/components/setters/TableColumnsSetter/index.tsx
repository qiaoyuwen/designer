import { createTreeDataSetter, ITreeDataSetterProps } from '../TreeDataSetter';

export const TableColumnsSetter: React.FC<ITreeDataSetterProps> = createTreeDataSetter({
  localeTokenPrefix: 'SettingComponents.TableColumnsSetter',
  type: 'TableColumn',
});
