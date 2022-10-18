import CustomModalForm from '@/components/custom-modal-form';
import { User } from '@/models';
import { ProFormText } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { AddModalProps, useUserAddModal } from './hooks';

const AddModal: FunctionComponent<AddModalProps> = (props) => {
  const [{ submit }] = useUserAddModal(props);

  return (
    <CustomModalForm<User> title={'新增用户'} submit={submit} {...props}>
      <ProFormText name="username" label="用户名" rules={[{ required: true, message: '必填' }]} />
    </CustomModalForm>
  );
};

export default AddModal;
