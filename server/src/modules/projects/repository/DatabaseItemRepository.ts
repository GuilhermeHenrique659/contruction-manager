import { items, orders } from '../../../shared/infra/db/schema/projects';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { ItemRepository } from './ItemRepository';
import { Item } from '../domain/Item';
import { Id } from '../../../shared/domain/Id';
import { Price } from '../domain/Price';
import { Order } from '../domain/Order';
import { OrderQuantity } from '../domain/OrderQuantity';
import { OrderStatus } from '../domain/OrderStatus';
import { OrderPurchasedAt } from '../domain/OrderPurchasedAt';

export class DatabaseItemRepository implements ItemRepository {
    constructor(private readonly tx: NodePgDatabase) { }

    async getById(id: string): Promise<Item | null> {
        const [row] = await this.tx.select().from(items).where(eq(items.id, id));
        if (!row) return null;

        const ordersRows = await this.tx.select().from(orders).where(eq(orders.itemId, id));

        return new Item({
            id: Id.fromString(row.id),
            description: row.description,
            categoryId: Id.fromString(row.categoryId),
            projectId: Id.fromString(row.projectId),
            total: Price.createOrZero(row.total),
            orders: ordersRows.map(orderRow => new Order({
                id: Id.fromString(orderRow.id),
                itemId: Id.fromString(orderRow.itemId),
                quantity: OrderQuantity.create(orderRow.quantity),
                price: Price.create(orderRow.price),
                vendorId: Id.fromString(orderRow.vendorId),
                status: OrderStatus.create(orderRow.status),
                purchasedAt: OrderPurchasedAt.create(orderRow.purchasedAt),
            }))
        });
    }

    async add(item: Item): Promise<void> {
        await this.tx.insert(items).values({
            id: item.id,
            description: item.description,
            categoryId: item.categoryId,
            projectId: item.projectId,
            total: item.total,
        });
        for (const order of item.orders) {
            await this.tx.insert(orders).values({
                id: order.id,
                itemId: item.id,
                quantity: order.quantity,
                price: order.price,
                vendorId: order.vendorId,
                status: order.status,
                purchasedAt: order.purchasedAt ? new Date(order.purchasedAt) : new Date(),
            });
        }
    }

    async update(item: Item): Promise<void> {
        await this.tx.update(items).set({
            description: item.description,
            categoryId: item.categoryId,
            projectId: item.projectId,
            total: item.total,
        }).where(eq(items.id, item.id));
        for (const order of item.orders) {
            await this.tx.insert(orders).values({
                id: order.id,
                itemId: item.id,
                quantity: order.quantity,
                price: order.price,
                vendorId: order.vendorId,
                status: order.status,
                purchasedAt: order.purchasedAt ? new Date(order.purchasedAt) : new Date(),
            });
        }
    }
}
