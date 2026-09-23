import { ProjectGateway } from './ProjectGateway';
import { Project, CreateProjectInput } from '../model/ProjectModel';
import { ProjectItem } from '../model/ProjectItem';
import { Vendor } from '../model/Vendor';

const API_BASE = '/api/projects';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export class FetchProjectGateway implements ProjectGateway {
  async listAll(): Promise<Project[]> {
    const response = await fetch(API_BASE, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar projetos');
    }

    return response.json();
  }

  async create(input: CreateProjectInput): Promise<{ id: string }> {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar projeto');
    }

    return response.json();
  }

  async getById(id: string): Promise<Project> {
    const response = await fetch(`${API_BASE}/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar projeto');
    }

    return response.json();
  }

  async listItems(projectId: string): Promise<ProjectItem[]> {
    const response = await fetch(`${API_BASE}/${projectId}/items`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar itens');
    }

    return response.json();
  }

  async createItem(input: { description: string; categoryId: string; projectId: string }): Promise<{ id: string }> {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar item');
    }

    return response.json();
  }

  async addOrderToItem(input: { itemId: string; quantity: number; price: number; vendorId: string; status?: string; purchasedAt?: string }): Promise<{ orderId: string }> {
    const { itemId, ...body } = input;
    const response = await fetch(`/api/items/${itemId}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar compra');
    }

    return response.json();
  }

  async listVendors(projectId: string): Promise<Vendor[]> {
    const response = await fetch(`${API_BASE}/${projectId}/vendors`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao buscar fornecedores');
    }

    return response.json();
  }

  async createVendor(input: { name: string; paymentDay: number | null; projectId: string }): Promise<{ id: string }> {
    const response = await fetch('/api/vendors', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar fornecedor');
    }

    return response.json();
  }
}