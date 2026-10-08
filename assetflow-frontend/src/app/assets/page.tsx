import RouteGuard from '@/components/RouteGuard';
import AssetsPage from '@/containers/assets-page';

export default function Page() {
  return (
    <RouteGuard
      allowedRoles={[
        'ADMIN',
        'ASSET_MANAGER',
      ]}
    >
      <AssetsPage />
    </RouteGuard>
  );
}