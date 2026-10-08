'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Modal from '@/components/Modal';

import CreateReturnForm from './CreateReturnForm';

import { assignmentsService } from '@/services/assignments/assignments.service';
import { returnsService } from '@/services/returns/returns.service';

import { Assignment } from '@/types/assignment.types';
import { CreateReturnInput } from '@/types/return.types';

import { useToast } from '@/contexts/ToastContext';

export default function ReturnsPage() {
  const { showToast } = useToast();

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [
    selectedAssignment,
    setSelectedAssignment,
  ] = useState<Assignment | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadActiveAssignments =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError('');

        const response =
          await assignmentsService.list({
            page: 1,
            limit: 100,
            status: 'ACTIVE',
          });

        setAssignments(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load active assignments.',
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadActiveAssignments();
  }, [loadActiveAssignments]);

  async function handleReturn(
  input: CreateReturnInput,
) {
  try {
    await returnsService.create(input);

    await loadActiveAssignments();

    showToast(
      'Asset returned successfully.',
      'success',
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Failed to return asset.';

    showToast(
      message,
      'error',
    );

    // CreateReturnForm already handles errors.
    // Throw it again so the modal stays open
    // and the form can display the error.
    throw error;
  }
}
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Returns
        </h1>

        <p className="mt-1 text-gray-500">
          Process assets returned by employees
          and record their return condition.
        </p>
      </div>

      {/* Information */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ReturnIcon />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Assets Awaiting Return
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Only assets currently assigned to
              employees are displayed here.
            </p>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Active Assignments
          </h2>

          {!isLoading && (
            <p className="mt-1 text-sm text-gray-500">
              {assignments.length}{' '}
              {assignments.length === 1
                ? 'asset'
                : 'assets'}{' '}
              currently assigned
            </p>
          )}
        </div>

        {isLoading ? (
          <ReturnTableSkeleton />
        ) : assignments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckIcon />
            </div>

            <p className="mt-4 font-medium text-gray-800">
              No assets awaiting return
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Assets currently assigned to
              employees will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4">
                    Asset
                  </th>

                  <th className="px-6 py-4">
                    Employee
                  </th>

                  <th className="px-6 py-4">
                    Assigned
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Notes
                  </th>

                  <th className="px-6 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {assignments.map(
                  (assignment) => (
                    <tr
                      key={assignment.id}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      {/* Asset */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <AssetIcon />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {
                                assignment
                                  .asset
                                  .assetCode
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {
                                assignment
                                  .asset.name
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Employee */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          {
                            assignment
                              .employee
                              .firstName
                          }{' '}
                          {
                            assignment
                              .employee
                              .lastName
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {
                            assignment
                              .employee
                              .employeeCode
                          }
                        </p>
                      </td>

                      {/* Assigned date */}
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {formatDate(
                          assignment.assignedAt,
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          Active
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="max-w-xs px-6 py-4 text-gray-500">
                        <p
                          className="truncate"
                          title={
                            assignment.notes ||
                            undefined
                          }
                        >
                          {assignment.notes ||
                            '—'}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedAssignment(
                              assignment,
                            )
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                        >
                          Return Asset
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Return modal */}
      <Modal
        open={
          selectedAssignment !== null
        }
        title="Return Asset"
        onClose={() =>
          setSelectedAssignment(null)
        }
      >
        {selectedAssignment && (
          <CreateReturnForm
            assignment={
              selectedAssignment
            }
            onSubmit={handleReturn}
            onCancel={() =>
              setSelectedAssignment(
                null,
              )
            }
          />
        )}
      </Modal>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function ReturnTableSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-8 border-b border-gray-100 px-6 py-5 last:border-0"
        >
          <div className="flex flex-1 items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gray-100" />

            <div>
              <div className="h-4 w-24 rounded bg-gray-100" />

              <div className="mt-2 h-3 w-32 rounded bg-gray-100" />
            </div>
          </div>

          <div className="h-4 w-32 rounded bg-gray-100" />

          <div className="h-4 w-28 rounded bg-gray-100" />

          <div className="h-6 w-16 rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function ReturnIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10a6 6 0 0 1 6 6v1" />
    </svg>
  );
}

function AssetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

      <path d="m3.3 7 8.7 5 8.7-5" />

      <path d="M12 22V12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}