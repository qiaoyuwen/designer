import { useProjectPage } from '@/data';
import { PageContainer } from '@ant-design/pro-layout';
import { FunctionComponent } from 'react';
import { IRouteComponentProps, history } from 'umi';
import { DesignerAntd } from '@designer/designer-antd';
import { ProjectPageServices } from '@/services';
import { message } from 'antd';

const ConfigPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [projectPage] = useProjectPage(id);

  if (!projectPage) {
    return null;
  }

  const onSave = async (schemaJson: string) => {
    ProjectPageServices.updateProjectPage({
      id,
      schemaJson,
    }).then(() => {
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
        onSave={onSave}
        onBack={onBack}
      />
    </PageContainer>
  );
};

export default ConfigPage;
