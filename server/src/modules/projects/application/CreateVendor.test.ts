import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateVendor } from './CreateVendor.js';
import { type VendorRepository } from '../repository/VendorRepository.js';
import { type Vendor } from '../domain/Vendor.js';

class FakeVendorRepository implements VendorRepository {
    private items: Vendor[] = [];
    async getById(id: string): Promise<Vendor | null> {
        return this.items.find(i => i.id === id) || null;
    }
    async hasByNameAndProject(name: string, projectId: string): Promise<boolean> {
        return this.items.some(i => i.name === name && i.projectId === projectId);
    }
    async add(vendor: Vendor): Promise<void> {
        this.items.push(vendor);
    }
    async update(vendor: Vendor): Promise<void> {
        const idx = this.items.findIndex(i => i.id === vendor.id);
        if (idx !== -1) this.items[idx] = vendor;
    }
}

describe('CreateVendor', () => {
    it('given new vendor when execute then creates vendor', async () => {
        const repo = new FakeVendorRepository();
        const useCase = new CreateVendor(repo);
        const result = await useCase.execute({ name: 'Vendor A', paymentDay: 10, projectId: 'proj-1' });

        assert.strictEqual(typeof result.id, 'string');
    });

    it('given duplicate name for same project when execute then throws', async () => {
        const repo = new FakeVendorRepository();
        const useCase = new CreateVendor(repo);
        await useCase.execute({ name: 'Vendor A', paymentDay: 10, projectId: 'proj-1' });

        await assert.rejects(
            () => useCase.execute({ name: 'Vendor A', paymentDay: 15, projectId: 'proj-1' }),
            /already exists/
        );
    });
});
