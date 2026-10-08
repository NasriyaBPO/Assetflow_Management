'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';

import { authService } from '@/services/auth/auth.service';
import { CurrentUser } from '@/types/auth.types';

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  refreshUser: () => Promise<CurrentUser | null>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    useCallback(async (): Promise<CurrentUser | null> => {
      const token = authService.getToken();

      if (!token) {
        setUser(null);
        setLoading(false);

        return null;
      }

      try {
        setLoading(true);

        const currentUser =
          await authService.me();

        setUser(currentUser);

        return currentUser;
      } catch {
        authService.logout();

        setUser(null);

        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  /*
   * Check existing authentication once
   * when the application starts.
   */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  function logout() {
    authService.logout();

    setUser(null);

    router.replace('/login');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider',
    );
  }

  return context;
}