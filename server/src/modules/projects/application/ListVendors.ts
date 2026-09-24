import { vendors } from '../../../shared/infra/db/schema/projects';
import { eq, and, like } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Authorizable } from '../../users/application/Authorizer';

export type Input = {
    projectId: string;
    userId: string;
    name?: string;
};

export type Output = {
    id: string;
    name: string;
    paymentDay: number | null;
    projectId: string;
}[];

export class ListVendors implements Authorizable<Input, Output> {
    constructor(private readonly db: NodePgDatabase) {}

    async execute(input: Input): Promise<Output> {
        const conditions = [eq(vendors.projectId, input.projectId)];
        if (input.name) {
            conditions.push(like(vendors.name, `%${input.name}%`));
        }
        const rows = await this.db.select().from(vendors).where(and(...conditions));
        return rows.map((r) => ({
            id: r.id,
            name: r.name,
            paymentDay: r.paymentDay,
            projectId: r.projectId,
        }));
    }
}
