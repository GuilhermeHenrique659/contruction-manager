import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateItem } from './CreateItem';
import { FakeItemRepository } from '../repository/FakeItemRepository';
import { FakeProjectRepository } from '../repository/FakeProjectRepository';
import { FakeCategoryRepository } from '../repository/FakeCategoryRepository';
import { Project } from '../domain/Project';
import { Category } from '../domain/Category';



describe('CreateItem', () => {
    it('given valid input when execute then creates item', async () => {
        const itemRepo = new FakeItemRepository();
        const projectRepo = new FakeProjectRepository();
        const categoryRepo = new FakeCategoryRepository();

        const category = Category.create({ description: 'Cat 1' });
        await categoryRepo.add(category);
        
        const project = Project.create({ name: 'Test Project', description: 'Proj' }, 'u1');
        await projectRepo.add(project);

        const useCase = new CreateItem(itemRepo, projectRepo, categoryRepo);
        const result = await useCase.execute({ description: 'Item A', categoryId: category.id, projectId: project.id });

        assert.strictEqual(typeof result.id, 'string');
        const stored = await itemRepo.getById(result.id);
        assert.ok(stored);
        assert.strictEqual(stored!.description, 'Item A');
    });

    it('given missing project when execute then throws', async () => {
        const itemRepo = new FakeItemRepository();
        const projectRepo = new FakeProjectRepository();
        const categoryRepo = new FakeCategoryRepository();

        const useCase = new CreateItem(itemRepo, projectRepo, categoryRepo);
        await assert.rejects(
            () => useCase.execute({ description: 'Item A', categoryId: 'cat-1', projectId: 'missing' }),
            /Project not found/
        );
    });

    it('given missing category when execute then throws', async () => {
        const itemRepo = new FakeItemRepository();
        const projectRepo = new FakeProjectRepository();
        const categoryRepo = new FakeCategoryRepository();

        const project = Project.create({ name: 'Test Project', description: 'Proj' }, 'u1');
        await projectRepo.add(project);

        const useCase = new CreateItem(itemRepo, projectRepo, categoryRepo);
        await assert.rejects(
            () => useCase.execute({ description: 'Item A', categoryId: 'missing', projectId: project.id }),
            /Category not found/
        );
    });
});
