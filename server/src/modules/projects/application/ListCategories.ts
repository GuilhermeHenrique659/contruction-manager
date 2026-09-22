import { db } from '../../../shared/infra/db/client';
import { categories } from '../../../shared/infra/db/schema/projects';

type Output = {
    id: string;
    description: string;
}[];

export class ListCategories {
    async execute(): Promise<Output> {
        const rows = await db.select({
            id: categories.id,
            description: categories.description,
        }).from(categories);

        return rows.map(r => ({
            id: r.id,
            description: r.description,
        }));
    }
}
