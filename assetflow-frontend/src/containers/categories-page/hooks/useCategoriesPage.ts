'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { ApiError } from '@/libs/api/api-error';
import { categoriesService } from '@/services/categories/categories.service';
import { useToast } from '@/contexts/ToastContext';

import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/category.types';

export function useCategoriesPage() {
  const { showToast } = useToast();

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState<string | null>(null);

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data =
        await categoriesService.list();

      setCategories(data);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // =========================================================
  // CREATE CATEGORY
  // =========================================================

  async function createCategory(
    input: CreateCategoryInput,
  ) {
    setSaving(true);
    setFormError(null);

    try {
      await categoriesService.create(
        input,
      );

      await load();

      showToast(
        'Category added successfully.',
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to add category';

      setFormError(message);

      showToast(
        message,
        'error',
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // UPDATE CATEGORY
  // =========================================================

  async function updateCategory(
    category: Category,
    input: UpdateCategoryInput,
  ) {
    // Clear previous edit/action error
    setActionError(null);

    // Original values
    const originalName =
      category.name.trim();

    const originalDescription =
      category.description?.trim() ?? '';

    // New values
    const newName =
      input.name?.trim() ??
      originalName;

    const newDescription =
      input.description?.trim() ?? '';

    // Check whether anything actually changed
    const hasChanges =
      originalName !== newName ||
      originalDescription !==
        newDescription;

    // Nothing changed
    if (!hasChanges) {
      setActionError(
        'No changes to save.',
      );

      // false means:
      // do not close the edit modal
      return false;
    }

    setSaving(true);

    try {
      await categoriesService.update(
        category.id,
        input,
      );

      await load();

      showToast(
        'Category updated successfully.',
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to update category';

      setActionError(message);

      showToast(
        message,
        'error',
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // ACTIVATE / DEACTIVATE CATEGORY
  // =========================================================

  async function toggleStatus(
    category: Category,
  ) {
    setSaving(true);
    setActionError(null);

    try {
      await categoriesService.update(
        category.id,
        {
          active: !category.active,
        },
      );

      await load();

      showToast(
        category.active
          ? 'Category deactivated successfully.'
          : 'Category activated successfully.',
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to change category status';

      setActionError(message);

      showToast(
        message,
        'error',
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  async function deleteCategory(
    category: Category,
  ) {
    setSaving(true);
    setActionError(null);

    try {
      await categoriesService.remove(
        category.id,
      );

      await load();

      showToast(
        'Category deleted successfully.',
        'success',
      );

      return true;
    } catch (e) {
      const message =
        e instanceof ApiError
          ? e.message
          : 'Failed to delete category';

      setActionError(message);

      showToast(
        message,
        'error',
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // CLEAR ACTION ERROR
  // =========================================================

  function clearActionError() {
    setActionError(null);
  }

  return {
    categories,

    loading,
    error,

    saving,
    formError,
    actionError,

    createCategory,
    updateCategory,
    toggleStatus,
    deleteCategory,

    clearActionError,

    reload: load,
  };
}