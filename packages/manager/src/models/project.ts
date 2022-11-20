import { ProjectPage } from '@/models/project-page'

export interface Project {
  id: string;
  name: string;
  description: string;
  ctime: string;
  deleted: number;
  teamId: string;
  folderId: string;
  accessType: number;
  thumb?: string;
  /** 菜单配置 */
  menuConfig?: string;
  /** 页面列表（和menuConfig一样，区别在于是否是树形结构） */
  pageList?: ProjectPage[];
}
