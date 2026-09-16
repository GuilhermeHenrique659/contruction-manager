import { ProjectGateway } from '../gateway/ProjectGateway';
import { Project } from '../model/ProjectModel';

type ListProjectsInput = Record<string, never>;
type ListProjectsOutput = { projects: Project[] };

export class ListProjects {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(_input: ListProjectsInput): Promise<ListProjectsOutput> {
    const projects = await this.gateway.listAll();
    return { projects };
  }
}