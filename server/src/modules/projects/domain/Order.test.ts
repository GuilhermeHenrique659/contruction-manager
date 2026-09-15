import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Order } from './Order';
import { OrderQuantity } from './OrderQuantity';
import { Price } from './Price';
import { Id } from '../../../shared/domain/Id';

describe('Order', () => {
    it('given valid props when create then creates order', () => {
        const order = Order.create({
            itemId: Id.fromString('i1'),
            quantity: OrderQuantity.create(5),
            price: Price.create(1000),
            vendorId: Id.fromString('v1'),
            status: 'paid',
            purchasedAt: new Date(),
        });

        assert.strictEqual(order.quantity, 5);
        assert.strictEqual(order.price, 1000);
        assert.strictEqual(order.status, 'paid');
    });

    it('given no status when create then default is pending_payment', () => {
        const order = Order.create({
            itemId: Id.fromString('i1'),
            quantity: OrderQuantity.create(1),
            price: Price.create(100),
            vendorId: Id.fromString('v1'),
        });

        assert.strictEqual(order.status, 'pending_payment');
    });

    it('given no purchasedAt when create then uses current date', () => {
        const before = new Date();
        const order = Order.create({
            itemId: Id.fromString('i1'),
            quantity: OrderQuantity.create(1),
            price: Price.create(100),
            vendorId: Id.fromString('v1'),
        });
        const after = new Date();

        assert.ok(order.purchasedAt >= before && order.purchasedAt <= after);
    });
});
