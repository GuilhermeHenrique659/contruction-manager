export interface CategoryRepository {
  getById(id: string): Promise<{ id: string } | null>;
}
