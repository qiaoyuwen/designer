import { HttpPaginationResponse, HttpParams, HttpUtils } from '@/http/request';
import type { Project } from '@/models';

const prefix = '/project';

const getProjectsPagination = (params?: HttpParams) => {
  return HttpUtils.getJson<HttpPaginationResponse<Project>>(`${prefix}/pagination`, params);
};

export const ProjectServices = {
  getProjectsPagination,
};
