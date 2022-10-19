import { SelectOption } from '@/models';
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
