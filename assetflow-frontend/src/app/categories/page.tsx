import RouteGuard from '@/components/RouteGuard';
import CategoriesPage from '@/containers/categories-page';

export default function Page() {
  return (
    <RouteGuard allowedRoles={['ADMIN', 'ASSET_MANAGER']}>
      <CategoriesPage />
    </RouteGuard>
  );
}