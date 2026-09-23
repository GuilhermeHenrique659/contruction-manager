import { ProjectGateway } from '../gateway/ProjectGateway';

type Input = { description: string; categoryId: string; projectId: string };
type Output = { id: string };

export class CreateItem {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    return this.gateway.createItem(input);
  }
}
