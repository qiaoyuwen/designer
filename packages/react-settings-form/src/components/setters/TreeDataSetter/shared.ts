import { INodeItem } from './types';

export const traverseTree = <T extends INodeItem>(
  data: T[],
  callback: (dataItem: T, i: number, data: T[]) => any,
  childrenKey: string = 'children',
) => {
  for (let i = 0; i < data.length; i++) {
    callback(data[i], i, data);
    if (data[i]?.[childrenKey]) {
      traverseTree(data[i]?.[childrenKey], callback, childrenKey);
    }
  }
};
