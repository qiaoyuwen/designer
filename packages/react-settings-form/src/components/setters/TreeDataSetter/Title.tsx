import { clone, toArr, uid } from '@formily/shared';
import { observer } from '@formily/reactive-react';
import { IconWidget, TextWidget, usePrefix } from '@designer/react';
import { GlobalRegistry, takeMessage } from '@designer/core';
import { ITreeDataSource } from './types';
import { traverseTree } from './shared';
import './styles.less';
import { TreeDataType } from '.';

export interface ITitleProps {
  duplicateKey: string;
  treeDataSource: ITreeDataSource;
  labelKey: string;
  localeTokenPrefix: string;
  type: TreeDataType;
  childrenKey: string;
}

export const Title: React.FC<ITitleProps> = observer(({ labelKey, localeTokenPrefix, type, childrenKey, ...props }) => {
  const prefix = usePrefix('tree-data-setter-node-title');

  const renderTitle = () => {
    const nodeTitle = props[labelKey];
    if (nodeTitle === undefined) return <TextWidget token={`${localeTokenPrefix}.defaultTitle`} />;
    else return nodeTitle + '';
  };

  return (
    <div className={prefix}>
      <span style={{ marginRight: '5px' }}>{renderTitle()}</span>
      <div>
        <IconWidget
          title={takeMessage(`${localeTokenPrefix}.addNode`)}
          className={prefix + '-icon'}
          style={{ marginRight: 5 }}
          infer="Add"
          onClick={() => {
            const newDataSource = clone(props?.treeDataSource?.dataSource);
            traverseTree(newDataSource || [], (dataItem) => {
              if (dataItem.key === props.duplicateKey) {
                const arr = toArr(dataItem[childrenKey]);
                const uuid = uid();
                const initialItem = {
                  [labelKey]: `${GlobalRegistry.getDesignerMessage(`${localeTokenPrefix}.item`)} ${arr.length + 1}`,
                  key: uuid,
                  [childrenKey]: [],
                };
                if (type === 'Option') {
                  initialItem.value = uuid;
                }
                arr.push({
                  ...initialItem,
                });
              }
            });
            props.treeDataSource.dataSource = newDataSource;
          }}
        />
        <IconWidget
          className={prefix + '-icon'}
          title={takeMessage(`${localeTokenPrefix}.removeNode`)}
          infer="Remove"
          onClick={() => {
            const newDataSource = clone(props?.treeDataSource?.dataSource);
            traverseTree(newDataSource || [], (dataItem, i, data) => {
              if (data[i].key === props.duplicateKey) {
                toArr(data).splice(i, 1);
              }
            });
            props.treeDataSource.dataSource = newDataSource;
          }}
        />
      </div>
    </div>
  );
});
