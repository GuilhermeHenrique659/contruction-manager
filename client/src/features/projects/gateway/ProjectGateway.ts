import { Project, CreateProjectInput } from '../model/ProjectModel';

export interface ProjectGateway {
  listAll(): Promise<Project[]>;
  create(input: CreateProjectInput): Promise<{ id: string }>;
  getById(id: string): Promise<Project>;
}