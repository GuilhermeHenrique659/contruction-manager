import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateProject } from './CreateProject';
import { FakeProjectRepository } from '../repository/FakeProjectRepository';

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
