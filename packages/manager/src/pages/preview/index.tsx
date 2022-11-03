import { useProjectPage } from '@/data';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { history, IRouteComponentProps } from 'umi';
import { PreviewWidget } from '@designer/designer-antd';
import styles from './index.less';
import { Menu } from 'antd';
import { PageContainer } from '@ant-design/pro-components';

const traverseTree = <T extends { key: string; children: any[] }>(
  data: T[],
  callback: (dataItem: T, i: number, data: T[]) => any,
) => {
  for (let i = 0; i < data.length; i++) {
    callback(data[i], i, data);
    if (data[i]?.children) {
      traverseTree(data[i]?.children, callback);
    }
  }
};

const PreviewPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [projectPage] = useProjectPage(id);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const routers = useMemo(() => {
    let result = [];
    try {
      result = JSON.parse(projectPage?.project?.menuConfig || '[]');
    } catch {}
    return result;
  }, [projectPage]);

  const items = useMemo(() => {
    if (!projectPage) {
      return [];
    }
    const filter = (innerRouters: any[]) => {
      const filterResult = [];
      for (const innerRouter of innerRouters) {
        const newItem: any = {
          key: innerRouter.key || innerRouter.name,
          label: `${innerRouter.name}${innerRouter.hideInMenu ? ' (隐藏菜单)' : ''}`,
        };
        if (innerRouter.children && innerRouter.children.length !== 0) {
          newItem.children = filter(innerRouter.children);
        }
        filterResult.push(newItem);
      }
      return filterResult;
    };
    const result = filter(routers);
    return result;
  }, [routers]);

  const getRouter = (key: string) => {
    let router: any;
    traverseTree(routers, (item: any) => {
      if (item.key === key || item.pageId === key) {
        router = item;
      }
    });
    return router;
  };

  useEffect(() => {
    const router = getRouter(projectPage?.id || '');
    if (router) {
      setSelectedKeys([router.key]);
    }
  }, [projectPage]);

  if (!projectPage) {
    return null;
  }

  const onSelect = ({ key }: { key: string }) => {
    const router = getRouter(key);
    if (router) {
      history.push(`/preview?id=${router.pageId}`);
    }
    setSelectedKeys([key]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Menu items={items} mode="inline" onSelect={onSelect} selectedKeys={selectedKeys} inlineCollapsed={false} />
      </div>
      <div className={styles.content}>
        {
          <PageContainer
            header={{
              title: getRouter(selectedKeys[0])?.name,
            }}
          >
            <PreviewWidget schemaJson={projectPage.schemaJson} />
          </PageContainer>
        }
      </div>
    </div>
  );
};

export default PreviewPage;
