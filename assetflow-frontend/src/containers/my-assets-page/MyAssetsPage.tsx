'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { myEmployeeService } from '@/services/my-employee/my-employee.service';
import { MyAssetsResponse } from '@/types/my-employee.types';

export default function MyAssetsPage() {
  const [data, setData] =
    useState<MyAssetsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response =
        await myEmployeeService.getAssets();

      setData(response);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load your assets.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  return (
    <div className="space-y-6 p-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Assets
        </h1>

        <p className="mt-1 text-gray-500">
          View the company assets currently
          assigned to you
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">
            Loading your assets...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            Unable to load your assets
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadAssets}
            className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && data && (
        <>
          {/* Employee Summary */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Assigned to
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {data.employee.firstName}{' '}
                {data.employee.lastName}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {data.employee.employeeCode}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-gray-500">
                Active Assets
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {data.assets.length}
              </p>
            </div>
          </div>

          {/* Empty State */}
          {data.assets.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xl text-gray-500">
                  ✓
                </span>
              </div>

              <h2 className="mt-4 font-semibold text-gray-900">
                No assets assigned
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                You currently do not have any
                active company assets assigned
                to your account.
              </p>
            </div>
          ) : (
            /* Asset Cards */
            <div className="grid gap-5 xl:grid-cols-2">
              {data.assets.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-sm"
                >
                  {/* Asset Header */}
                  <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {assignment.asset.assetCode}
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-gray-900">
                        {assignment.asset.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {
                          assignment.asset.category
                            .name
                        }
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        assignment.asset.status,
                      )}`}
                    >
                      {formatLabel(
                        assignment.asset.status,
                      )}
                    </span>
                  </div>

                  {/* Asset Details */}
                  <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-gray-500">
                        Brand
                      </dt>

                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {assignment.asset.brand ??
                          '—'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-gray-500">
                        Model
                      </dt>

                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {assignment.asset.model ??
                          '—'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-gray-500">
                        Serial Number
                      </dt>

                      <dd className="mt-1 break-all text-sm font-medium text-gray-900">
                        {assignment.asset
                          .serialNumber ?? '—'}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-gray-500">
                        Condition
                      </dt>

                      <dd className="mt-1">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getConditionStyle(
                            assignment.asset
                              .condition,
                          )}`}
                        >
                          {formatLabel(
                            assignment.asset
                              .condition,
                          )}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-gray-500">
                        Assigned Date
                      </dt>

                      <dd className="mt-1 text-sm font-medium text-gray-900">
                        {new Date(
                          assignment.assignedAt,
                        ).toLocaleDateString()}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-sm text-gray-500">
                        Assignment Status
                      </dt>

                      <dd className="mt-1">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {formatLabel(
                            assignment.status,
                          )}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  {/* Notes */}
                  {assignment.notes && (
                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Notes
                      </p>

                      <p className="mt-2 text-sm leading-6 text-gray-700">
                        {assignment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/*
 * Convert values such as:
 * UNDER_REPAIR -> Under Repair
 */
function formatLabel(value: string) {
  return value
    .split('_')
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase(),
    )
    .join(' ');
}

/*
 * Asset status badge styles
 */
function getStatusStyle(status: string) {
  switch (status) {
    case 'ASSIGNED':
      return 'bg-blue-50 text-blue-700';

    case 'AVAILABLE':
      return 'bg-green-50 text-green-700';

    case 'UNDER_REPAIR':
      return 'bg-amber-50 text-amber-700';

    case 'DAMAGED':
      return 'bg-red-50 text-red-700';

    case 'LOST':
      return 'bg-red-50 text-red-700';

    case 'RETIRED':
      return 'bg-gray-100 text-gray-600';

    default:
      return 'bg-gray-100 text-gray-600';
  }
}

/*
 * Asset condition badge styles
 */
function getConditionStyle(condition: string) {
  switch (condition) {
    case 'NEW':
      return 'bg-blue-50 text-blue-700';

    case 'GOOD':
      return 'bg-green-50 text-green-700';

    case 'FAIR':
      return 'bg-amber-50 text-amber-700';

    case 'DAMAGED':
      return 'bg-red-50 text-red-700';

    default:
      return 'bg-gray-100 text-gray-600';
  }
}