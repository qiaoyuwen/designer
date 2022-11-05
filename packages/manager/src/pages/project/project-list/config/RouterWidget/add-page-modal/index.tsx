import { ProFormText, ProFormSwitch, ModalForm } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';

export interface PageFormData {
  routerKey?: string;
  name: string;
  path: string;
  layout: boolean;
  hideInMenu: boolean;
}

export interface AddPageModalProps {
  visible: boolean;
  formData?: Partial<PageFormData>;
  onOk: (data: PageFormData) => Promise<void>;
  onCancel: () => void;
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const AddPageModal: FunctionComponent<AddPageModalProps> = (props) => {
  const { formData, visible, onOk, onCancel } = props;

  return (
    <ModalForm<PageFormData>
      width={600}
      title="新增页面"
      visible={visible}
      onFinish={async (data) => {
        await onOk?.({
          ...formData,
          ...data,
        });
      }}
      modalProps={{
        onCancel,
      }}
      layout="horizontal"
      {...formItemLayout}
    >
      <ProFormText name="name" label="名称" rules={[{ required: true, message: '请输入页面名称' }]} />
      <ProFormText name="path" label="路径" rules={[{ required: true, message: '请输入页面路径' }]} />
      <ProFormSwitch name="layout" label="布局" initialValue={true} />
      <ProFormSwitch name="hideInMenu" label="隐藏菜单" initialValue={false} />
    </ModalForm>
  );
};

export default AddPageModal;
