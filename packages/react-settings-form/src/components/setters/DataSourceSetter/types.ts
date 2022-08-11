export interface IDataSourceItem {
  label?: '';
  value?: any;
  children?: any[];
}

export interface INodeItem {
  key: string;
  title?: string;
  duplicateKey?: string;
  map?: { label: string; value: any }[];
  children?: INodeItem[];
}

export interface ITreeDataSource {
  dataSource: INodeItem[];
  selectedKey: string;
}
