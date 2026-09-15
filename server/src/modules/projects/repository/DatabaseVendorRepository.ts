import { Vendor } from '../domain/Vendor';
import { type VendorRepository } from './VendorRepository';
import { vendors } from '../../../shared/infra/db/schema/projects';
import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Id } from '../../../shared/domain/Id';
import { DayOfMonth } from '../domain/DayOfMonth';

export class DatabaseVendorRepository implements VendorRepository {
    constructor(private readonly tx: NodePgDatabase) { }

    async getById(id: string): Promise<Vendor | null> {
        const [row] = await this.tx.select().from(vendors).where(eq(vendors.id, id));

        if (!row) return null;
        return new Vendor({ id: Id.fromString(row.id), name: row.name, paymentDay: row.paymentDay ? new DayOfMonth(row.paymentDay) : null, projectId: Id.fromString(row.projectId) });
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
