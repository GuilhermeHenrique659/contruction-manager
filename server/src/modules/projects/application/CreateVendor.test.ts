import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateVendor } from './CreateVendor';
import { FakeVendorRepository } from '../repository/FakeVendorRepository';
import { DayOfMonth } from '../domain/DayOfMonth';

describe('CreateVendor', () => {
    it('given new vendor when execute then creates vendor', async () => {
        const repo = new FakeVendorRepository();
        const useCase = new CreateVendor(repo);
        const result = await useCase.execute({ name: 'Vendor A', paymentDay: new DayOfMonth(10).value, projectId: 'proj-1' });

        assert.strictEqual(typeof result.id, 'string');
    });

    it('given duplicate name for same project when execute then throws', async () => {
        const repo = new FakeVendorRepository();
        const useCase = new CreateVendor(repo);
        await useCase.execute({ name: 'Vendor A', paymentDay: new DayOfMonth(10).value, projectId: 'proj-1' });

        await assert.rejects(
            () => useCase.execute({ name: 'Vendor A', paymentDay: new DayOfMonth(15).value, projectId: 'proj-1' }),
            /already exists/
        );
    });
});
