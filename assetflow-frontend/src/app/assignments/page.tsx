import RouteGuard from '@/components/RouteGuard';
import AssignmentsPage from '@/containers/assignments-page/AssignmentsPage';

export default function Page() {
  return (
    <RouteGuard allowedRoles={['ADMIN', 'ASSET_MANAGER']}>
      <AssignmentsPage />
    </RouteGuard>
  );
}