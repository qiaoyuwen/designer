/**
 * 遍历树形结构
 * @param tree 数组
 * @param cb 回调
 * @param options 配置
 */
export function visitTree<T extends Record<string, any>> (
  tree: T[],
  cb: (item: T, parent: T | undefined, deep: number) => void,
  options: { childrenMapName: string } = {
    childrenMapName: 'children'
  }): void {
  // 定义一个递归方法
  const deepFn = function (data: T[], parent: T | undefined, deep: number) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      cb(item, parent, deep);
      const childrenVal = item[options.childrenMapName] as T[];
      if (childrenVal && childrenVal.length > 0) {
        deepFn(childrenVal, item, deep + 1);
      }
    }
  };

  deepFn(tree, undefined, 1);
}


/**
 * 数组转成树形结构数组
 * @param arr 数组
 * @param options 配置
 */
export function arrToTree<T extends Record<string, any>> (
  arr: T[] = [],
  options: {
    idMapName: string,
    parentIdMapName: string,
    rootParentId: string,
    childrenMapName: string,
    cb?: (item: T) => void
  } = {
    idMapName: 'id',
    parentIdMapName: 'parentId',
    rootParentId: '0',
    childrenMapName: 'children'
  }): T[] {
  // 合并
  const configs = { ...options };

  const tree = [];
  const childrenOf: Record<string, any> = {};

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    const id = item[configs.idMapName];
    const pid = item[configs.parentIdMapName];

    childrenOf[id] = childrenOf[id] || [];
    // @ts-ignore
    item[configs.childrenMapName] = childrenOf[id];

    if (configs.cb) {
      configs.cb(item);
    }

    if ((pid).toString() !== (configs.rootParentId).toString()) {
      childrenOf[pid] = childrenOf[pid] || [];
      childrenOf[pid].push(item);
    } else {
      tree.push(item);
    }
  }
  // 去掉空children
  visitTree(tree, (v) => {
    if (!v[configs.childrenMapName] || v[configs.childrenMapName].length === 0) {
      delete v[configs.childrenMapName];
    }
  });
  return tree;
}


/**
 * 将树形数组转换成数组
 * @param tree 树形结构数组
 * @param options 配置
 */
export function treeToArr<T extends Record<string, any>> (tree: T[], options: {
  deepMapName: string;
  parentMapName: string;
  childrenMapName: string;
  clearChildren: boolean;
  /** 转换成数组结构时回调 */
  cb?: (item: T, parent?: T, deep?: number) => void;
} = {
  deepMapName: 'deep',
  parentMapName: 'parent',
  childrenMapName: 'children',
  clearChildren: true
}): T[] {
  // 合并
  const configs = { ...options };

  const result: T[] = [];

  const deepFn = function (list: T[], parent: T | undefined, deep: number) {
    for (let _i = 0; _i < list.length; _i++) {
      const i = list[_i];
      // @ts-ignore
      i[configs.deepMapName] = deep;
      // @ts-ignore
      i[configs.parentMapName] = parent;
      if (configs.cb) {
        configs.cb(i, parent, deep);
      }
      result.push(i);

      const children = i[configs.childrenMapName];

      if (children != null &&
        Array.isArray(children) &&
        children.length > 0) {
        deepFn(children, i, deep + 1);
      }

      if (configs.clearChildren) {
        delete i[configs.childrenMapName];
      }
    }
  };
  deepFn(tree, undefined, 0);
  return result;
}
