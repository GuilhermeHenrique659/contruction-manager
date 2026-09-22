import { Project, CreateProjectInput } from '../model/ProjectModel';
import { ProjectItem } from '../model/ProjectItem';

export interface ProjectGateway {
  listAll(): Promise<Project[]>;
  create(input: CreateProjectInput): Promise<{ id: string }>;
  getById(id: string): Promise<Project>;
  listItems(projectId: string): Promise<ProjectItem[]>;
}