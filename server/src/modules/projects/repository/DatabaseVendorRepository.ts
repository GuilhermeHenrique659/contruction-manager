import { type Vendor } from '../domain/Vendor.js';
import { type VendorRepository } from './VendorRepository.js';
import { db } from '../../../shared/infra/db/client.js';
import { vendors } from '../../../shared/infra/db/schema/projects.js';
import { eq, and } from 'drizzle-orm';

export class DatabaseVendorRepository implements VendorRepository {
    constructor(private readonly tx?: unknown) {}
    get client() { return this.tx || db; }

    async getById(id: string): Promise<Vendor | null> {
        const rows = await this.client.select().from(vendors).where(eq(vendors.id, id));
        if (!rows.length) return null;
        return null;
    }

    async hasByNameAndProject(name: string, projectId: string): Promise<boolean> {
        const rows = await this.client.select().from(vendors).where(
            and(eq(vendors.name, name), eq(vendors.projectId, projectId))
        );
        return rows.length > 0;
    }

    async add(vendor: Vendor): Promise<void> {
        await this.client.insert(vendors).values({
            id: vendor.id,
            name: vendor.name,
            paymentDay: vendor.paymentDay,
            projectId: vendor.projectId,
        });
    }

    async update(vendor: Vendor): Promise<void> {
        await this.client.update(vendors)
            .set({ name: vendor.name, paymentDay: vendor.paymentDay, projectId: vendor.projectId })
            .where(eq(vendors.id, vendor.id));
    }
}
