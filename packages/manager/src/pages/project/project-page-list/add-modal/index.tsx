import CustomModalForm from '@/components/custom-modal-form';
import { ProjectPage } from '@/models';
import { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { AddModalProps, useProjectAddModal } from './hooks';

const AddModal: FunctionComponent<AddModalProps> = (props) => {
  const { formData } = props;
  const [{ submit }] = useProjectAddModal(props);

  return (
    <CustomModalForm<ProjectPage> title={`${formData ? '编辑页面' : '新增页面'}`} submit={submit} {...props}>
      <ProFormText name="name" label="页面名" rules={[{ required: true, message: '必填' }]} />
      <ProFormTextArea
        name="description"
        label="页面描述"
        fieldProps={{
          rows: 4,
        }}
      />
    </CustomModalForm>
  );
};

export default AddModal;
