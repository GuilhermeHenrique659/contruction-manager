import { useState, useCallback } from 'react';
import { AuthState, createInitialAuthState, isAuthenticated } from '../features/auth/model/AuthModel';
import { Login } from '../features/auth/application/Login';
import { Register } from '../features/auth/application/Register';
import { FetchAuthGateway } from '../features/auth/gateway/FetchAuthGateway';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

const gateway = new FetchAuthGateway();
const loginUseCase = new Login(gateway);
const registerUseCase = new Register(gateway);

function loadStoredAuth(): AuthState {
  if (typeof window === 'undefined') return createInitialAuthState();

  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { status: 'authenticated', user };
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }

  return createInitialAuthState();
}

function persistAuth(user: { id: string; email: string; name: string }, token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => loadStoredAuth());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string) => {
    setIsLoading(true);
    setAuthState({ status: 'authenticating' });
    try {
      const { user, token } = await loginUseCase.execute({ email });
      persistAuth(user, token);
      setAuthState({ status: 'authenticated', user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      setAuthState({ status: 'error', message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, name: string) => {
    setIsLoading(true);
    setAuthState({ status: 'authenticating' });
    try {
      const { user, token } = await registerUseCase.execute({ email, name });
      persistAuth(user, token);
      setAuthState({ status: 'authenticated', user });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      setAuthState({ status: 'error', message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuthState(createInitialAuthState());
  }, []);

  return {
    ...authState,
    isLoading,
    isAuthenticated: isAuthenticated(authState),
    user: isAuthenticated(authState) ? authState.user : null,
    login,
    register,
    logout,
  };
}