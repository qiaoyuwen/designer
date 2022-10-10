import type { ActionType } from '@ant-design/pro-table';
import { useRef } from 'react';

export const useProjectList = () => {
  const tableActionRef = useRef<ActionType>();

  return [
    {
      tableActionRef,
    },
  ];
};
