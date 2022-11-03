import { Project, SelectOption } from '@/models';
import { ProjectServices } from '@/services';
import { useCallback } from 'react';
import { useRequest } from 'umi';

export const useProjectOptions = (name?: string) => {
  const getOptions = useCallback(async () => {
    const data = await ProjectServices.getProjects({
      name,
    });
    return {
      data,
    };
  }, [name]);

  const { data } = useRequest(getOptions);

  const options: SelectOption[] = (data || []).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  return [options] as const;
};

export const useProject = (id?: string) => {
  const getProject = useCallback(async () => {
    let data: Project | undefined;
    if (id) {
      data = await ProjectServices.getProject({
        id,
      });
    }

    return {
      data,
    };
  }, [id]);

  const { data } = useRequest(getProject);

  return [data] as const;
};
