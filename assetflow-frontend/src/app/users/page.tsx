import RouteGuard from '@/components/RouteGuard';
import UsersPage from '@/containers/users-page/UsersPage';

export default function Page() {
  return (
    <RouteGuard allowedRoles={['ADMIN']}>
      <UsersPage />
    </RouteGuard>
  );
}