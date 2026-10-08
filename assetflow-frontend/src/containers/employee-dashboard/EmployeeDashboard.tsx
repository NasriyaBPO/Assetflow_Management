'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import { myEmployeeService } from '@/services/my-employee/my-employee.service';

import { MyEmployeeProfile } from '@/types/my-employee.types';

export default function EmployeeDashboard() {
  const [employee, setEmployee] =
    useState<MyEmployeeProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadProfile = useCallback(
    async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await myEmployeeService.getProfile();

        setEmployee(response);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load employee profile.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        {error}

        <button
          type="button"
          onClick={loadProfile}
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {employee.firstName}
        </h1>

        <p className="mt-1 text-gray-500">
          View your employee information and
          assigned company assets.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Employee Code
          </p>

          <p className="mt-2 text-xl font-semibold">
            {employee.employeeCode}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Department
          </p>

          <p className="mt-2 text-xl font-semibold">
            {employee.department ?? '—'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Assigned Assets
          </p>

          <p className="mt-2 text-xl font-semibold">
            {employee._count.assignments}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold">
          My Profile
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="mt-1 font-medium">
              {employee.firstName}{' '}
              {employee.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="mt-1 font-medium">
              {employee.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Department
            </p>

            <p className="mt-1 font-medium">
              {employee.department ?? '—'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Designation
            </p>

            <p className="mt-1 font-medium">
              {employee.designation ?? '—'}
            </p>
          </div>
        </div>

        <Link
          href="/my-assets"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          View My Assets
        </Link>
      </div>
    </div>
  );
}