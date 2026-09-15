import { Category } from '../domain/Category';
import { CategoryAlreadyExistsError } from '../domain/CategoryAlreadyExistsError';
import type { CategoryRepository } from '../repository/CategoryRepository';

type Input = {
  description: string;
};

type Output = {
  id: string;
};

export class CreateCategory {
    constructor(private readonly repo: CategoryRepository) {}

    async execute(input: Input): Promise<Output> {
        const exists = await this.repo.hasByDescription(input.description);
        if (exists) {
            throw new CategoryAlreadyExistsError(input.description);
        }

        const category = Category.create({ description: input.description });
        await this.repo.add(category);
        return { id: category.id };
    }
}
