import CustomModalForm from '@/components/custom-modal-form';
import { Project } from '@/models';
import { ProFormTextArea } from '@ant-design/pro-form';
import type { FunctionComponent } from 'react';
import { MenuConfigModalProps, useProjectMenuConfigModal } from './hooks';

const MenuConfigModal: FunctionComponent<MenuConfigModalProps> = (props) => {
  const [{ submit }] = useProjectMenuConfigModal(props);

  return (
    <CustomModalForm<Project> title="编辑路由" submit={submit} {...props}>
      <ProFormTextArea
        name="menuConfig"
        label="路由配置"
        fieldProps={{
          rows: 8,
        }}
      />
    </CustomModalForm>
  );
};

export default MenuConfigModal;
