import { ItemQuery } from '../query/ItemQuery';
import { ItemAssembler } from '../assembler/ItemAssembler';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Authorizable } from '../../users/application/Authorizer';

export type Input = {
    projectId: string;
    userId: string;
};

export type Output = ReturnType<typeof ItemAssembler.toOutput>;

export class ListItems implements Authorizable<Input, Output> {
    constructor(private readonly db: NodePgDatabase) {}

    async execute(input: Input): Promise<Output> {
        const query = new ItemQuery(this.db);
        const rows = await query.findByProjectId(input.projectId);
        return ItemAssembler.toOutput(rows);
    }
}
