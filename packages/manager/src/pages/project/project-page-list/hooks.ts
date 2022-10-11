import { useTableModalForm } from '@/hooks';
import { ProjectPage } from '@/models';
import { ProjectPageServices } from '@/services';
import type { ActionType } from '@ant-design/pro-table';
import { message, Modal } from 'antd';
import { useCallback, useRef } from 'react';

export const useProjectPageList = () => {
  const tableActionRef = useRef<ActionType>();
  const { visible, item: selectedItem, openModal, onOk, onCancel } = useTableModalForm<ProjectPage>(tableActionRef);

  const remove = useCallback((item: ProjectPage) => {
    Modal.confirm({
      title: '确认删除？',
      onOk: async () => {
        await ProjectPageServices.deleteProjectPage({
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
