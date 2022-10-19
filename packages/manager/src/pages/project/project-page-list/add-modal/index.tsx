import CustomModalForm from '@/components/custom-modal-form';
import { useProjectOptions } from '@/data';
import { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { AddModalProps, FormDataType, useProjectAddModal } from './hooks';

const AddModal: FunctionComponent<AddModalProps> = (props) => {
  const { formData } = props;
  const [{ submit }] = useProjectAddModal(props);
  const [projectOptions] = useProjectOptions();

  return (
    <CustomModalForm<FormDataType> title={`${formData ? '编辑页面' : '新增页面'}`} submit={submit} {...props}>
      <ProFormText name="name" label="页面名" rules={[{ required: true, message: '必填' }]} />
      <ProFormSelect
        width="md"
        name="projectId"
        label="所属项目"
        placeholder="请选择所属项目"
        options={projectOptions}
        rules={[{ required: true, message: '请选择所属项目' }]}
      />
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
