import { items, categories, orders, vendors } from '../../../shared/infra/db/schema/projects';
import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type ItemRow = {
    id: string;
    description: string;
    categoryId: string;
    categoryDescription: string;
    orders: {
        id: string;
        quantity: number;
        price: number;
        status: string;
        vendorId: string;
        vendorName: string;
        vendorPaymentDay: number | null;
        purchasedAt: Date | null;
    }[];
};

export class ItemQuery {
    constructor(private readonly db: NodePgDatabase) {}

    async findByProjectId(projectId: string): Promise<ItemRow[]> {
        const itemRows = await this.db.select({
            id: items.id,
            description: items.description,
            categoryId: items.categoryId,
            categoryDescription: categories.description,
        })
        .from(items)
        .leftJoin(categories, eq(items.categoryId, categories.id))
        .where(eq(items.projectId, projectId));

        const itemIds = itemRows.map(i => i.id);
        const orderRows = await this.db.select({
            id: orders.id,
            quantity: orders.quantity,
            price: orders.price,
            status: orders.status,
            vendorId: orders.vendorId,
            vendorName: vendors.name,
        vendorPaymentDay: vendors.paymentDay,
        purchasedAt: orders.purchasedAt,
        itemId: orders.itemId,
        })
        .from(orders)
        .leftJoin(vendors, eq(orders.vendorId, vendors.id))
        .where(itemIds.length > 0 ? and(...itemIds.map(id => eq(orders.itemId, id))) : eq(orders.itemId, ''));

        return itemRows.map(i => ({
            id: i.id,
            description: i.description,
            categoryId: i.categoryId,
            categoryDescription: i.categoryDescription || '',
            orders: orderRows.filter(o => o.itemId === i.id).map(o => ({
                id: o.id,
                quantity: o.quantity,
                price: o.price,
                status: o.status,
                vendorId: o.vendorId,
                vendorName: o.vendorName || '',
                vendorPaymentDay: o.vendorPaymentDay,
                purchasedAt: o.purchasedAt,
            })),
        }));
    }
}
