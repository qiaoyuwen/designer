import { Project, SelectOption } from '@/models';
import { ProjectPageServices, ProjectServices } from '@/services'
import { useCallback } from 'react';
import { useRequest } from 'umi';
import { arrToTree } from '@/utils/tree'

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

export const useProject = (params?: {projectId: string; teamId: string}) => {
  const getProject = useCallback(async () => {
    let data: Project | undefined;
    if (params) {
      // 查询项目信息
      data = await ProjectServices.getProject(params);
      // 查询菜单数据
      const menus = await ProjectPageServices.getProjectPages({projectId: data.id})
      // 设置菜单列表
      data.pageList = menus
      // 设置页面配置
      try {
        const menuConfig = arrToTree(menus)
        data.menuConfig = JSON.stringify(menuConfig)
      } catch (e) {}
    }

    return {
      data,
    };
  }, [params]);

  const { data, run } = useRequest(getProject);

  return [data, run] as const;
};
