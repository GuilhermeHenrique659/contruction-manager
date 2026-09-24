export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
}

export type AuthState =
  | { readonly status: 'unauthenticated' }
  | { readonly status: 'authenticating' }
  | { readonly status: 'authenticated'; readonly user: User }
  | { readonly status: 'error'; readonly message: string };

export function createInitialAuthState(): AuthState {
  return { status: 'unauthenticated' };
}

export function isAuthenticated(state: AuthState): state is { status: 'authenticated'; user: User } {
  return state.status === 'authenticated';
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const AUTH_KEY = {
  token: TOKEN_KEY,
  user: USER_KEY,
};