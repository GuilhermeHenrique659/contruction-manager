import type { Vendor } from '../domain/Vendor.js';
import type { VendorRepository } from './VendorRepository.js';

export class FakeVendorRepository implements VendorRepository {
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
