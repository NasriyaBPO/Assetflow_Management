import RouteGuard from '@/components/RouteGuard';
import EmployeesPage from '@/containers/employees-page/EmployeesPage';

export default function Page() {
  return (
    <RouteGuard allowedRoles={['ADMIN', 'ASSET_MANAGER']}>
      <EmployeesPage />
    </RouteGuard>
  );
}