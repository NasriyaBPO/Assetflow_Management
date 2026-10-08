
'use client';

import { useEffect, useState } from 'react';

import { ApiError } from '@/libs/api/api-error';
import { assetsService } from '@/services/assets/assets.service';
import { categoriesService } from '@/services/categories/categories.service';

import { useToast } from '@/contexts/ToastContext';

import {
  Asset,
  AssetQuery,
  AssetStatus,
  BulkCreateAssetsInput,
  ChangeAssetStatusInput,
  CreateAssetInput,
  UpdateAssetInput,
} from '@/types/asset.types';

import { Category } from '@/types/category.types';
import { Paginated } from '@/types/common.types';

import {
  DEFAULT_FILTERS,
  hasActiveFilters,
} from '../utils/asset-filters';

export function useAssetsPage() {
  const { showToast } = useToast();

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [filters, setFilters] =
    useState<AssetQuery>(DEFAULT_FILTERS);

  const [searchInput, setSearchInput] =
    useState('');

  const [result, setResult] =
    useState<Paginated<Asset> | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [reloadKey, setReloadKey] =
    useState(0);

  // --------------------------------------------------
  // Modal states
  // --------------------------------------------------

  const [createOpen, setCreateOpen] =
    useState(false);

  const [bulkCreateOpen, setBulkCreateOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Asset | null>(null);

  const [statusTarget, setStatusTarget] =
    useState<Asset | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [formError, setFormError] =
    useState<string | null>(null);

  // --------------------------------------------------
  // Load categories
  // --------------------------------------------------

  useEffect(() => {
    categoriesService
      .list()
      .then(setCategories)
      .catch(() => {
        setCategories([]);
      });
  }, []);

  // --------------------------------------------------
  // Search debounce
  // --------------------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) =>
        current.search === searchInput
          ? current
          : {
              ...current,
              search: searchInput,
              page: 1,
            },
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // --------------------------------------------------
  // Load assets
  // --------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    assetsService
      .list(filters, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setResult(data);
        }
      })
      .catch((e) => {
        if (
          controller.signal.aborted ||
          (e instanceof DOMException &&
            e.name === 'AbortError')
        ) {
          return;
        }

        setError(
          e instanceof ApiError
            ? e.message
            : 'Something went wrong',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [filters, reloadKey]);

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const setStatus = (
    status: AssetStatus | '',
  ) => {
    setFilters((current) => ({
      ...current,
      status,
      page: 1,
    }));
  };

  const setCategoryId = (
    categoryId: string,
  ) => {
    setFilters((current) => ({
      ...current,
      categoryId,
      page: 1,
    }));
  };

  const setPage = (page: number) => {
    setFilters((current) => ({
      ...current,
      page,
    }));
  };

  const resetFilters = () => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  };

  const refreshAssets = () => {
    setReloadKey((current) => current + 1);
  };

  const refreshFromFirstPage = () => {
    setFilters((current) => ({
      ...current,
      page: 1,
    }));

    refreshAssets();
  };

  // --------------------------------------------------
  // Create modal
  // --------------------------------------------------

  const openCreate = () => {
    setFormError(null);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    if (saving) return;

    setCreateOpen(false);
    setFormError(null);
  };

  // --------------------------------------------------
  // Bulk create modal
  // --------------------------------------------------

  const openBulkCreate = () => {
    setFormError(null);
    setBulkCreateOpen(true);
  };

  const closeBulkCreate = () => {
    if (saving) return;

    setBulkCreateOpen(false);
    setFormError(null);
  };

  // --------------------------------------------------
  // Edit modal
  // --------------------------------------------------

  const openEdit = (asset: Asset) => {
    setFormError(null);
    setEditing(asset);
  };

  const closeEdit = () => {
    if (saving) return;

    setEditing(null);
    setFormError(null);
  };

  // --------------------------------------------------
  // Change status modal
  // --------------------------------------------------

  const openStatus = (asset: Asset) => {
    setFormError(null);
    setStatusTarget(asset);
  };

  const closeStatus = () => {
    if (saving) return;

    setStatusTarget(null);
    setFormError(null);
  };

  // --------------------------------------------------
  // CREATE SINGLE ASSET
  // --------------------------------------------------

  async function createAsset(
    input: CreateAssetInput,
  ): Promise<boolean> {
    if (saving) return false;

    setSaving(true);
    setFormError(null);

    try {
      await assetsService.create(input);

      setCreateOpen(false);

      refreshFromFirstPage();

      showToast(
        'Asset added successfully.',
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to add asset.';

      setFormError(message);

      showToast(message, 'error');

      return false;
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // CREATE BULK ASSETS
  // --------------------------------------------------

  async function createBulkAssets(
    input: BulkCreateAssetsInput,
  ): Promise<boolean> {
    if (saving) return false;

    setSaving(true);
    setFormError(null);

    try {
      const response =
        await assetsService.createBulk(input);

      // Close bulk registration modal
      setBulkCreateOpen(false);

      // Refresh asset list from first page
      refreshFromFirstPage();

      // Show success notification
      showToast(
        `${response.count} assets registered successfully.`,
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to register bulk assets.';

      setFormError(message);

      showToast(message, 'error');

      return false;
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // UPDATE ASSET
  // --------------------------------------------------

  async function updateAsset(
    id: string,
    input: UpdateAssetInput,
  ): Promise<boolean> {
    if (saving) return false;

    setSaving(true);
    setFormError(null);

    try {
      await assetsService.update(id, input);

      setEditing(null);

      refreshAssets();

      showToast(
        'Asset updated successfully.',
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to update asset.';

      setFormError(message);

      showToast(message, 'error');

      return false;
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // CHANGE ASSET STATUS
  // --------------------------------------------------

  async function changeStatus(
    id: string,
    input: ChangeAssetStatusInput,
  ): Promise<boolean> {
    if (saving) return false;

    setSaving(true);
    setFormError(null);

    try {
      await assetsService.changeStatus(
        id,
        input,
      );

      setStatusTarget(null);

      refreshAssets();

      showToast(
        'Asset status changed successfully.',
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to change asset status.';

      setFormError(message);

      showToast(message, 'error');

      return false;
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // Return page API
  // --------------------------------------------------

  return {
    // Asset data
    assets: result?.data ?? [],
    meta: result?.meta ?? null,
    categories,

    // Filters
    filters,
    searchInput,
    setSearchInput,
    setStatus,
    setCategoryId,
    setPage,
    resetFilters,
    hasFilters: hasActiveFilters(filters),

    // Loading and errors
    loading,
    error,
    retry: refreshAssets,
    saving,
    formError,

    // Single asset creation
    createOpen,
    openCreate,
    closeCreate,
    createAsset,

    // Bulk asset creation
    bulkCreateOpen,
    openBulkCreate,
    closeBulkCreate,
    createBulkAssets,

    // Edit asset
    editing,
    openEdit,
    closeEdit,
    updateAsset,

    // Change asset status
    statusTarget,
    openStatus,
    closeStatus,
    changeStatus,
  };
}
