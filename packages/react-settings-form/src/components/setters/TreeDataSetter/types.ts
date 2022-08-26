export interface IDataSourceItem {
  children?: any[];
  [key: string]: any;
}

export interface INodeItem extends IDataSourceItem {
  key: string;
  children?: INodeItem[];
}

export interface ITreeDataSource {
  dataSource: INodeItem[];
  selectedKey: string;
}
