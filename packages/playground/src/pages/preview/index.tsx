import { FunctionComponent } from 'react';
import { IRouteComponentProps } from 'umi';
import { PreviewWidget } from '@designer/designer-antd';

const PreviewPage: FunctionComponent<IRouteComponentProps<{}, { id: string }>> = (props) => {
  const getJson = () => {
    return localStorage.getItem('designer-schema') || '';
  };
  return <PreviewWidget schemaJson={getJson()} />;
};

export default PreviewPage;
