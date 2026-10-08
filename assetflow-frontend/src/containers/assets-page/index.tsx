
'use client';

import Button from '@/components/Button';
import Modal from '@/components/Modal';
import Pagination from '@/components/Pagination';

import AssetFilters from './components/AssetFilters';
import AssetsTable from './components/AssetsTable';
import BulkCreateAssetForm from './components/BulkCreateAssetForm';
import ChangeStatusForm from './components/ChangeStatusForm';
import CreateAssetForm from './components/CreateAssetForm';
import EditAssetForm from './components/EditAssetForm';

import { useAssetsPage } from './hooks/useAssetsPage';

export default function AssetsPage() {
  const page = useAssetsPage();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Assets
          </h1>

          <p className="mt-1 text-gray-500">
            Manage and monitor company assets
          </p>
        </div>

        {/* Asset registration buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={page.openBulkCreate}
          >
            + Bulk Register
          </Button>

          <Button onClick={page.openCreate}>
            + Add Asset
          </Button>
        </div>
      </div>

      {/* Asset filters */}
      <AssetFilters
        searchInput={page.searchInput}
        onSearchChange={page.setSearchInput}
        status={page.filters.status ?? ''}
        onStatusChange={page.setStatus}
        categoryId={page.filters.categoryId ?? ''}
        onCategoryChange={page.setCategoryId}
        categories={page.categories}
        hasFilters={page.hasFilters}
        onReset={page.resetFilters}
      />

      {/* Error message */}
      {page.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center justify-between gap-4">
            <span>{page.error}</span>

            <button
              type="button"
              onClick={page.retry}
              className="shrink-0 font-medium underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Asset table */}
      {!page.error && (
        <div
          className={
            page.loading
              ? 'opacity-60 transition-opacity'
              : 'transition-opacity'
          }
        >
          <AssetsTable
            assets={page.assets}
            hasFilters={page.hasFilters}
            onEdit={page.openEdit}
            onChangeStatus={page.openStatus}
          />
        </div>
      )}

      {/* Loading state */}
      {page.loading && (
        <p className="text-sm text-gray-500">
          Loading assets...
        </p>
      )}

      {/* Pagination */}
      {page.meta && !page.error && (
        <Pagination
          page={page.meta.page}
          totalPages={page.meta.totalPages}
          total={page.meta.total}
          onPageChange={page.setPage}
        />
      )}

      {/* Single Asset Registration Modal */}
      <Modal
        open={page.createOpen}
        title="Add Asset"
        onClose={page.closeCreate}
      >
        <CreateAssetForm
          categories={page.categories}
          saving={page.saving}
          error={page.formError}
          onSubmit={page.createAsset}
          onCancel={page.closeCreate}
        />
      </Modal>

      {/* Bulk Asset Registration Modal */}
      <Modal
        open={page.bulkCreateOpen}
        title="Bulk Asset Registration"
        onClose={page.closeBulkCreate}
      >
        <BulkCreateAssetForm
          categories={page.categories}
          saving={page.saving}
          error={page.formError}
          onSubmit={page.createBulkAssets}
          onCancel={page.closeBulkCreate}
        />
      </Modal>

      {/* Edit Asset Modal */}
      <Modal
        open={page.editing !== null}
        title="Edit Asset"
        onClose={page.closeEdit}
      >
        {page.editing && (
          <EditAssetForm
            key={page.editing.id}
            asset={page.editing}
            categories={page.categories}
            saving={page.saving}
            error={page.formError}
            onSubmit={(input) =>
              page.updateAsset(
                page.editing!.id,
                input,
              )
            }
            onCancel={page.closeEdit}
          />
        )}
      </Modal>

      {/* Change Asset Status Modal */}
      <Modal
        open={page.statusTarget !== null}
        title="Change Asset Status"
        onClose={page.closeStatus}
      >
        {page.statusTarget && (
          <ChangeStatusForm
            key={page.statusTarget.id}
            asset={page.statusTarget}
            saving={page.saving}
            error={page.formError}
            onSubmit={(input) =>
              page.changeStatus(
                page.statusTarget!.id,
                input,
              )
            }
            onCancel={page.closeStatus}
          />
        )}
      </Modal>
    </div>
  );
}
