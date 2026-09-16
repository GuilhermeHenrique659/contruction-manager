import { ProjectGateway } from './ProjectGateway';
import { Project, CreateProjectInput } from '../model/ProjectModel';

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
}