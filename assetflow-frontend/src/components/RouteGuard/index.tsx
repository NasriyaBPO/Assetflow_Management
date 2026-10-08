'use client';

import {
  ReactNode,
  useEffect,
} from 'react';

import {
  usePathname,
  useRouter,
} from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { RoleName } from '@/types/auth.types';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: RoleName[];
}

export default function RouteGuard({
  children,
  allowedRoles,
}: RouteGuardProps) {
  const {
    user,
    loading,
  } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (
      allowedRoles &&
      !allowedRoles.includes(user.role)
    ) {
      router.replace('/dashboard');
    }
  }, [
    user,
    loading,
    allowedRoles,
    router,
    pathname,
  ]);

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  return <>{children}</>;
}