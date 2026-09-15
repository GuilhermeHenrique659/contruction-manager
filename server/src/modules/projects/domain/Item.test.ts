import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Item } from './Item';
import { Order } from './Order';
import { OrderQuantity } from './OrderQuantity';
import { OrderPrice } from './OrderPrice';
import { Id } from '../../../shared/domain/Id';

describe('Item', () => {
    it('given props when create then creates item with empty orders', () => {
        const item = Item.create({
            description: 'Item desc',
            categoryId: Id.fromString('c1'),
            projectId: Id.fromString('p1'),
        });

        assert.strictEqual(item.description, 'Item desc');
        assert.strictEqual(item.orders.length, 0);
    });

    it('given item when addOrder then adds order', () => {
        const item = Item.create({
            description: 'Item desc',
            categoryId: Id.fromString('c1'),
            projectId: Id.fromString('p1'),
        });
        const order = Order.create({
            itemId: item.id ? Id.fromString(item.id) : Id.fromString('i1'),
            quantity: OrderQuantity.create(2),
            price: OrderPrice.create(500),
            vendorId: Id.fromString('v1'),
        });
        // Pass itemId manually since order needs it
        item.addOrder(order);

        assert.strictEqual(item.orders.length, 1);
    });
});
