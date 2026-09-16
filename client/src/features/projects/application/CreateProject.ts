import { ProjectGateway } from '../gateway/ProjectGateway';
import { Project, CreateProjectInput } from '../model/ProjectModel';

type CreateProjectOutput = Project;

export class CreateProject {
  constructor(private readonly gateway: ProjectGateway) { }

  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    const { id } = await this.gateway.create(input);
    return await this.gateway.getById(id);
  }
}