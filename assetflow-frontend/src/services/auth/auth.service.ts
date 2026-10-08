import { apiClient } from '@/libs/api/api-client';
import { tokenStorage } from '@/libs/auth/token-storage';
import {
  CurrentUser,
  LoginInput,
  LoginResponse,
} from '@/types/auth.types';

export const authService = {
  async login(input: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      input,
    );

    tokenStorage.set(response.accessToken);

    return response;
  },

  me: () =>
    apiClient.get<CurrentUser>('/auth/me'),

  logout(): void {
    tokenStorage.remove();
  },

  getToken(): string | null {
    return tokenStorage.get();
  },

  isAuthenticated(): boolean {
    return Boolean(tokenStorage.get());
  },
};