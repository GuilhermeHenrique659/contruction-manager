import { CategoryGateway, Category } from '../model/CategoryModel';

const API_BASE = '/api/categories';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export class FetchCategoryGateway implements CategoryGateway {
  async listAll(): Promise<Category[]> {
    const response = await fetch(API_BASE, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar categorias');
    }

    return response.json();
  }
}
