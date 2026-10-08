'use client';

import RouteGuard from '@/components/RouteGuard';

import DashboardPage from '@/containers/dashboard-page/DashboardPage';
import EmployeeDashboard from '@/containers/dashboard-page/EmployeeDashboard';

import { useAuth } from '@/contexts/AuthContext';

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <RouteGuard
      allowedRoles={[
        'ADMIN',
        'ASSET_MANAGER',
        'EMPLOYEE',
      ]}
    >
      {user?.role === 'EMPLOYEE' ? (
        <EmployeeDashboard />
      ) : (
        <DashboardPage />
      )}
    </RouteGuard>
  );
}