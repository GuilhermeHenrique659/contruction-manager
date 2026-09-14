import { projects, projectMembers } from '../../../shared/infra/db/schema/projects.js';
import { users } from '../../../shared/infra/db/schema/users.js';
import { eq, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type Input = {
    userId: string;
};

export type MemberOutput = {
    id: string;
    name: string;
    role: string;
};

export type Output = {
    id: string;
    description: string;
    members: MemberOutput[];
}[];

export class ListProjects {
    constructor(private readonly db: NodePgDatabase) {}

    async execute(input: Input): Promise<Output> {
        const projectRows = await this.db
            .select({ id: projects.id, description: projects.description })
            .from(projects)
            .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
            .where(eq(projectMembers.userId, input.userId));

        const projectIds = projectRows.map((r) => r.id);
        if (projectIds.length === 0) return [];

        const memberRows = await this.db
            .select({
                projectId: projectMembers.projectId,
                userId: users.id,
                userName: users.name,
                role: projectMembers.role,
            })
            .from(projectMembers)
            .innerJoin(users, eq(projectMembers.userId, users.id))
            .where(inArray(projectMembers.projectId, projectIds));

        const membersByProject: Record<string, MemberOutput[]> = {};
        for (const m of memberRows) {
            if (!membersByProject[m.projectId]) membersByProject[m.projectId] = [];
            membersByProject[m.projectId].push({
                id: m.userId,
                name: m.userName,
                role: m.role,
            });
        }

        return projectRows.map((p) => ({
            id: p.id,
            description: p.description,
            members: membersByProject[p.id] || [],
        }));
    }
}
