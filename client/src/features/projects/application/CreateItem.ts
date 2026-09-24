import { ProjectGateway } from '../gateway/ProjectGateway';
import { CategoryId } from '../model/CategoryId';
import { ItemDescription } from '../model/ItemDescription';

type Input = { description: string; categoryId: string; projectId: string };
type Output = { id: string };

export class CreateItem {
  constructor(private readonly gateway: ProjectGateway) {}

  async execute(input: Input): Promise<Output> {
    const description = ItemDescription.create(input.description);
    const categoryId = CategoryId.create(input.categoryId);

    return this.gateway.createItem({ ...input, description: description.value, categoryId: categoryId.value });
  }
}
