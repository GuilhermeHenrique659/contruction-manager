import type { Item } from '../domain/Item';
import type { ItemRepository } from './ItemRepository';

export class FakeItemRepository implements ItemRepository {
    private items: Item[] = [];

    async getById(id: string): Promise<Item | null> {
        return this.items.find(i => i.id === id) || null;
    }

    async add(item: Item): Promise<void> {
        this.items.push(item);
    }

    async update(item: Item): Promise<void> {
        const idx = this.items.findIndex(i => i.id === item.id);
        if (idx !== -1) this.items[idx] = item;
    }
}
