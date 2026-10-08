'use client';

import { useState } from 'react';

import Modal from '@/components/Modal';

import CreateEmployeeForm from './CreateEmployeeForm';
import EditEmployeeForm from './EditEmployeeForm';
import { useEmployeesPage } from './useEmployeesPage';

import { Employee } from '@/types/employee.types';

export default function EmployeesPage() {
  const {
    employees,
    search,
    setSearch,
    isLoading,
    error,
    createEmployee,
    updateEmployee,
  } = useEmployeesPage();

  const [createOpen, setCreateOpen] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  return (
    <div className="space-y-6 p-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Employees
          </h1>

          <p className="mt-1 text-gray-500">
            Manage employees and their asset
            assignments
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
          Add Employee
        </button>
      </div>

      {/* Search */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="font-semibold text-gray-900">
            Find Employees
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Search employees by name, employee ID,
            email or department.
          </p>
        </div>

        <div className="relative max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <SearchIcon />
          </div>

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search employees..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Employees table */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="font-semibold text-gray-900">
            Employee List
          </h2>

          {!isLoading && (
            <p className="mt-1 text-sm text-gray-500">
              {employees.length}{' '}
              {employees.length === 1
                ? 'employee'
                : 'employees'}{' '}
              shown
            </p>
          )}
        </div>

        {isLoading ? (
          <EmployeeTableSkeleton />
        ) : employees.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <EmployeeIcon />
            </div>

            <p className="mt-4 font-medium text-gray-700">
              No employees found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {search
                ? 'Try using a different search term.'
                : 'Add your first employee to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4">
                    Employee ID
                  </th>

                  <th className="px-6 py-4">
                    Employee
                  </th>

                  <th className="px-6 py-4">
                    Department
                  </th>

                  <th className="px-6 py-4">
                    Designation
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                  <th className="px-6 py-4 text-center">
                    Assets
                  </th>

                  <th className="px-6 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="transition-colors hover:bg-gray-50/70"
                  >
                    {/* Employee ID */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {employee.employeeCode}
                      </span>
                    </td>

                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <EmployeeAvatar
                          firstName={
                            employee.firstName
                          }
                          lastName={
                            employee.lastName
                          }
                        />

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800">
                            {employee.firstName}{' '}
                            {employee.lastName}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-gray-500">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 text-gray-600">
                      {employee.department || '—'}
                    </td>

                    {/* Designation */}
                    <td className="px-6 py-4 text-gray-600">
                      {employee.designation || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <EmployeeStatusBadge
                        status={employee.status}
                      />
                    </td>

                    {/* Assignments */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                        {employee._count
                          ?.assignments ?? 0}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedEmployee(
                            employee,
                          )
                        }
                        className="font-medium text-blue-600 transition hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create Employee Modal */}
      <Modal
        open={createOpen}
        title="Add Employee"
        onClose={() =>
          setCreateOpen(false)
        }
      >
        <CreateEmployeeForm
          onSubmit={createEmployee}
          onCancel={() =>
            setCreateOpen(false)
          }
        />
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        open={selectedEmployee !== null}
        title="Edit Employee"
        onClose={() =>
          setSelectedEmployee(null)
        }
      >
        {selectedEmployee && (
          <EditEmployeeForm
            employee={selectedEmployee}
            onSubmit={updateEmployee}
            onCancel={() =>
              setSelectedEmployee(null)
            }
          />
        )}
      </Modal>
    </div>
  );
}

/* =========================================================
   EMPLOYEE AVATAR
   ========================================================= */

function EmployeeAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
      {initials}
    </div>
  );
}

/* =========================================================
   STATUS
   ========================================================= */

function EmployeeStatusBadge({
  status,
}: {
  status: string;
}) {
  const active = status === 'ACTIVE';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-gray-100 text-gray-600'
      }`}
    >
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

/* =========================================================
   LOADING
   ========================================================= */

function EmployeeTableSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({
        length: 5,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-6 border-b border-gray-100 px-6 py-5 last:border-0"
        >
          <div className="h-4 w-20 rounded bg-gray-100" />

          <div className="flex flex-1 items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-100" />

            <div>
              <div className="h-4 w-32 rounded bg-gray-100" />
              <div className="mt-2 h-3 w-44 rounded bg-gray-100" />
            </div>
          </div>

          <div className="h-4 w-24 rounded bg-gray-100" />

          <div className="h-4 w-20 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   ICONS
   ========================================================= */

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="11"
        cy="11"
        r="8"
      />

      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function EmployeeIcon() {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path d="M19 8v6" />

      <path d="M22 11h-6" />
    </svg>
  );
}