export interface Category {
  id: string;
  description: string;
}

export interface CategoryGateway {
  listAll(): Promise<Category[]>;
}
