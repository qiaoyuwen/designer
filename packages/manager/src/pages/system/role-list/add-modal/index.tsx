import CustomModalForm from '@/components/custom-modal-form';
import { Role } from '@/models';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { AddModalProps, useRoleAddModal } from './hooks';

const AddModal: FunctionComponent<AddModalProps> = (props) => {
  const { formData } = props;
  const [{ submit }] = useRoleAddModal(props);

  return (
    <CustomModalForm<Role> title={`${formData ? '编辑角色' : '新增角色'}`} submit={submit} {...props}>
      <ProFormText name="name" label="角色名" rules={[{ required: true, message: '必填' }]} />
      <ProFormTextArea
        name="description"
        label="角色描述"
        fieldProps={{
          rows: 4,
        }}
      />
    </CustomModalForm>
  );
};

export default AddModal;
