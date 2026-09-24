import { ApplicationError } from '../../../shared/domain/ApplicationError';
import { Order } from '../domain/Order';
import { OrderQuantity } from '../domain/OrderQuantity';
import { Price } from '../domain/Price';
import { Id } from '../../../shared/domain/Id';
import type { ItemRepository } from '../repository/ItemRepository';
import type { VendorRepository } from '../repository/VendorRepository';
import { Authorizable } from '../../users/application/Authorizer';

type Input = {
    itemId: string;
    projectId: string;
    userId: string;
    quantity: number;
    price: number;
    vendorId: string;
    status?: 'pending_payment' | 'paid';
    purchasedAt?: string;
};

type Output = {
    orderId: string;
};

export class AddOrderToItem implements Authorizable<Input, Output> {
    constructor(
        private readonly itemRepo: ItemRepository,
        private readonly vendorRepo: VendorRepository,
    ) { }

    async execute(input: Input): Promise<Output> {
        const item = await this.itemRepo.getById(input.itemId);
        if (!item) {
            throw new ApplicationError('Item not found');
        }

        if (item.projectId !== input.projectId) {
            throw new ApplicationError('Item does not belong to the specified project');
        }

        const vendor = await this.vendorRepo.getById(input.vendorId);
        if (!vendor) {
            throw new ApplicationError('Vendor not found');
        }

        const order = Order.create({
            itemId: Id.fromString(input.itemId),
            quantity: OrderQuantity.create(input.quantity),
            price: Price.create(Math.round(input.price * 100)),
            vendorId: Id.fromString(input.vendorId),
            status: input.status,
            purchasedAt: input.purchasedAt,
        });
        console.log(order);
        
        item.addOrder(order);
        await this.itemRepo.update(item);
        return { orderId: order.id };
    }
}
