import { clone, toArr, uid } from '@formily/shared';
import { observer } from '@formily/reactive-react';
import { IconWidget, TextWidget, usePrefix } from '@designer/react';
import { GlobalRegistry, takeMessage } from '@designer/core';
import { INodeItem, ITreeDataSource } from './types';
import { traverseTree } from './shared';
import './styles.less';
export interface ITitleProps extends INodeItem {
  treeDataSource: ITreeDataSource;
  defaultOptionValue: {
    label: string;
    value: any;
  }[];
}

export const Title: React.FC<ITitleProps> = observer((props) => {
  const prefix = usePrefix('data-source-setter-node-title');
  const getTitleValue = (dataSource) => {
    const optionalKeys = ['label', 'title', 'header'];
    let nodeTitle: string;
    optionalKeys.some((key) => {
      const title = toArr(dataSource).find((item) => item.label === key)?.value;
      if (title !== undefined) {
        nodeTitle = title;
        return true;
      }
      return false;
    });
    if (nodeTitle === undefined) {
      toArr(dataSource || []).some((item) => {
        if (item.value && typeof item.value === 'string') {
          nodeTitle = item.value;
          return true;
        }
        return false;
      });
    }
    return nodeTitle;
  };

  const renderTitle = (dataSource) => {
    const nodeTitle = getTitleValue(dataSource);
    if (nodeTitle === undefined) return <TextWidget token="SettingComponents.DataSourceSetter.defaultTitle" />;
    else return nodeTitle + '';
  };

  return (
    <div className={prefix}>
      <span style={{ marginRight: '5px' }}>{renderTitle(props?.map || [])}</span>
      <div>
        <IconWidget
          title={takeMessage('SettingComponents.DataSourceSetter.addNode')}
          className={prefix + '-icon'}
          style={{ marginRight: 5 }}
          infer="Add"
          onClick={() => {
            const newDataSource = clone(props?.treeDataSource?.dataSource);
            traverseTree(newDataSource || [], (dataItem) => {
              if (dataItem.key === props.duplicateKey) {
                const arr = toArr(dataItem.children);
                const uuid = uid();
                const initialKeyValuePairs = props.defaultOptionValue?.map((item) => ({ ...item })) || [
                  {
                    label: 'label',
                    value: `${GlobalRegistry.getDesignerMessage(`SettingComponents.DataSourceSetter.item`)} ${
                      arr.length + 1
                    }`,
                  },
                  { label: 'value', value: uuid },
                ];
                arr.push({
                  key: uuid,
                  duplicateKey: uuid,
                  map: initialKeyValuePairs,
                  children: [],
                });
              }
            });
            props.treeDataSource.dataSource = newDataSource;
          }}
        />
        <IconWidget
          className={prefix + '-icon'}
          title={takeMessage('SettingComponents.DataSourceSetter.removeNode')}
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
