import MyAssetsPage from '@/containers/my-assets-page/MyAssetsPage';
import RouteGuard from '@/components/RouteGuard';

export default function Page() {
  return (
    <RouteGuard allowedRoles={['EMPLOYEE']}>
      <MyAssetsPage />
    </RouteGuard>
  );
}