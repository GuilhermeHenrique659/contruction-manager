import { describe, it } from 'node:test';
import assert from 'node:assert';
import { AddOrderToItem } from './AddOrderToItem';
import { FakeItemRepository } from '../repository/FakeItemRepository';
import { FakeVendorRepository } from '../repository/FakeVendorRepository';
import { Item } from '../domain/Item';
import { Vendor } from '../domain/Vendor';
import { DayOfMonth } from '../domain/DayOfMonth';
import { Id } from '../../../shared/domain/Id';



describe('AddOrderToItem', () => {
    it('given item and vendor when execute then adds order', async () => {
        const itemRepo = new FakeItemRepository();
        const vendorRepo = new FakeVendorRepository();

        const item = Item.create({ description: 'Item A', categoryId: Id.create(), projectId: Id.create() });
        await itemRepo.add(item);

        const vendor = Vendor.create({ name: 'Vendor A', paymentDay: new DayOfMonth(10), projectId: Id.create() });
        await vendorRepo.add(vendor);

        const useCase = new AddOrderToItem(itemRepo, vendorRepo);
        const result = await useCase.execute({ itemId: item.id, quantity: 5, price: 100.5, vendorId: vendor.id });

        assert.strictEqual(typeof result.orderId, 'string');
        const updatedItem = await itemRepo.getById(item.id);
        assert.strictEqual(updatedItem!.orders.length, 1);
    });

    it('given missing item when execute then throws', async () => {
        const itemRepo = new FakeItemRepository();
        const vendorRepo = new FakeVendorRepository();

        const vendor = Vendor.create({ name: 'Vendor A', paymentDay: new DayOfMonth(10), projectId: Id.create() });
        await vendorRepo.add(vendor);

        const useCase = new AddOrderToItem(itemRepo, vendorRepo);
        await assert.rejects(
            () => useCase.execute({ itemId: 'missing', quantity: 1, price: 10, vendorId: vendor.id }),
            /Item not found/
        );
    });

    it('given missing vendor when execute then throws', async () => {
        const itemRepo = new FakeItemRepository();
        const vendorRepo = new FakeVendorRepository();

        const item = Item.create({ description: 'Item A', categoryId: Id.create(), projectId: Id.create() });
        await itemRepo.add(item);

        const useCase = new AddOrderToItem(itemRepo, vendorRepo);
        await assert.rejects(
            () => useCase.execute({ itemId: item.id, quantity: 1, price: 10, vendorId: 'missing' }),
            /Vendor not found/
        );
    });
});
