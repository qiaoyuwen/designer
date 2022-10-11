import { ProjectPageServices } from '@/services';
import { useCallback } from 'react';
import { useRequest } from 'umi';

export const useProjectPage = (id?: string) => {
  const getProjectPageDetail = useCallback(async () => {
    if (!id) {
      return {
        data: undefined,
      };
    }
    const data = await ProjectPageServices.getProjectPageDetail({
      id,
    });
    return {
      data,
    };
  }, [id]);

  const { data } = useRequest(getProjectPageDetail, {
    refreshDeps: [id],
  });

  return [data] as const;
};
