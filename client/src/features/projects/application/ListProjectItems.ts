import { ProjectGateway } from '../gateway/ProjectGateway';
import { ProjectItem } from '../model/ProjectItem';

type Input = { projectId: string };
type Output = { items: ProjectItem[] };

export class ListProjectItems {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    const items = await this.gateway.listItems(input.projectId);
    return { items };
  }
}
