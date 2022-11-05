import { ProjectPageServices, ProjectServices } from '@/services';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import { traverseTree } from '..';
import styles from './index.less';

export interface ITitleProps {
  projectId: string;
  routers: any[];
  curNode: any;
  onAdd?: () => void;
  onRemove?: () => void;
}

export const Title: React.FC<ITitleProps> = ({ projectId, routers, curNode, onAdd, onRemove }) => {
  return (
    <div className={styles.title}>
      <span style={{ marginRight: '5px' }}>{curNode.title}</span>
      <div>
        <PlusOutlined
          className={styles.icon}
          style={{ marginRight: 5 }}
          onClick={() => {
            onAdd?.();
          }}
        />
        <DeleteOutlined
          className={styles.icon}
          onClick={() => {
            Modal.confirm({
              title: '确认删除？',
              onOk: async () => {
                if (curNode.pageId) {
                  await ProjectPageServices.deleteProjectPage({
                    id: curNode.pageId,
                  });
                }

                const newRouters = [...routers];
                traverseTree(newRouters, (dataItem, i, data) => {
                  if (data[i].key === curNode.key) {
                    data.splice(i, 1);
                  }
                });

                await ProjectServices.updateProject({
                  id: projectId,
                  menuConfig: JSON.stringify(newRouters),
                });

                message.success('操作成功');
                onRemove?.();
              },
            });
          }}
        />
      </div>
    </div>
  );
};
