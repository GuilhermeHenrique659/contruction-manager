import { useState, useCallback } from 'react';
import { AUTH_KEY, AuthState, createInitialAuthState, isAuthenticated } from '../features/auth/model/AuthModel';
import { Login } from '../features/auth/application/Login';
import { Register } from '../features/auth/application/Register';
import { FetchAuthGateway } from '../features/auth/gateway/FetchAuthGateway';
import LocalStorage from '../features/auth/storage/LocalStorage';


const gateway = new FetchAuthGateway();
const loginUseCase = new Login(gateway, new LocalStorage());
const registerUseCase = new Register(gateway, new LocalStorage());

function loadStoredAuth(): AuthState {
  if (typeof window === 'undefined') return createInitialAuthState();

  const token = localStorage.getItem(AUTH_KEY.token);
  const userStr = localStorage.getItem(AUTH_KEY.user);

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return { status: 'authenticated', user };
    } catch {
      localStorage.removeItem(AUTH_KEY.token);
      localStorage.removeItem(AUTH_KEY.user);
    }
  }

  return createInitialAuthState();
}

function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY.token);
  localStorage.removeItem(AUTH_KEY.user);
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => loadStoredAuth());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string) => {
    setIsLoading(true);
    setAuthState({ status: 'authenticating' });
    try {
      const { user } = await loginUseCase.execute({ email });
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
      const { user } = await registerUseCase.execute({ email, name });
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