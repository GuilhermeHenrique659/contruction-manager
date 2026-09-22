import { Project } from '../domain/Project';
import { type ProjectRepository } from './ProjectRepository';
import { projects, projectMembers } from '../../../shared/infra/db/schema/projects';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Id } from '../../../shared/domain/Id';
import { ProjectMember } from '../domain/ProjectMember';

export class DatabaseProjectRepository implements ProjectRepository {
    constructor(private readonly tx: NodePgDatabase) {}

    async getById(id: string): Promise<Project | null> {
        const [row] = await this.tx.select().from(projects).where(eq(projects.id, id));
        if (!row) return null;
        const members = await this.tx.select().from(projectMembers).where(eq(projectMembers.projectId, row.id));

        return new Project({
            id:  Id.fromString(row.id),
            name: row.name,
            description: row.description,
            members: members.map((m) => new ProjectMember({
                userId: m.userId,
                role: m.role as 'member',
            }
            )),
        });
    }

    async add(project: Project): Promise<void> {
        await this.tx.insert(projects).values({
            id: project.id,
            name: project.name,
            description: project.description,
        });
        if (project.members.length) {
            await this.tx.insert(projectMembers).values(
                project.members.map((m) => ({
                    projectId: project.id,
                    userId: m.userId,
                    role: m.role,
                }))
            );
        }
    }

    async update(project: Project): Promise<void> {
        await this.tx.update(projects)
            .set({ description: project.description })
            .where(eq(projects.id, project.id));
        await this.tx.delete(projectMembers).where(eq(projectMembers.projectId, project.id));
        if (project.members.length) {
            await this.tx.insert(projectMembers).values(
                project.members.map((m) => ({
                    projectId: project.id,
                    userId: m.userId,
                    role: m.role,
                }))
            );
        }
    }
}
