import { AppConfig } from '@/config/app';
import { HttpUtils } from '@/http/request';
import type { Project } from '@/models';

const prefix = '/project';

const getProjectDetail = () => {
  return HttpUtils.getJson<Project>(`${prefix}/${AppConfig.projectId}`);
};

export const ProjectServices = {
  getProjectDetail,
};
