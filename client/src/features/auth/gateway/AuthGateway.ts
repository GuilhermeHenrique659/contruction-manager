export interface AuthGateway {
  login(email: string): Promise<{ id: string; name: string; token: string }>;
  register(email: string, name: string): Promise<{ id: string; name: string; token: string }>;
}