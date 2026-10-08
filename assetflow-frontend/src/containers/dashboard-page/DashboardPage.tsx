'use client';

import { useDashboardPage } from './useDashboardPage';

export default function DashboardPage() {
  const {
    data,
    isLoading,
    error,
  } = useDashboardPage();

  if (isLoading) {
    return (
      <div className="p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-red-500">
              <AlertIcon />
            </div>

            <div>
              <p className="font-semibold text-red-800">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="font-medium text-gray-700">
            No dashboard information available.
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Dashboard information will appear here when data is available.
          </p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Assets',
      value: data.totalAssets,
      icon: <BoxIcon />,
      iconClass:
        'bg-slate-100 text-slate-700',
    },
    {
      label: 'Available',
      value: data.assetsByStatus.AVAILABLE,
      icon: <CheckIcon />,
      iconClass:
        'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Assigned',
      value: data.assetsByStatus.ASSIGNED,
      icon: <UserCheckIcon />,
      iconClass:
        'bg-blue-50 text-blue-600',
    },
    {
      label: 'Under Repair',
      value:
        data.assetsByStatus.UNDER_REPAIR,
      icon: <RepairIcon />,
      iconClass:
        'bg-amber-50 text-amber-600',
    },
    {
      label: 'Damaged',
      value: data.assetsByStatus.DAMAGED,
      icon: <AlertIcon />,
      iconClass:
        'bg-red-50 text-red-600',
    },
    {
      label: 'Retired',
      value: data.assetsByStatus.RETIRED,
      icon: <ArchiveIcon />,
      iconClass:
        'bg-gray-100 text-gray-500',
    },
  ];

  return (
    <div className="space-y-8 p-8">
      {/* Page heading */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-gray-500">
          Asset inventory overview
        </p>
      </div>

      {/* Summary cards */}

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Middle section */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Assets by Category */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <CategoryIcon />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Assets by Category
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  Distribution across asset categories
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {data.assetsByCategory.length ===
            0 ? (
              <EmptyState
                message="No category information available."
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {data.assetsByCategory.map(
                  (category) => (
                    <div
                      key={
                        category.categoryId
                      }
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-600">
                          {category.categoryName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="truncate text-sm font-medium text-gray-700">
                          {
                            category.categoryName
                          }
                        </span>
                      </div>

                      <span className="ml-4 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                        {category.count}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </section>

        {/* Recent Assignments */}

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <AssignmentIcon />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Recent Assignments
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  Latest assets issued to employees
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {data.recentAssignments.length ===
            0 ? (
              <EmptyState message="No recent assignments." />
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentAssignments.map(
                  (assignment) => (
                    <div
                      key={assignment.id}
                      className="flex flex-col justify-between gap-3 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {
                            assignment.asset
                              .assetCode
                          }
                          {' — '}
                          {
                            assignment.asset
                              .name
                          }
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {
                            assignment.employee
                              .firstName
                          }{' '}
                          {
                            assignment.employee
                              .lastName
                          }
                        </p>
                      </div>

                      <AssignmentStatus
                        status={
                          assignment.status
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recent Activity */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <ActivityIcon />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Recent Activity
              </h2>

              <p className="mt-0.5 text-sm text-gray-500">
                Latest changes recorded in AssetFlow
              </p>
            </div>
          </div>
        </div>

        <div className="px-6">
          {data.recentActivity.length ===
          0 ? (
            <div className="py-8">
              <EmptyState message="No recent activity." />
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {data.recentActivity.map(
                (activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-4 py-5"
                  >
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <ActivityIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                        <p className="font-medium text-gray-800">
                          {
                            activity.asset
                              .assetCode
                          }
                          {' — '}
                          {formatAction(
                            activity.action,
                          )}
                        </p>

                        <p className="shrink-0 text-xs text-gray-400">
                          {new Date(
                            activity.createdAt,
                          ).toLocaleString()}
                        </p>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {activity.description ??
                          'Asset activity recorded'}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="py-6 text-center">
      <p className="text-sm text-gray-500">
        {message}
      </p>
    </div>
  );
}

function AssignmentStatus({
  status,
}: {
  status: string;
}) {
  const returned =
    status === 'RETURNED';

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
        returned
          ? 'bg-gray-100 text-gray-600'
          : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {formatAction(status)}
    </span>
  );
}

function formatAction(
  value: string,
) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

/* =========================================================
   ICONS
   ========================================================= */

interface IconProps {
  className?: string;
}

function BoxIcon({
  className,
}: IconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
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
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function UserCheckIcon() {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="m16 11 2 2 4-4" />
    </svg>
  );
}

function RepairIcon() {
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
      <path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 9.6 6 7.3 3.7a4 4 0 0 0 5 5L19 15.4a2 2 0 0 1-2.8 2.8l-6.7-6.7" />
      <path d="m5 19 4-4" />
    </svg>
  );
}

function AlertIcon() {
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
      <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ArchiveIcon() {
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
      <path d="M3 6h18" />
      <path d="M5 6v14h14V6" />
      <path d="M8 3h8l2 3H6l2-3Z" />
      <path d="M9 11h6" />
    </svg>
  );
}

function CategoryIcon() {
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
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1.5"
      />
    </svg>
  );
}

function AssignmentIcon() {
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

function ActivityIcon() {
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
      <path d="M3 12h4l2-6 4 12 2-6h6" />
    </svg>
  );
}

/* =========================================================
   LOADING SKELETON
   ========================================================= */

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div>
        <div className="h-9 w-44 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-56 rounded bg-gray-100" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-xl border border-gray-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 rounded-xl border border-gray-200 bg-white" />
        <div className="h-72 rounded-xl border border-gray-200 bg-white" />
      </div>

      <div className="h-72 rounded-xl border border-gray-200 bg-white" />
    </div>
  );
}