import { AuthGateway } from './AuthGateway';

const API_BASE = '/api/users';

export class FetchAuthGateway implements AuthGateway {
  async login(email: string): Promise<{ id: string; name: string; token: string }> {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    return response.json();
  }

  async register(email: string, name: string): Promise<{ id: string; name: string; token: string }> {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao cadastrar');
    }

    return response.json();
  }
}