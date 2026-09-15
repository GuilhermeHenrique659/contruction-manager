import { categories } from '../../../shared/infra/db/schema/projects';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { CategoryRepository } from './CategoryRepository';
import { Category } from '../domain/Category';
import { Id } from '../../../shared/domain/Id';

export class DatabaseCategoryRepository implements CategoryRepository {
    constructor(private readonly tx: NodePgDatabase) {}

    async getById(id: string): Promise<Category | null> {
        const [row] = await this.tx.select().from(categories).where(eq(categories.id, id));
        if (!row) return null;
        return new Category({ id: Id.fromString(row.id), description: row.description });
    }

    async hasByDescription(description: string): Promise<boolean> {
        const [row] = await this.tx.select().from(categories).where(eq(categories.description, description));
        return !!row;
    }

    async add(category: Category): Promise<void> {
        await this.tx.insert(categories).values({
            id: category.id,
            description: category.description,
        });
    }
}
