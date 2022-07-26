import { useTableModalForm } from '@/hooks';
import { User } from '@/models';
import { UserServices } from '@/services';
import type { ActionType } from '@ant-design/pro-table';
import { message, Modal } from 'antd';
import { useCallback, useRef } from 'react';

export const useUserList = () => {
  const tableActionRef = useRef<ActionType>();
  const { visible, item: selectedItem, openModal, onOk, onCancel } = useTableModalForm<User>(tableActionRef);

  const remove = useCallback((item: User) => {
    Modal.confirm({
      title: '确认删除？',
      onOk: async () => {
        await UserServices.deleteUser({
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
