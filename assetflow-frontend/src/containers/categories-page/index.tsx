'use client';

import { useState } from 'react';

import Modal from '@/components/Modal';

import CategoriesTable from './components/CategoriesTable';
import CategoryForm from './components/CategoryForm';
import EditCategoryForm from './components/EditCategoryForm';

import { useCategoriesPage } from './hooks/useCategoriesPage';

import { Category } from '@/types/category.types';

export default function CategoriesPage() {
  const page = useCategoriesPage();

  const [editing, setEditing] =
    useState<Category | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Category | null>(null);

  // =========================================================
  // ACTIVATE / DEACTIVATE
  // =========================================================

  async function handleToggleStatus(
    category: Category,
  ) {
    const action =
      category.active
        ? 'deactivate'
        : 'activate';

    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    await page.toggleStatus(category);
  }

  // =========================================================
  // DELETE
  // =========================================================

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    const ok =
      await page.deleteCategory(
        deleteTarget,
      );

    if (ok) {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6 p-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Categories
        </h1>

        <p className="mt-1 text-gray-500">
          Manage asset categories used
          throughout AssetFlow.
        </p>
      </div>

      {/* ADD CATEGORY */}
      <CategoryForm
        saving={page.saving}
        error={page.formError}
        onSubmit={page.createCategory}
      />

      {/* ACTION ERROR OUTSIDE MODAL */}
      {page.actionError &&
        !editing &&
        !deleteTarget && (
          <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {page.actionError}

            <button
              type="button"
              onClick={
                page.clearActionError
              }
              className="ml-3 underline"
            >
              Dismiss
            </button>
          </div>
        )}

      {/* LOADING */}
      {page.loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Loading categories...
          </p>
        </div>
      )}

      {/* LOAD ERROR */}
      {page.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {page.error}

          <button
            type="button"
            onClick={page.reload}
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* CATEGORY TABLE */}
      {!page.loading &&
        !page.error && (
          <CategoriesTable
            categories={
              page.categories
            }
            onEdit={(category) => {
              page.clearActionError();
              setEditing(category);
            }}
            onToggleStatus={
              handleToggleStatus
            }
            onDelete={(category) => {
              page.clearActionError();

              setDeleteTarget(
                category,
              );
            }}
          />
        )}

      {/* =====================================================
          EDIT CATEGORY MODAL
      ====================================================== */}

      <Modal
        open={editing !== null}
        title="Edit Category"
        onClose={() => {
          if (!page.saving) {
            setEditing(null);
            page.clearActionError();
          }
        }}
      >
        {editing && (
          <EditCategoryForm
            key={editing.id}
            category={editing}
            saving={page.saving}
            error={
              page.actionError
            }
            onSubmit={async (
              input,
            ) => {
              /*
               * Send the complete original
               * Category object.
               *
               * updateCategory() compares it
               * with the edited input.
               */
              const ok =
                await page.updateCategory(
                  editing,
                  input,
                );

              /*
               * Only close after a real,
               * successful update.
               *
               * No changes -> false
               * -> modal stays open.
               */
              if (ok) {
                setEditing(null);
              }

              return ok;
            }}
            onCancel={() => {
              setEditing(null);
              page.clearActionError();
            }}
          />
        )}
      </Modal>

      {/* =====================================================
          DELETE CATEGORY MODAL
      ====================================================== */}

      <Modal
        open={
          deleteTarget !== null
        }
        title="Delete Category"
        onClose={() => {
          if (!page.saving) {
            setDeleteTarget(null);
            page.clearActionError();
          }
        }}
      >
        {deleteTarget && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to
              delete{' '}
              <strong>
                {deleteTarget.name}
              </strong>
              ?
            </p>

            {(deleteTarget._count
              ?.assets ?? 0) > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                This category contains{' '}
                <strong>
                  {
                    deleteTarget
                      ._count?.assets
                  }
                </strong>{' '}
                asset(s). Categories
                containing assets cannot
                be deleted. Deactivate it
                instead.
              </div>
            )}

            {page.actionError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {page.actionError}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                disabled={page.saving}
                onClick={() => {
                  setDeleteTarget(
                    null,
                  );

                  page.clearActionError();
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  page.saving ||
                  (deleteTarget._count
                    ?.assets ??
                    0) > 0
                }
                onClick={
                  handleDelete
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {page.saving
                  ? 'Deleting...'
                  : 'Delete Category'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}