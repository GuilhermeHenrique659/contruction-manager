import type { Item } from '../domain/Item';

export interface ItemRepository {
  getById(id: string): Promise<Item | null>;
  add(item: Item): Promise<void>;
  update(item: Item): Promise<void>;
}
