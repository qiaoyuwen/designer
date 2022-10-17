import { Project } from './project';

export interface ProjectPage {
  id: string;
  name: string;
  description: string;
  ctime: string;
  schemaJson: string;
  status: number;
  deleted: number;
  project?: Project;
}
