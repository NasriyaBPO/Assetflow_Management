'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { employeesService } from '@/services/employees/employees.service';

import { useToast } from '@/contexts/ToastContext';

import {
  CreateEmployeeInput,
  Employee,
  UpdateEmployeeInput,
} from '@/types/employee.types';

export function useEmployeesPage() {
  const { showToast } = useToast();

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [search, setSearch] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  // --------------------------------------------------
  // Load Employees
  // --------------------------------------------------

  const loadEmployees = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setIsLoading(true);
        setError('');

        const response =
          await employeesService.list(
            {
              page,
              limit: 20,
              search:
                search || undefined,
            },
            signal,
          );

        setEmployees(response.data);

        setTotalPages(
          response.meta.totalPages,
        );
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load employees.',
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [page, search],
  );

  // --------------------------------------------------
  // Initial load / reload when page or search changes
  // --------------------------------------------------

  useEffect(() => {
    const controller =
      new AbortController();

    loadEmployees(
      controller.signal,
    );

    return () =>
      controller.abort();
  }, [loadEmployees]);

  // --------------------------------------------------
  // CREATE EMPLOYEE
  // --------------------------------------------------

  async function createEmployee(
    input: CreateEmployeeInput,
  ) {
    try {
      await employeesService.create(
        input,
      );

      await loadEmployees();

      showToast(
        'Employee added successfully.',
        'success',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create employee.';

      showToast(
        message,
        'error',
      );

      // Important:
      // throw again so CreateEmployeeForm
      // can also display the error.
      throw error;
    }
  }

  // --------------------------------------------------
  // UPDATE EMPLOYEE
  // --------------------------------------------------

  async function updateEmployee(
    id: string,
    input: UpdateEmployeeInput,
  ) {
    try {
      await employeesService.update(
        id,
        input,
      );

      await loadEmployees();

      showToast(
        'Employee updated successfully.',
        'success',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update employee.';

      showToast(
        message,
        'error',
      );

      // Keep existing form error handling working
      throw error;
    }
  }

  // --------------------------------------------------
  // Return page API
  // --------------------------------------------------

  return {
    employees,

    page,
    setPage,

    totalPages,

    search,
    setSearch,

    isLoading,
    error,

    createEmployee,
    updateEmployee,

    reload: loadEmployees,
  };
}