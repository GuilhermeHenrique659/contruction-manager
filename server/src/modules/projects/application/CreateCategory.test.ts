import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateCategory } from './CreateCategory';
import { FakeCategoryRepository } from '../repository/FakeCategoryRepository';


describe('CreateCategory', () => {
    it('given valid description when execute then creates category', async () => {
        const repo = new FakeCategoryRepository();
        const useCase = new CreateCategory(repo);
        const result = await useCase.execute({ description: 'Material' });

        assert.strictEqual(typeof result.id, 'string');
        assert.ok(await repo.hasByDescription('Material'));
    });

    it('given duplicate description when execute then throws', async () => {
        const repo = new FakeCategoryRepository();
        const useCase = new CreateCategory(repo);
        await useCase.execute({ description: 'Material' });

        await assert.rejects(
            () => useCase.execute({ description: 'Material' }),
            /Category with description 'Material' already exists/
        );
    });
});
