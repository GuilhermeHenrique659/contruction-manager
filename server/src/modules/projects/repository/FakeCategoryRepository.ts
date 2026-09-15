import type { CategoryRepository } from './CategoryRepository';

export class FakeCategoryRepository implements CategoryRepository {
    async getById(id: string): Promise<{ id: string } | null> {
        return id ? { id } : null;
    }
}
