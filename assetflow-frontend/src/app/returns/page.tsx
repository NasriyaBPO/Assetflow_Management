import RouteGuard from '@/components/RouteGuard';
import ReturnsPage from '@/containers/returns-page/ReturnsPage';

export default function Page() {
  return (
    <RouteGuard allowedRoles={['ADMIN', 'ASSET_MANAGER']}>
      <ReturnsPage />
    </RouteGuard>
  );
}