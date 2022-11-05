import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { ProjectPage } from '@/models';

const prefix = '/project_page';

const getProjectPageDetail = (params: { id: string }) => {
  return HttpUtils.getJson<ProjectPage>(`${prefix}/${params.id}`);
};

const getProjectPages = (params: { projectId: string }) => {
  return HttpUtils.getJson<ProjectPage[]>(`${prefix}`, params);
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
};
