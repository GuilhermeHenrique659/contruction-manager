import { type Vendor } from '../domain/Vendor.js';
import { type VendorRepository } from './VendorRepository.js';
import { vendors } from '../../../shared/infra/db/schema/projects.js';
import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class DatabaseVendorRepository implements VendorRepository {
    constructor(private readonly tx: NodePgDatabase) {}

    async getById(id: string): Promise<Vendor | null> {
        const rows = await this.tx.select().from(vendors).where(eq(vendors.id, id));
        if (!rows.length) return null;
        return null;
    }

    async hasByNameAndProject(name: string, projectId: string): Promise<boolean> {
        const rows = await this.tx.select().from(vendors).where(
            and(eq(vendors.name, name), eq(vendors.projectId, projectId))
        );
        return rows.length > 0;
    }

    async add(vendor: Vendor): Promise<void> {
        await this.tx.insert(vendors).values({
            id: vendor.id,
            name: vendor.name,
            paymentDay: vendor.paymentDay ? vendor.paymentDay.value : null,
            projectId: vendor.projectId,
        });
    }

    async update(vendor: Vendor): Promise<void> {
        await this.tx.update(vendors)
            .set({ name: vendor.name, paymentDay: vendor.paymentDay ? vendor.paymentDay.value : null, projectId: vendor.projectId })
            .where(eq(vendors.id, vendor.id));
    }
}
