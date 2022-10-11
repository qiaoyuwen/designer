import type { ActionType } from '@ant-design/pro-table';
import type { MutableRefObject } from 'react';
import { useCallback, useState } from 'react';

export function useTableModalForm<T>(tableActionRef: MutableRefObject<ActionType | undefined>) {
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState<T>();

  const openModal = useCallback((data?: T) => {
    setItem(data ? data : undefined);
    setVisible(true);
  }, []);

  const onOk = useCallback(() => {
    setVisible(false);
    tableActionRef.current?.reload();
  }, [tableActionRef]);

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    visible,
    item,
    openModal,
    onOk,
    onCancel,
  };
}
