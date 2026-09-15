import { Item } from '../domain/Item';
import { Id } from '../../../shared/domain/Id';
import type { ItemRepository } from '../repository/ItemRepository';
import type { ProjectRepository } from '../repository/ProjectRepository';
import type { CategoryRepository } from '../repository/CategoryRepository';
import { ApplicationError } from '../../../shared/domain/ApplicationError';

type Input = {
  description: string;
  categoryId: string;
  projectId: string;
};

type Output = {
  id: string;
};

export class CreateItem {
    constructor(
    private readonly itemRepo: ItemRepository,
    private readonly projectRepo: ProjectRepository,
    private readonly categoryRepo: CategoryRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
        const project = await this.projectRepo.getById(input.projectId);
        if (!project) {
            throw new ApplicationError('Project not found');
        }

        const category = await this.categoryRepo.getById(input.categoryId);
        if (!category) {
            throw new ApplicationError('Category not found');
        }

        const item = Item.create({
            description: input.description,
            categoryId: Id.fromString(input.categoryId),
            projectId: Id.fromString(input.projectId),
        });

        await this.itemRepo.add(item);
        return { id: item.id };
    }
}
