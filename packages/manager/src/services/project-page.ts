import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { ProjectPage } from '@/models';
import { IProjectApiPage } from '@/models'

const prefix = '/project_page';

const getProjectPageDetail = (params: { id: string }) => {
  return HttpUtils.getJson<ProjectPage>(`${prefix}/${params.id}`);
};

const getProjectPages = (params: { projectId: string }): Promise<ProjectPage[]> => {
  // return HttpUtils.getJson<ProjectPage[]>(`${prefix}`, params);
  return HttpUtils.getJson<IProjectApiPage[]>('/project/found/page/list', params).then(res => {
    return res.map(menu => {
      return {
        key: menu.uuid,
        id: menu?.id ?? '',
        parentId: menu?.parentId ?? '',
        name: menu.label,
        title: menu.label,
        path: menu.path,
        layout: false,
        hideInMenu: menu.hidden === 1,
        description: '',
        schemaJson: menu.centent ?? '',
        ctime: '',
        status: 0,
        deleted: 0
      }
    })
  });
};

const getProjectPagesPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<ProjectPage>>(`${prefix}/pagination`, params);
};

const addProjectPage = (params: { name?: string; projectId?: string; description?: string }) => {
  return HttpUtils.postJson<ProjectPage>(`${prefix}/`, params);
};

const updateProjectPage = (params: {
  id: string;
  name?: string;
  description?: string;
  schemaJson?: string;
  status?: number;
  projectId?: string;
}) => {
  return HttpUtils.putJson<void>(`${prefix}/${params.id}`, {
    ...params,
    id: undefined,
  });
};

const saveProjectPage = (params: {projectId: string, routers: ProjectPage[]}) => {
  // 重新组装
  const pages: IProjectApiPage[] = []
  const visitTree = (tempPages: IProjectApiPage[], menus: any[]) => {
    menus.forEach(menu => {
      const apiMenu: IProjectApiPage = {
        uuid: menu.key,
        label: menu.name,
        title: menu.name,
        path: menu.path,
        centent: menu?.schemaJson,
        type: menu?.children?.length! >= 0 ? 1 : 2,
        children: menu?.children?.length! >= 0 ? [] : undefined
      }
      if (menu?.children?.length! > 0) {
        visitTree(apiMenu.children!, menu.children!)
      }
      tempPages.push(apiMenu)
    })
  }
  visitTree(pages, params?.routers || [])

  const requestParams = {
    projectId: params.projectId,
    pages: pages
  }

  return HttpUtils.postJson<void>('/project/found/page/save', requestParams);
}

const deleteProjectPage = (params: { id: string }) => {
  return HttpUtils.deleteJson(`${prefix}/${params.id}`);
};

export const ProjectPageServices = {
  getProjectPages,
  getProjectPageDetail,
  getProjectPagesPagination,
  addProjectPage,
  updateProjectPage,
  deleteProjectPage,
  saveProjectPage,
};
