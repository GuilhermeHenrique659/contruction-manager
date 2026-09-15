import type { Category } from '../domain/Category';

export interface CategoryRepository {
  getById(id: string): Promise<Category | null>;
  hasByDescription(description: string): Promise<boolean>;
  add(category: Category): Promise<void>;
}
