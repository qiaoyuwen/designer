import { useProjectPage, useProjectPages } from '@/data';
import { PageContainer } from '@ant-design/pro-layout';
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

  return (
    <PageContainer>
      <DesignerAntd
        title={`${projectPage.name}`}
        initialSchema={projectPage.schemaJson}
        initialRouterData={projectPage.project?.menuConfig}
        onSave={onSave}
        onBack={onBack}
        pageOptions={pageOptions}
      />
    </PageContainer>
  );
};

export default ConfigPage;
