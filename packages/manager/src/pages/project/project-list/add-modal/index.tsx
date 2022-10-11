import CustomModalForm from '@/components/custom-modal-form';
import { Project } from '@/models';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { AddModalProps, useProjectAddModal } from './hooks';

const AddModal: FunctionComponent<AddModalProps> = (props) => {
  const { formData } = props;
  const [{ submit }] = useProjectAddModal(props);

  return (
    <CustomModalForm<Project> title={`${formData ? '重置密码' : '用户'}`} submit={submit} {...props}>
      <ProFormText name="name" label="项目名" rules={[{ required: true, message: '必填' }]} />
      <ProFormTextArea
        name="description"
        label="项目描述"
        fieldProps={{
          rows: 4,
        }}
      />
    </CustomModalForm>
  );
};

export default AddModal;
