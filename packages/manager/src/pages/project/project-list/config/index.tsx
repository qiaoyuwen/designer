import { useProject, useProjectPages } from '@/data';
import { PageContainer } from '@ant-design/pro-layout';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { IRouteComponentProps, history } from 'umi';
import { DesignerAntd } from '@designer/designer-antd';
import { ProjectPageServices, ProjectServices } from '@/services';
import { Empty, message } from 'antd';
import { RouterWidget, traverseTree } from './RouterWidget';

const ProjectConfigPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [project, loadProject] = useProject(id);
  const [projectPages, loadProjectPages] = useProjectPages(project?.id);
  const [curRouter, setCurRouter] = useState<any>();

  const routers = useMemo(() => {
    let result = [];
    try {
      result = JSON.parse(project?.menuConfig || '[]');
    } catch {}
    return result;
  }, [project]);

  const pageOptions = useMemo(() => {
    return (projectPages || []).map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [projectPages]);

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

  const onSave = async (schemaJson: string, routerJson: string) => {
    const curPage = projectPages.find((item) => item.id === curRouter?.pageId);
    if (!curPage) {
      return;
    }
    Promise.all([
      ProjectServices.updateProject({
        id: project!.id,
        menuConfig: routerJson,
      }),
      ProjectPageServices.updateProjectPage({
        id: curPage.id,
        schemaJson,
      }),
    ]).then(() => {
      message.success('保存成功');
    });
  };

  const onBack = () => {
    history.goBack();
  };

  const onPreview = async (schemaJson: string, routerJson: string) => {
    await onSave(schemaJson, routerJson);
    window.open(`/preview?id=${id}`, '_blank');
  };

  return (
    <PageContainer>
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
            loadProject();
            loadProjectPages();
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
              initialSchema={projectPages.find((item) => item.id === curRouter?.pageId)?.schemaJson}
              initialRouterData={project.menuConfig}
              onSave={onSave}
              onBack={onBack}
              pageOptions={pageOptions}
              onPreview={onPreview}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ProjectConfigPage;
