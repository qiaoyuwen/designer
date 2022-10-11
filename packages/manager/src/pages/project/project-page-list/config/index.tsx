import { useProjectPage } from '@/data';
import { PageContainer } from '@ant-design/pro-layout';
import { FunctionComponent } from 'react';
import { IRouteComponentProps } from 'umi';
import { DesignerAntd } from '@designer/designer-antd';

const ConfigPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const { id } = props.location.query;
  const [projectPage] = useProjectPage(id);

  if (!projectPage) {
    return null;
  }

  return (
    <PageContainer>
      <DesignerAntd />
    </PageContainer>
  );
};

export default ConfigPage;
