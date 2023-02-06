import { DesignerAntd } from '@designer/designer-antd';
import { message } from 'antd';

export default function IndexPage() {
  const onSave = (schemaJson: string) => {
    localStorage.setItem('designer-schema', schemaJson);
    message.success('保存成功');
  };

  const onPreview = (schemaJson: string) => {
    onSave(schemaJson);
    window.open('/preview', '_blank');
  };

  const getJson = () => {
    return localStorage.getItem('designer-schema') || '';
  };

  return <DesignerAntd initialSchema={getJson()} onSave={onSave} onPreview={onPreview} />;
}
