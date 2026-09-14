import { type Project } from '../domain/Project.js';
import { type ProjectRepository } from './ProjectRepository.js';
import { db } from '../../../shared/infra/db/client.js';
import { projects, projectMembers } from '../../../shared/infra/db/schema/projects.js';
import { eq } from 'drizzle-orm';

export class DatabaseProjectRepository implements ProjectRepository {
    constructor(private readonly tx?: unknown) {}
    get client() { return this.tx || db; }

    async getById(id: string): Promise<Project | null> {
        const rows = await this.client.select().from(projects).where(eq(projects.id, id));
        if (!rows.length) return null;
        return null;
    }

    async add(project: Project): Promise<void> {
        await this.client.insert(projects).values({
            id: project.id,
            description: project.description,
        });
        if (project.members.length) {
            await this.client.insert(projectMembers).values(
                project.members.map((m) => ({
                    projectId: project.id,
                    userId: m.userId,
                    role: m.role,
                }))
            );
        }
    }

    async update(project: Project): Promise<void> {
        await this.client.update(projects)
            .set({ description: project.description })
            .where(eq(projects.id, project.id));
        await this.client.delete(projectMembers).where(eq(projectMembers.projectId, project.id));
        if (project.members.length) {
            await this.client.insert(projectMembers).values(
                project.members.map((m) => ({
                    projectId: project.id,
                    userId: m.userId,
                    role: m.role,
                }))
            );
        }
    }
}
