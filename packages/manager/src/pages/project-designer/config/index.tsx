import { useProjectPage, useProjectPages } from '@/data';
import { FunctionComponent, useMemo } from 'react';
import { IRouteComponentProps, history } from 'umi';
import { DesignerAntd } from '@designer/designer-antd';
import { ProjectPageServices, ProjectServices } from '@/services';
import { message } from 'antd';

const ConfigPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [projectPage] = useProjectPage(id);
  const [projectPages] = useProjectPages(projectPage?.project?.id);

  const pageOptions = useMemo(() => {
    return (projectPages || []).map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  }, [projectPages]);

  if (!projectPage) {
    return null;
  }

  const onSave = async (schemaJson: string, routerJson: string) => {
    Promise.all([
      ProjectServices.updateProject({
        id: projectPage.project!.id,
        menuConfig: routerJson,
      }),
      ProjectPageServices.updateProjectPage({
        id,
        schemaJson,
      }),
    ]).then(() => {
      message.success('保存成功');
    });
  };

  const onBack = () => {
    history.goBack();
  };

  const onRouterSelect = (pageId: string) => {
    history.replace(`/project/project-page-list/config?id=${pageId}`);
  };

  const onPreview = async (schemaJson: string, routerJson: string) => {
    await onSave(schemaJson, routerJson);
    window.open(`/preview?id=${id}`, '_blank');
  };

  return (
    <DesignerAntd
      title={`${projectPage.name}`}
      initialSchema={projectPage.schemaJson}
      initialRouterData={projectPage.project?.menuConfig}
      onSave={onSave}
      onBack={onBack}
      pageOptions={pageOptions}
      onRouterSelect={onRouterSelect}
      onPreview={onPreview}
    />
  );
};

export default ConfigPage;
