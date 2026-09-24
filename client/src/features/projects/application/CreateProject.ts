import { ProjectGateway } from '../gateway/ProjectGateway';
import { Project, CreateProjectInput } from '../model/ProjectModel';
import { ProjectName } from '../model/ProjectName';

type CreateProjectOutput = Project;

export class CreateProject {
  constructor(private readonly gateway: ProjectGateway) { }

  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    const name = ProjectName.create(input.name);

    const { id } = await this.gateway.create({ ...input, name: name.value });
    return await this.gateway.getById(id);
  }
}