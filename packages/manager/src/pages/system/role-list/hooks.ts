import { useTableModalForm } from '@/hooks';
import { Role } from '@/models';
import { RoleServices } from '@/services';
import type { ActionType } from '@ant-design/pro-table';
import { message, Modal } from 'antd';
import { useCallback, useRef } from 'react';

export const useRoleList = () => {
  const tableActionRef = useRef<ActionType>();
  const { visible, item: selectedItem, openModal, onOk, onCancel } = useTableModalForm<Role>(tableActionRef);

  const remove = useCallback((item: Role) => {
    Modal.confirm({
      title: '确认删除？',
      onOk: async () => {
        await RoleServices.deleteRole({
          id: item.id,
        });
        message.success('操作成功');
        tableActionRef.current?.reload();
      },
    });
  }, []);

  return [
    {
      tableActionRef,
    },
    { visible, selectedItem, openModal, onOk, onCancel },
    { remove },
  ] as const;
};
