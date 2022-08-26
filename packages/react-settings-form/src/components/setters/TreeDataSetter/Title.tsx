import { clone, toArr, uid } from '@formily/shared';
import { observer } from '@formily/reactive-react';
import { IconWidget, TextWidget, usePrefix } from '@designer/react';
import { GlobalRegistry, takeMessage } from '@designer/core';
import { ITreeDataSource } from './types';
import { traverseTree } from './shared';
import './styles.less';

export interface ITitleProps {
  duplicateKey: string;
  treeDataSource: ITreeDataSource;
  labelKey: string;
  localeTokenPrefix: string;
}

export const Title: React.FC<ITitleProps> = observer(({ labelKey, localeTokenPrefix, ...props }) => {
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
                const arr = toArr(dataItem.children);
                const uuid = uid();
                const initialItem = {
                  [labelKey]: `${GlobalRegistry.getDesignerMessage(`${localeTokenPrefix}.item`)} ${arr.length + 1}`,
                };
                arr.push({
                  ...initialItem,
                  key: uuid,
                  children: [],
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
              console.log('data[i].key === props.duplicateKey', data[i].key, props.duplicateKey);
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
