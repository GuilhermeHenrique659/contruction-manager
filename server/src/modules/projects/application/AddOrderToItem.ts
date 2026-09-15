import { ApplicationError } from '../../../shared/domain/ApplicationError';
import { Order } from '../domain/Order';
import { OrderQuantity } from '../domain/OrderQuantity';
import { OrderPrice } from '../domain/OrderPrice';
import { Id } from '../../../shared/domain/Id';
import type { ItemRepository } from '../repository/ItemRepository';
import type { VendorRepository } from '../repository/VendorRepository';

type Input = {
    itemId: string;
    quantity: number;
    price: number;
    vendorId: string;
    status?: 'pending_payment' | 'paid';
    purchasedAt?: string;
};

type Output = {
    orderId: string;
};

export class AddOrderToItem {
    constructor(
        private readonly itemRepo: ItemRepository,
        private readonly vendorRepo: VendorRepository,
    ) { }

    async execute(input: Input): Promise<Output> {
        const item = await this.itemRepo.getById(input.itemId);
        if (!item) {
            throw new ApplicationError('Item not found');
        }

        const vendor = await this.vendorRepo.getById(input.vendorId);
        if (!vendor) {
            throw new ApplicationError('Vendor not found');
        }

        const order = Order.create({
            itemId: Id.fromString(input.itemId),
            quantity: OrderQuantity.create(input.quantity),
            price: OrderPrice.create(Math.round(input.price * 100)),
            vendorId: Id.fromString(input.vendorId),
            status: input.status,
            purchasedAt: input.purchasedAt,
        });

        item.addOrder(order);
        await this.itemRepo.update(item);
        return { orderId: order.id };
    }
}
