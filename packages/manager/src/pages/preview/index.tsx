import { useProject } from '@/data';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { IRouteComponentProps } from 'umi';
import { PreviewWidget } from '@designer/designer-antd';
import styles from './index.less';
import { Menu } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { ProjectPage } from '@/models';

const traverseTree = <T extends { key: string; children: any[] }>(
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

const PreviewPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id, teamId } = props.location.query as {id: string; teamId: string};
  const [project] = useProject({ projectId: id, teamId });
  // const [projectPages] = useProjectPages(id);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const routers = useMemo(() => {
    let result = [];
    try {
      result = JSON.parse(project?.menuConfig || '[]');
    } catch {}
    return result;
  }, [project]);

  const items = useMemo(() => {
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
      if (item.key === key) {
        router = item;
      }
    });
    return router;
  };

  useEffect(() => {
    let find: any;
    traverseTree(routers, (item: any) => {
      if (!item.children || item.children.length === 0) {
        if (!find) {
          find = item;
        }
      }
    });
    if (find) {
      setSelectedKeys([find.key]);
    }
  }, [routers]);

  const projectPage = useMemo(() => {
    let result: ProjectPage | undefined;
    const router = getRouter(selectedKeys[0]);
    for (const page of project?.pageList || []) {
      if (page.id === router?.id) {
        result = page;
      }
    }
    return result;
  }, [selectedKeys, project?.pageList]);

  const UmiHistory = useMemo(() => {
    return {
      push: (pageId: string) => {
        let router: any;
        traverseTree(routers, (item: any) => {
          if (item.id === pageId) {
            router = item;
          }
        });
        if (router?.key) {
          setSelectedKeys([router.key]);
        }
      },
    };
  }, [routers]);

  if (!projectPage) {
    return null;
  }

  const onSelect = ({ key }: { key: string }) => {
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
            <PreviewWidget schemaJson={projectPage.schemaJson} UmiHistory={UmiHistory} />
          </PageContainer>
        }
      </div>
    </div>
  );
};

export default PreviewPage;
