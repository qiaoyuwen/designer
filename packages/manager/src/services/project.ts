import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { Project } from '@/models';
import { AppConfig } from '@/configs/app'
import { ApiConfig } from '@/configs/api'

const prefix = AppConfig.prefixs.api + '/project';

const getProjectsPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<Project>>(`${prefix}/pagination`, params);
};

const getProjects = (params?: { name?: string }) => {
  return HttpUtils.getJson<Project[]>(`${prefix}`, params);
};

const getProject = (params: {projectId: string; teamId: string}) => {
  // return HttpUtils.getJson<Project>(`${prefix}/${params.id}`);
  return HttpUtils.getJson<Project>(ApiConfig.main.project.info, params);
};

const addProject = (params: Pick<Project, 'name' | 'description'>) => {
  return HttpUtils.postJson<void>(`${prefix}/`, params);
};

const updateProject = (params: Partial<Pick<Project, 'id' | 'name' | 'description' | 'menuConfig'>>) => {
  return HttpUtils.putJson<void>(`${prefix}/${params.id}`, {
    ...params,
    id: undefined,
  });
};

/**
 * 保存项目
 * @param params
 */
export async function updateProjectRequest (params: {
  teamId: string;
  folderId: string;
  id: string;
  name: string;
  accessType: number;
  cover?: string;
}): Promise<boolean> {
  return HttpUtils.postJson(`${prefix}/save`, params).then(res => {
    return res !== undefined;
  })
    .catch(() => {
      return false;
    })
}

const deleteProject = (params: { id: string }) => {
  return HttpUtils.deleteJson(`${prefix}/${params.id}`);
};

export const ProjectServices = {
  getProjectsPagination,
  getProjects,
  getProject,
  addProject,
  updateProject,
  deleteProject,
};
