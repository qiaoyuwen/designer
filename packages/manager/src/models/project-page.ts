import { Project } from './project';

/** page和menu整合在一起 */
export interface ProjectPage {
  key: string;
  // id 和 pageID相同
  id: string;
  parentId: string;
  // name和title相同
  name: string;
  title: string;
  path: string;
  layout: boolean;
  hideInMenu: boolean;
  description: string;
  schemaJson: string;
  ctime: string;
  status: number;
  deleted: number;
  project?: Project;
  /** 菜单没有，路由有 */
  children?: ProjectPage[];
}

/**
 * 项目菜单
 */
export interface IProjectApiPage {
  id?: string;
  parentId?: string;
  /** 是否隐藏 0-否 1-是 */
  hidden?: 0 | 1;
  /** 前端生成的key，用来做关联 */
  uuid: string;
  /** 中文名称 */
  label: string;
  /** 英文名称 */
  title: string;
  /** 路径 */
  path: string;
  /** 用来存keyFrame */
  centent?: string;
  /** 排序 */
  sort?: number;
  /** 类型 1-菜单 2-页面 */
  type: 1 | 2;
  /** 子菜单 */
  children?: IProjectApiPage[];
}
