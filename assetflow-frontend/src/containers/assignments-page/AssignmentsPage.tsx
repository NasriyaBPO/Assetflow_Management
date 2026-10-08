'use client';

import { useState } from 'react';

import Modal from '@/components/Modal';
import CreateAssignmentForm from './CreateAssignmentForm';
import { useAssignmentsPage } from './useAssignmentsPage';

export default function AssignmentsPage() {
  const {
    assignments,
    status,
    setStatus,
    page,
    setPage,
    totalPages,
    isLoading,
    error,
    createAssignment,
  } = useAssignmentsPage();

  const [createOpen, setCreateOpen] =
    useState(false);

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Assignments
          </h1>

          <p className="mt-1 text-gray-500">
            Assign company assets to employees
            and track their assignment history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <span className="mr-2 text-lg leading-none">
            +
          </span>
          Assign Asset
        </button>
      </div>

      {/* Filter */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="font-semibold text-gray-900">
            Filter Assignments
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View all, active, or returned asset
            assignments.
          </p>
        </div>

        <div className="max-w-xs">
          <label
            htmlFor="assignment-status"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Status
          </label>

          <select
            id="assignment-status"
            value={status}
            onChange={(event) => {
              setStatus(
                event.target.value as
                  | 'ACTIVE'
                  | 'RETURNED'
                  | '',
              );

              setPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">
              All Assignments
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="RETURNED">
              Returned
            </option>
          </select>
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
            Assignment History
          </h2>

          {!isLoading && (
            <p className="mt-1 text-sm text-gray-500">
              {assignments.length}{' '}
              {assignments.length === 1
                ? 'assignment'
                : 'assignments'}{' '}
              shown on this page
            </p>
          )}
        </div>

        {isLoading ? (
          <AssignmentSkeleton />
        ) : assignments.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <AssignmentIcon />
            </div>

            <p className="mt-4 font-medium text-gray-700">
              No assignments found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {status
                ? 'There are no assignments matching this status.'
                : 'Assign an available asset to an active employee to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
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
                    Returned
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4">
                    Notes
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
                                assignment.asset
                                  .assetCode
                              }
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                              {
                                assignment.asset
                                  .name
                              }
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Employee */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">
                          {
                            assignment.employee
                              .firstName
                          }{' '}
                          {
                            assignment.employee
                              .lastName
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {
                            assignment.employee
                              .employeeCode
                          }
                        </p>
                      </td>

                      {/* Assigned */}
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {formatDate(
                          assignment.assignedAt,
                        )}
                      </td>

                      {/* Returned */}
                      <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                        {assignment.returnedAt
                          ? formatDate(
                              assignment.returnedAt,
                            )
                          : '—'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <AssignmentStatusBadge
                          status={
                            assignment.status
                          }
                        />
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
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            Page{' '}
            <span className="font-medium text-gray-700">
              {page}
            </span>{' '}
            of{' '}
            <span className="font-medium text-gray-700">
              {totalPages}
            </span>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                setPage(page - 1)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage(page + 1)
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create Assignment */}
      <Modal
        open={createOpen}
        title="Assign Asset"
        onClose={() =>
          setCreateOpen(false)
        }
      >
        <CreateAssignmentForm
          onSubmit={createAssignment}
          onCancel={() =>
            setCreateOpen(false)
          }
        />
      </Modal>
    </div>
  );
}

function AssignmentStatusBadge({
  status,
}: {
  status: string;
}) {
  const active = status === 'ACTIVE';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? 'bg-blue-50 text-blue-700'
          : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {active ? 'Active' : 'Returned'}
    </span>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function AssignmentSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({
        length: 5,
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
          <div className="h-4 w-24 rounded bg-gray-100" />
          <div className="h-6 w-16 rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
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

function AssignmentIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
      />

      <path d="M9 3v4h6V3" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}