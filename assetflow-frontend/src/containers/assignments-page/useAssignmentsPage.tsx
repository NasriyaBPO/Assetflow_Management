'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { assignmentsService } from '@/services/assignments/assignments.service';

import { useToast } from '@/contexts/ToastContext';

import {
  Assignment,
  AssignmentStatus,
  CreateAssignmentInput,
} from '@/types/assignment.types';

export function useAssignmentsPage() {
  const { showToast } = useToast();

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [status, setStatus] =
    useState<AssignmentStatus | ''>('');

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // --------------------------------------------------
  // Load Assignments
  // --------------------------------------------------

  const loadAssignments = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError('');

        const response =
          await assignmentsService.list(
            {
              page,
              limit: 20,
              status:
                status || undefined,
            },
            signal,
          );

        setAssignments(
          response.data,
        );

        setTotalPages(
          response.meta.totalPages,
        );
      } catch (error) {
        // Ignore cancelled requests
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load assignments.',
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [page, status],
  );

  // --------------------------------------------------
  // Initial load / reload when filters change
  // --------------------------------------------------

  useEffect(() => {
    const controller =
      new AbortController();

    loadAssignments(
      controller.signal,
    );

    return () => {
      controller.abort();
    };
  }, [loadAssignments]);

  // --------------------------------------------------
  // CREATE ASSIGNMENT
  // --------------------------------------------------

  async function createAssignment(
    input: CreateAssignmentInput,
  ) {
    try {
      // Create assignment in backend
      await assignmentsService.create(
        input,
      );

      // Refresh assignment table
      await loadAssignments();

      // Show success notification
      showToast(
        'Asset assigned to employee successfully.',
        'success',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to assign asset.';

      // Show error notification
      showToast(
        message,
        'error',
      );

      /*
       * Important:
       * CreateAssignmentForm already has
       * its own error handling.
       *
       * Throw the error again so the form
       * knows that creation failed.
       */
      throw error;
    }
  }

  // --------------------------------------------------
  // Return Hook API
  // --------------------------------------------------

  return {
    assignments,

    status,
    setStatus,

    page,
    setPage,

    totalPages,

    isLoading,
    error,

    createAssignment,

    reload: loadAssignments,
  };
}