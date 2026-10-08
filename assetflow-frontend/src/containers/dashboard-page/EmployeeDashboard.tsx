'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { employeesService } from '@/services/employees/employees.service';

import {
  EmployeeAssetAssignment,
  EmployeeSelfProfile,
} from '@/types/employee-self.types';

export default function EmployeeDashboard() {
  const [profile, setProfile] =
    useState<EmployeeSelfProfile | null>(null);

  const [assets, setAssets] =
    useState<EmployeeAssetAssignment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [profileData, assetData] =
        await Promise.all([
          employeesService.getMe(),
          employeesService.getMyAssets(),
        ]);

      setProfile(profileData);
      setAssets(assetData.assets);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to load dashboard.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading your dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}

        <button
          type="button"
          onClick={() => void loadData()}
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-gray-500">
        Employee profile not found.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}

      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {profile.firstName}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View your profile and assets
          currently assigned to you.
        </p>
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Employee Code"
          value={profile.employeeCode}
        />

        <SummaryCard
          label="Department"
          value={profile.department ?? '—'}
        />

        <SummaryCard
          label="Designation"
          value={profile.designation ?? '—'}
        />

        <SummaryCard
          label="Assigned Assets"
          value={String(
            profile._count.assignments,
          )}
        />
      </div>

      {/* Profile */}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold">
          My Profile
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Info
            label="Full Name"
            value={`${profile.firstName} ${profile.lastName}`}
          />

          <Info
            label="Email"
            value={profile.email}
          />

          <Info
            label="Employee Code"
            value={profile.employeeCode}
          />

          <Info
            label="Department"
            value={profile.department ?? '—'}
          />

          <Info
            label="Designation"
            value={profile.designation ?? '—'}
          />

          <Info
            label="Status"
            value={formatValue(profile.status)}
          />
        </div>
      </div>

      {/* Assets */}

      <div>
        <h2 className="text-lg font-semibold">
          My Assigned Assets
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Assets currently assigned to you.
        </p>
      </div>

      {assets.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
          You currently have no assigned assets.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {assets.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    {assignment.asset.assetCode}
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    {assignment.asset.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {
                      assignment.asset.category
                        .name
                    }
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  Assigned
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <Info
                  label="Brand"
                  value={
                    assignment.asset.brand ??
                    '—'
                  }
                />

                <Info
                  label="Model"
                  value={
                    assignment.asset.model ??
                    '—'
                  }
                />

                <Info
                  label="Serial Number"
                  value={
                    assignment.asset
                      .serialNumber ?? '—'
                  }
                />

                <Info
                  label="Condition"
                  value={formatValue(
                    assignment.asset
                      .condition,
                  )}
                />

                <Info
                  label="Asset Status"
                  value={formatValue(
                    assignment.asset.status,
                  )}
                />

                <Info
                  label="Assigned Date"
                  value={new Date(
                    assignment.assignedAt,
                  ).toLocaleDateString()}
                />
              </div>

              {assignment.notes && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400">
                    Notes
                  </p>

                  <p className="mt-1 text-sm text-gray-700">
                    {assignment.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
}

function formatValue(value: string) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}