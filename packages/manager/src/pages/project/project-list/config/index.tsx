import { useProject, useProjectPages } from '@/data';
import { PageContainer } from '@ant-design/pro-layout';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { IRouteComponentProps, history } from 'umi';
import { DesignerAntd } from '@designer/designer-antd';
import { ProjectPageServices } from '@/services';
import { Empty, message } from 'antd';
import { RouterWidget, traverseTree } from './RouterWidget';

const ProjectConfigPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [project, loadProject] = useProject(id);
  const [projectPages, loadProjectPages] = useProjectPages(project?.id);
  const [curRouter, setCurRouter] = useState<any>();

  const pageOptions = useMemo(() => {
    return (projectPages || []).map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [projectPages]);

  const routers = useMemo(() => {
    let result = [];
    try {
      result = JSON.parse(project?.menuConfig || '[]');
    } catch {}
    return result;
  }, [project]);

  useEffect(() => {
    let firstLeafRouter: any;
    let find: any;
    traverseTree(routers, (item) => {
      if (item.key === curRouter?.key) {
        find = item;
      }
      if (!firstLeafRouter) {
        if (!item.children || item.children.length === 0) {
          firstLeafRouter = item;
        }
      }
    });
    if (!find) {
      setCurRouter(firstLeafRouter);
    }
  }, [routers]);

  if (!project || !projectPages) {
    return null;
  }

  const reload = () => {
    loadProject();
    loadProjectPages();
  };

  const onSave = async (schemaJson: string) => {
    const curPage = projectPages.find((item) => item.id === curRouter?.pageId);
    if (!curPage) {
      return;
    }
    Promise.all([
      ProjectPageServices.updateProjectPage({
        id: curPage.id,
        schemaJson,
      }),
    ]).then(() => {
      reload();
      message.success('保存成功');
    });
  };

  const onBack = () => {
    history.goBack();
  };

  const onPreview = async (schemaJson: string) => {
    await onSave(schemaJson);
    window.open(`/preview?id=${id}`, '_blank');
  };

  const render = () => {
    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
        }}
      >
        <RouterWidget
          projectId={id}
          routers={routers}
          selectedKeys={curRouter ? [curRouter.key] : []}
          onOk={() => {
            reload();
          }}
          onSelect={(key) => {
            traverseTree(routers, (item) => {
              if (item.key === key) {
                setCurRouter(item);
              }
            });
          }}
        />
        <div
          style={{
            display: 'flex',
            flex: 1,
          }}
        >
          {projectPages.length === 0 ? (
            <Empty
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                marginLeft: 0,
                paddingTop: 100,
              }}
              description="暂无页面, 请先添加页面"
            />
          ) : (
            <DesignerAntd
              title={`${project.name}: ${curRouter?.name || ''}`}
              initialRouterData={project.menuConfig}
              initialSchema={projectPages.find((item) => item.id === curRouter?.pageId)?.schemaJson}
              onSave={onSave}
              onBack={onBack}
              onPreview={onPreview}
              hideBackBtn={props.route.layout === false}
              pageOptions={pageOptions}
            />
          )}
        </div>
      </div>
    );
  };

  if (props.route.layout === false) {
    return render();
  }

  return <PageContainer>{render()}</PageContainer>;
};

export default ProjectConfigPage;
