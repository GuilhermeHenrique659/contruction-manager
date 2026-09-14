import { describe, it } from 'node:test';
import assert from 'node:assert';
import { db } from '../../../shared/infra/db/client.js';
import { ListVendors } from './ListVendors.js';
import { CreateVendor } from './CreateVendor.js';
import { CreateProject } from './CreateProject.js';
import { Register } from '../../users/application/Register.js';
import { DatabaseVendorRepository } from '../repository/DatabaseVendorRepository.js';
import { DatabaseProjectRepository } from '../repository/DatabaseProjectRepository.js';
import { DatabaseUserRepository } from '../../users/repository/DatabaseUserRepository.js';

describe('ListVendors', () => {
    it('given project with vendors when execute then returns vendors', async () => {
        const userRepo = new DatabaseUserRepository(db);
        const userResult = await new Register(userRepo).execute({ name: 'Test', email: 'test@test.com' });

        const projectRepo = new DatabaseProjectRepository(db);
        const projectResult = await new CreateProject(projectRepo).execute({ description: 'Proj', creatorUserId: userResult.id });

        const vendorRepo = new DatabaseVendorRepository(db);
        await new CreateVendor(vendorRepo).execute({ name: 'Vendor A', paymentDay: 10, projectId: projectResult.id });

        const result = await new ListVendors(db).execute({ projectId: projectResult.id });
        assert.strictEqual(Array.isArray(result), true);
        assert.strictEqual(result.length >= 1, true);
    });

    it('given name filter when execute then returns matching vendors', async () => {
        const userRepo = new DatabaseUserRepository(db);
        const userResult = await new Register(userRepo).execute({ name: 'Test2', email: 'test2@test.com' });

        const projectRepo = new DatabaseProjectRepository(db);
        const projectResult = await new CreateProject(projectRepo).execute({ description: 'Proj2', creatorUserId: userResult.id });

        const vendorRepo = new DatabaseVendorRepository(db);
        await new CreateVendor(vendorRepo).execute({ name: 'Vendor B', paymentDay: 5, projectId: projectResult.id });

        const result = await new ListVendors(db).execute({ projectId: projectResult.id, name: 'B' });
        assert.strictEqual(Array.isArray(result), true);
    });
});
