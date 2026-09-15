import { describe, it } from 'node:test';
import assert from 'node:assert';
import { UpdateVendor } from './UpdateVendor';
import { FakeVendorRepository } from '../repository/FakeVendorRepository';
import { Vendor } from '../domain/Vendor';
import { DayOfMonth } from '../domain/DayOfMonth';
import { Id } from '../../../shared/domain/Id';

describe('UpdateVendor', () => {
    it('given existing vendor when update name and paymentDay then updates vendor', async () => {
        const repo = new FakeVendorRepository();
        const vendor = Vendor.create({ name: 'Old', paymentDay: new DayOfMonth(5), projectId: Id.create() });
        await repo.add(vendor);

        const useCase = new UpdateVendor(repo);
        const result = await useCase.execute({ id: vendor.id, name: 'New', paymentDay: 20 });

        assert.strictEqual(result.id, vendor.id);
        const updated = await repo.getById(vendor.id);
        assert.strictEqual(updated?.name, 'New');
        assert.strictEqual(updated?.paymentDay?.value, 20);
    });

    it('given non-existing vendor when execute then throws', async () => {
        const repo = new FakeVendorRepository();
        const useCase = new UpdateVendor(repo);

        await assert.rejects(
            () => useCase.execute({ id: 'not-found', name: 'New' }),
            /not found/
        );
    });
});
