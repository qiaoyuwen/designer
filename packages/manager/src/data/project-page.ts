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

export const useProjectPages = (projectId?: string) => {
  const getProjectPages = useCallback(async () => {
    if (!projectId) {
      return {
        data: [],
      };
    }
    const data = await ProjectPageServices.getProjectPages({
      projectId,
    });
    return {
      data,
    };
  }, [projectId]);

  const { data, run } = useRequest(getProjectPages, {
    refreshDeps: [projectId],
  });

  return [data, run] as const;
};
