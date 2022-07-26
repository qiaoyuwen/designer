import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { Project } from '@/models';

const prefix = '/project';

const getProjectsPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<Project>>(`${prefix}/pagination`, params);
};

const getProjects = (params?: { name?: string }) => {
  return HttpUtils.getJson<Project[]>(`${prefix}`, params);
};

const getProject = (params: { id: string }) => {
  return HttpUtils.getJson<Project>(`${prefix}/${params.id}`);
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
