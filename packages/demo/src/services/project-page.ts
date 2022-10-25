import { HttpUtils } from '@/http/request';
import type { ProjectPage } from '@/models';

const prefix = '/project_page';

const getProjectPageDetail = (params: { id: string }) => {
  return HttpUtils.getJson<ProjectPage>(`${prefix}/${params.id}`);
};

export const ProjectPageServices = {
  getProjectPageDetail,
};
