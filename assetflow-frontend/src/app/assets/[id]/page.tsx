import RouteGuard from '@/components/RouteGuard';
import AssetDetailsPage from '@/containers/asset-details-page/AssetDetailsPage';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <RouteGuard allowedRoles={['ADMIN', 'ASSET_MANAGER']}>
      <AssetDetailsPage assetId={id} />
    </RouteGuard>
  );
}