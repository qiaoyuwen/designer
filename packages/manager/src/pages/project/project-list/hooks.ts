import { useTableModalForm } from '@/hooks';
import { Project } from '@/models';
import { ProjectServices } from '@/services';
import type { ActionType } from '@ant-design/pro-table';
import { message, Modal } from 'antd';
import { useCallback, useRef } from 'react';

export const useProjectList = () => {
  const tableActionRef = useRef<ActionType>();
  const { visible, item: selectedItem, openModal, onOk, onCancel } = useTableModalForm<Project>(tableActionRef);

  const remove = useCallback((item: Project) => {
    Modal.confirm({
      title: '确认删除？',
      onOk: async () => {
        await ProjectServices.deleteProject({
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
