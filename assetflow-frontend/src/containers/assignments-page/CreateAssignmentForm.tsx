'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import { assetsService } from '@/services/assets/assets.service';
import { employeesService } from '@/services/employees/employees.service';

import { CreateAssignmentInput } from '@/types/assignment.types';
import { Asset } from '@/types/asset.types';
import { Employee } from '@/types/employee.types';

interface Props {
  onSubmit: (
    input: CreateAssignmentInput,
  ) => Promise<void>;

  onCancel: () => void;
}

export default function CreateAssignmentForm({
  onSubmit,
  onCancel,
}: Props) {
  const [assets, setAssets] =
    useState<Asset[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [assetId, setAssetId] =
    useState('');

  const [employeeId, setEmployeeId] =
    useState('');

  const [notes, setNotes] =
    useState('');

  const [
    isLoadingOptions,
    setIsLoadingOptions,
  ] = useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState('');

  useEffect(() => {
    async function loadOptions() {
      try {
        setIsLoadingOptions(true);
        setError('');

        const [
          assetResponse,
          employeeResponse,
        ] = await Promise.all([
          assetsService.list({
            page: 1,
            limit: 100,
            status: 'AVAILABLE',
          }),

          employeesService.list({
            page: 1,
            limit: 100,
            status: 'ACTIVE',
          }),
        ]);

        setAssets(assetResponse.data);

        setEmployees(
          employeeResponse.data,
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load assets and employees.',
        );
      } finally {
        setIsLoadingOptions(false);
      }
    }

    loadOptions();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!assetId || !employeeId) {
      setError(
        'Please select an asset and employee.',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await onSubmit({
        assetId,
        employeeId,
        notes:
          notes.trim() || undefined,
      });

      onCancel();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to assign asset.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoadingOptions) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700" />

        <p className="mt-3 text-sm text-gray-500">
          Loading available assets and
          employees...
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Information */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
        Select an available asset and the
        employee who will receive it.
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Asset */}
      <div>
        <label
          htmlFor="assignment-asset"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Asset
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <select
          id="assignment-asset"
          value={assetId}
          onChange={(event) =>
            setAssetId(
              event.target.value,
            )
          }
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Select available asset
          </option>

          {assets.map((asset) => (
            <option
              key={asset.id}
              value={asset.id}
            >
              {asset.assetCode} —{' '}
              {asset.name}
            </option>
          ))}
        </select>

        {assets.length === 0 && (
          <p className="mt-2 text-sm text-amber-600">
            There are currently no
            available assets to assign.
          </p>
        )}
      </div>

      {/* Employee */}
      <div>
        <label
          htmlFor="assignment-employee"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Employee
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <select
          id="assignment-employee"
          value={employeeId}
          onChange={(event) =>
            setEmployeeId(
              event.target.value,
            )
          }
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">
            Select active employee
          </option>

          {employees.map(
            (employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {
                  employee.employeeCode
                }{' '}
                — {employee.firstName}{' '}
                {employee.lastName}
              </option>
            ),
          )}
        </select>

        {employees.length === 0 && (
          <p className="mt-2 text-sm text-amber-600">
            There are currently no active
            employees available.
          </p>
        )}
      </div>

      {/* Notes */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="assignment-notes"
            className="text-sm font-medium text-gray-700"
          >
            Notes
          </label>

          <span className="text-xs text-gray-400">
            {notes.length}/500
          </span>
        </div>

        <textarea
          id="assignment-notes"
          value={notes}
          onChange={(event) =>
            setNotes(
              event.target.value,
            )
          }
          maxLength={500}
          rows={4}
          placeholder="Optional notes about this assignment..."
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onCancel}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !assetId ||
            !employeeId
          }
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? 'Assigning...'
            : 'Assign Asset'}
        </button>
      </div>
    </form>
  );
}