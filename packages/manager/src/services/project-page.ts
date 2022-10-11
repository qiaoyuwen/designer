import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { ProjectPage } from '@/models';

const prefix = '/project_page';

const getProjectPagesPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<ProjectPage>>(`${prefix}/pagination`, params);
};

const addProjectPage = (params: Pick<ProjectPage, 'name' | 'description' | 'schema' | 'status'>) => {
  return HttpUtils.postJson<void>(`${prefix}/`, params);
};

const updateProjectPage = (params: Pick<ProjectPage, 'id' | 'name' | 'description' | 'schema' | 'status'>) => {
  return HttpUtils.putJson<void>(`${prefix}/${params.id}`, {
    ...params,
    id: undefined,
  });
};

const deleteProjectPage = (params: { id: string }) => {
  return HttpUtils.deleteJson(`${prefix}/${params.id}`);
};

export const ProjectPageServices = {
  getProjectPagesPagination,
  addProjectPage,
  updateProjectPage,
  deleteProjectPage,
};
