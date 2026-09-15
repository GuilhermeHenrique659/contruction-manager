import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateProject } from './CreateProject';
import { type ProjectRepository } from '../repository/ProjectRepository';
import { type Project } from '../domain/Project';

class FakeProjectRepository implements ProjectRepository {
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

describe('CreateProject', () => {
    it('given name and description when execute then creates project with creator as member', async () => {
        const repo = new FakeProjectRepository();
        const useCase = new CreateProject(repo);
        const result = await useCase.execute({ description: 'Desc', creatorUserId: 'u1' });

        assert.strictEqual(typeof result.id, 'string');
        const stored = await repo.getById(result.id);
        assert.ok(stored);
        assert.strictEqual(stored!.description, 'Desc');
        assert.strictEqual(stored!.members.length, 1);
        assert.strictEqual(stored!.members[0].userId, 'u1');
    });
});
