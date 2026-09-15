import type { CategoryRepository } from './CategoryRepository';
import { type Category } from '../domain/Category';

export class FakeCategoryRepository implements CategoryRepository {
    private items: Category[] = [];

    async getById(id: string): Promise<Category | null> {
        return this.items.find((c) => c.id === id) || null;
    }

    async hasByDescription(description: string): Promise<boolean> {
        return this.items.some((c) => c.description === description);
    }

    async add(category: Category): Promise<void> {
        this.items.push(category);
    }
}
