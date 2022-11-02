import { useProjectPage } from '@/data';
import { FunctionComponent, useMemo } from 'react';
import { history, IRouteComponentProps } from 'umi';
import { PreviewWidget } from '@designer/designer-antd';
import styles from './index.less';
import { Menu } from 'antd';

const PreviewPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [projectPage] = useProjectPage(id);

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
        if (!innerRouter.hideInMenu) {
          const newItem: any = {
            key: innerRouter.key || innerRouter.name,
            label: innerRouter.name,
          };
          if (innerRouter.children && innerRouter.children.length !== 0) {
            newItem.children = filter(innerRouter.children);
          }
          filterResult.push(newItem);
        }
      }
      return filterResult;
    };
    const result = filter(routers);
    return result;
  }, [routers]);

  if (!projectPage) {
    return null;
  }

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

  const onSelect = ({ key }: { key: string }) => {
    let router: any;
    traverseTree(routers, (item) => {
      if (item.key === key) {
        router = item;
      }
    });
    if (router) {
      history.push(`/preview?id=${router.pageId}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Menu items={items} mode="inline" onSelect={onSelect} />
      </div>
      <div className={styles.content}>
        <PreviewWidget schemaJson={projectPage.schemaJson} />
      </div>
    </div>
  );
};

export default PreviewPage;
