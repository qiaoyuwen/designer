import { useProject } from '@/data';
import { PageContainer } from '@ant-design/pro-layout';
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import { IRouteComponentProps, history } from 'umi';
import { DesignerAntd } from '@designer/designer-antd';
import { ProjectPageServices, updateProjectRequest, uploadFileRequest } from '@/services'
import { Empty, message } from 'antd';
import { photo } from '@foundbyte/util';
import { RouterWidget, traverseTree } from './RouterWidget';
import { base64ToFile } from '@/utils'

const ProjectConfigPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id, teamId } = props.location.query as {id: string; teamId: string};
  const ref = useRef(null);
  const [project, loadProject] = useProject({ projectId: id, teamId });
  const [curRouter, setCurRouter] = useState<any>();

  const pageOptions = useMemo(() => {
    return (project?.pageList || []).map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [project]);

  const routers = useMemo(() => {
    let result = [];
    try {
      result = JSON.parse(project?.menuConfig || '[]');
    } catch { }
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

  if (!project || !project?.pageList) {
    return null;
  }

  const reload = () => {
    loadProject();
  };

  const onSave = async (schemaJson: string) => {
    photo({
      ref: ref.current,
      download: false,
      width: 288,
      height: 162,
      quality: 0.75,
    }).then(async (url) => {
      message.loading('正在保存...')
      // 保存项目信息
      const projectParams: Parameters<typeof updateProjectRequest>[0] = {
        id: project.id,
        teamId: project.teamId,
        folderId: project.folderId,
        name: project.name,
        accessType: project.accessType
      }
      // 1.缩略图存储
      if (url) {
        const file = base64ToFile(url)
        if(file) {
          projectParams.cover = await uploadFileRequest(file) ?? ''
        }
      }
      // 更新项目信息
      const updateRes = await updateProjectRequest(projectParams)
      if (!updateRes) {
        message.destroy()
        return
      }

      // 保存菜单
      const curPage = project?.pageList?.find((item) => item.key === curRouter?.key);
      if (!curPage) {
        message.destroy()
        return;
      }
      curPage.schemaJson = schemaJson
      await ProjectPageServices.saveProjectPage({
        projectId: id,
        routers: project?.pageList || []
      })
      message.destroy()
      reload();
      message.success('保存成功');
    })
  };

  const onBack = () => {
    history.goBack();
  };

  const onPreview = async (schemaJson: string) => {
    await onSave(schemaJson);
    window.open(`/preview?id=${id}&teamId=${teamId}`, '_blank');
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
          ref={ref}
        >
          {project?.pageList?.length === 0 ? (
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
              initialSchema={project?.pageList?.find((item) => item.key === curRouter?.key)?.schemaJson}
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
