import type { Project } from '../domain/Project';
import type { ProjectRepository } from './ProjectRepository';

export class FakeProjectRepository implements ProjectRepository {
    private items: Project[] = [];

    async getById(id: string): Promise<Project | null> {
        return this.items.find(i => i.id === id) || null;
    }

    async add(project: Project): Promise<void> {
        this.items.push(project);
    }

    async update(project: Project): Promise<void> {
        const idx = this.items.findIndex(i => i.id === project.id);
        if (idx !== -1) this.items[idx] = project;
    }
}
