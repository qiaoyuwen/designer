import { ProjectPageServices } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Tree } from 'antd';
import { FC, useMemo, useState } from 'react';
import AddPageModal, { PageFormData } from './add-page-modal';
import { Header } from './Header';
import styles from './index.less';
import { Title } from './Title';
import { uid } from '@designer/utils';
import { ProjectPage } from '@/models'

export const traverseTree = <
  T extends {
    key: string;
    children: T[];
  },
>(
  data: T[],
  callback: (dataItem: T, i: number, data: T[]) => any,
) => {
  for (let i = 0; i < data.length; i++) {
    callback(data[i], i, data);
    if (data[i]?.children) {
      traverseTree(data[i].children, callback);
    }
  }
};

interface IRouterWidget {
  projectId: string;
  selectedKeys: string[];
  routers: any[];
  onOk?: () => void;
  onSelect?: (key: string) => void;
}

export const RouterWidget: FC<IRouterWidget> = ({ projectId, selectedKeys, routers, onSelect, ...props }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [curRouter, setCurRouter] = useState<any>();

  const treeData = useMemo(() => {
    traverseTree(routers, (item) => {
      item.title = item.name;
      if (item.children && item.children.length > 0) {
        item.selectable = false;
      }
    });
    return routers;
  }, [routers]);

  const onOk = async (data: PageFormData) => {
    const uuid = uid();
    const newItem: Partial<ProjectPage> = {
      key: uuid,
      name: data.name,
      title: data.name,
      path: data.path,
      layout: data.layout,
      hideInMenu: data.hideInMenu,
      children: [],
    };
    let newRouters: any[] = [];
    if (curRouter) {
      newRouters = [...routers];
      traverseTree(newRouters, (dataItem) => {
        if (dataItem.key === curRouter.key) {
          if (!dataItem?.children) { dataItem.children = [] }
          dataItem.children.push(newItem);
        }
      });
    } else {
      newRouters = [...routers, newItem];
    }
    await ProjectPageServices.saveProjectPage({
      projectId,
      routers: newRouters
    })
    props.onOk?.();
    message.success('操作成功');
    setVisible(false);
  };

  return (
    <div className={styles.container}>
      <Header
        title="菜单"
        extra={
          <Button
            type="text"
            onClick={() => {
              setCurRouter(undefined);
              setVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            新增页面
          </Button>
        }
      />
      <Tree
        selectedKeys={selectedKeys}
        blockNode
        draggable={false}
        defaultExpandAll
        defaultExpandParent
        autoExpandParent
        showLine={{ showLeafIcon: false }}
        treeData={treeData}
        onSelect={(selectedKeys) => {
          onSelect?.(selectedKeys[0] as string);
        }}
        titleRender={(node) => {
          return (
            <Title
              projectId={projectId}
              routers={routers}
              curNode={node}
              onAdd={() => {
                setCurRouter(node);
                setVisible(true);
              }}
              onRemove={props.onOk}
            />
          );
        }}
        style={{
          marginTop: 24,
        }}
      />
      <AddPageModal
        visible={visible}
        onOk={onOk}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};
