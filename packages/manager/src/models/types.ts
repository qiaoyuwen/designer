export interface SelectOption {
  label: string;
  value: string;
}

export interface IAppConfig {
  appKey: string;
  endpointCode: string;
  foundByteBigdataURL: string;
  prefixs: {
    api: string,
  }
}
