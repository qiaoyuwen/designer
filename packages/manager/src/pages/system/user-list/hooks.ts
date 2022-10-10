import type { ActionType } from '@ant-design/pro-table';
import { useRef } from 'react';

export const useUserList = () => {
  const tableActionRef = useRef<ActionType>();

  return [
    {
      tableActionRef,
    },
  ];
};
