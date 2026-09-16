import { projects, projectMembers } from '../../../shared/infra/db/schema/projects';
import { users } from '../../../shared/infra/db/schema/users';
import { and, eq, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ApplicationError } from '../../../shared/domain/ApplicationError';

export type Input = {
    projectId: string;
    userId: string;
};

export type MemberOutput = {
    id: string;
    name: string;
    role: string;
};

export type Output = {
    id: string;
    name: string;
    description: string;
    members: MemberOutput[];
};

export class GetProjectById {
    constructor(private readonly db: NodePgDatabase) { }

    async execute(input: Input): Promise<Output> {
        const projectRows = await this.db
            .select({ id: projects.id, name: projects.name, description: projects.description })
            .from(projects)
            .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
            .where(and(eq(projects.id, input.projectId), eq(projectMembers.userId, input.userId)))

        if (projectRows.length === 0) throw new ApplicationError('Project not found or user is not a member');

        const project = projectRows[0];
        const projectIds = [project.id];

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

        return {
            id: project.id,
            name: project.name,
            description: project.description,
            members: membersByProject[project.id] || [],
        };
    }
}