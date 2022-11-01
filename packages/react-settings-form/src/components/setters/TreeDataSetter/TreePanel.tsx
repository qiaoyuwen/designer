import React, { Fragment } from 'react';
import { Tree, Button, TreeProps } from 'antd';
import { uid } from '@formily/shared';
import { observer } from '@formily/reactive-react';
import { usePrefix, TextWidget, IconWidget } from '@designer/react';
import { Title } from './Title';
import { Header } from './Header';
import { traverseTree } from './shared';
import { ITreeDataSource, INodeItem } from './types';
import { GlobalRegistry } from '@designer/core';
import './styles.less';
import { TreeDataType } from '.';

const limitTreeDrag = ({ dropPosition }) => {
  if (dropPosition === 0) {
    return false;
  }
  return true;
};

export interface ITreePanelProps {
  labelKey: string;
  treeDataSource: ITreeDataSource;
  allowTree: boolean;
  localeTokenPrefix: string;
  type: TreeDataType;

  childrenKey: string;
}

export const TreePanel: React.FC<ITreePanelProps> = observer(
  ({ labelKey, localeTokenPrefix, type, childrenKey, ...props }) => {
    const prefix = usePrefix('data-source-setter');
    const dropHandler = (info: Parameters<TreeProps['onDrop']>[0]) => {
      const dropKey = info.node?.key;
      const dragKey = info.dragNode?.key;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const data = [...props.treeDataSource.dataSource];
      // Find dragObject
      let dragObj: INodeItem;
      traverseTree(data, (item, index, arr) => {
        if (arr[index].key === dragKey) {
          arr.splice(index, 1);
          dragObj = item;
        }
      });
      if (!info.dropToGap) {
        traverseTree(data, (item) => {
          if (item.key === dropKey) {
            item[childrenKey] = item[childrenKey] || [];
            item[childrenKey].unshift(dragObj);
          }
        });
      } else if ((info.node.children || []).length > 0 && info.node.expanded && dropPosition === 1) {
        traverseTree(data, (item) => {
          if (item.key === dropKey) {
            item[childrenKey] = item[childrenKey] || [];
            item[childrenKey].unshift(dragObj);
          }
        });
      } else {
        let ar: any[];
        let i: number;
        traverseTree(data, (item, index, arr) => {
          if (item.key === dropKey) {
            ar = arr;
            i = index;
          }
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      props.treeDataSource.dataSource = data;
    };

    return (
      <Fragment>
        <Header
          title={<TextWidget token={`${localeTokenPrefix}.dataSourceTree`} />}
          extra={
            <Button
              type="text"
              onClick={() => {
                const uuid = uid();
                const dataSource = props.treeDataSource.dataSource;
                const initialItem = {
                  [labelKey]: `${GlobalRegistry.getDesignerMessage(`${localeTokenPrefix}.item`)} ${
                    dataSource.length + 1
                  }`,

                  key: uuid,
                  [childrenKey]: [],
                };
                if (type === 'Option') {
                  initialItem.value = uuid;
                }
                props.treeDataSource.dataSource = dataSource.concat({ ...initialItem });
              }}
              icon={<IconWidget infer="Add" />}
            >
              <TextWidget token={`${localeTokenPrefix}.addNode`} />
            </Button>
          }
        />
        <div className={`${prefix + '-layout-item-content'}`}>
          <Tree
            blockNode
            draggable={true}
            allowDrop={props.allowTree ? () => true : limitTreeDrag}
            defaultExpandAll
            defaultExpandParent
            autoExpandParent
            showLine={{ showLeafIcon: false }}
            treeData={props.treeDataSource.dataSource.map((item) => ({
              key: item.key,
              [labelKey]: item[labelKey],
              title: item[labelKey],
              children: item[childrenKey],
            }))}
            onDragEnter={() => {}}
            onDrop={dropHandler}
            titleRender={(titleProps: INodeItem) => {
              return (
                <Title
                  {...titleProps}
                  duplicateKey={titleProps.key}
                  labelKey={labelKey}
                  localeTokenPrefix={localeTokenPrefix}
                  treeDataSource={props.treeDataSource}
                  type={type}
                  childrenKey={childrenKey}
                ></Title>
              );
            }}
            onSelect={(selectedKeys) => {
              if (selectedKeys[0]) {
                props.treeDataSource.selectedKey = selectedKeys[0].toString();
              }
            }}
          ></Tree>
        </div>
      </Fragment>
    );
  },
);
