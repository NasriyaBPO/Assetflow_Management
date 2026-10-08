'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Modal from '@/components/Modal';

import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';

import { usersService } from '@/services/users/users.service';
import { rolesService } from '@/services/roles/roles.service';
import { employeesService } from '@/services/employees/employees.service';

import { useToast } from '@/contexts/ToastContext';

import {
  CreateUserInput,
  Role,
  UpdateUserInput,
  User,
} from '@/types/user.types';

import { Employee } from '@/types/employee.types';

export default function UsersPage() {
  const { showToast } = useToast();

  // =========================================================
  // STATE
  // =========================================================

  const [users, setUsers] =
    useState<User[]>([]);

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [formError, setFormError] =
    useState('');

  const [actionError, setActionError] =
    useState('');

  const [createOpen, setCreateOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<User | null>(null);

  const [statusTarget, setStatusTarget] =
    useState<User | null>(null);

  // =========================================================
  // LOAD USERS, ROLES AND EMPLOYEES
  // =========================================================

  const loadData = useCallback(
    async () => {
      try {
        setLoading(true);
        setError('');

        const [
          usersResponse,
          rolesResponse,
          employeesResponse,
        ] = await Promise.all([
          usersService.list(),

          rolesService.list(),

          employeesService.list({
            page: 1,
            limit: 100,
            status: 'ACTIVE',
          }),
        ]);

        setUsers(usersResponse);

        setRoles(rolesResponse);

        setEmployees(
          employeesResponse.data,
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load users.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // =========================================================
  // CREATE USER
  // =========================================================

  async function createUser(
    input: CreateUserInput,
  ) {
    try {
      setSaving(true);
      setFormError('');

      await usersService.create(input);

      setCreateOpen(false);

      await loadData();

      showToast(
        'User created successfully.',
        'success',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create user.';

      setFormError(message);

      showToast(
        message,
        'error',
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // UPDATE USER
  // =========================================================

  async function updateUser(
    id: string,
    input: UpdateUserInput,
  ): Promise<boolean> {
    try {
      setSaving(true);
      setFormError('');

      await usersService.update(
        id,
        input,
      );

      await loadData();

      showToast(
        'User updated successfully.',
        'success',
      );

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update user.';

      setFormError(message);

      showToast(
        message,
        'error',
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // ACTIVATE / DEACTIVATE USER
  // =========================================================

  async function changeStatus() {
    if (!statusTarget) {
      return;
    }

    try {
      setSaving(true);
      setActionError('');

      const nextStatus =
        statusTarget.status === 'ACTIVE'
          ? 'INACTIVE'
          : 'ACTIVE';

      await usersService.update(
        statusTarget.id,
        {
          status: nextStatus,
        },
      );

      setStatusTarget(null);

      await loadData();

      showToast(
        nextStatus === 'ACTIVE'
          ? 'User activated successfully.'
          : 'User deactivated successfully.',
        'success',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to change user status.';

      setActionError(message);

      showToast(
        message,
        'error',
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6 p-8">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Users
          </h1>

          <p className="mt-1 text-gray-500">
            Manage user accounts, roles and system access
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormError('');
            setCreateOpen(true);
          }}
          className="rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white transition hover:bg-gray-800"
        >
          + Add User
        </button>
      </div>

      {/* =====================================================
          PAGE ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}

          <button
            type="button"
            onClick={() =>
              void loadData()
            }
            className="ml-2 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (
        <p className="text-gray-500">
          Loading users...
        </p>
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {!loading &&
        !error &&
        users.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
            No users found.
          </div>
        )}

      {/* =====================================================
          USERS TABLE
      ====================================================== */}

      {!loading &&
        !error &&
        users.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600">
                    <th className="px-6 py-4 font-medium">
                      Email
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Employee
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Role
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Created
                    </th>

                    <th className="px-4 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      {/* EMAIL */}

                      <td className="px-4 py-3 font-medium">
                        {user.email}
                      </td>

                      {/* LINKED EMPLOYEE */}

                      <td className="px-4 py-3 text-gray-600">
                        {user.employee
                          ? `${user.employee.employeeCode} — ${user.employee.firstName} ${user.employee.lastName}`
                          : '—'}
                      </td>

                      {/* ROLE */}

                      <td className="px-4 py-3">
                        {formatRole(
                          user.role.name,
                        )}
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3">
                        <span
                          className={
                            user.status ===
                            'ACTIVE'
                              ? 'rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'
                              : 'rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'
                          }
                        >
                          {user.status ===
                          'ACTIVE'
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </td>

                      {/* CREATED DATE */}

                      <td className="px-4 py-3 text-gray-500">
                        {new Date(
                          user.createdAt,
                        ).toLocaleString()}
                      </td>

                      {/* ACTIONS */}

                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {/*
                          All users can now be opened
                          in the Edit User modal.

                          Backend business rules still
                          determine whether a requested
                          role change is allowed.
                        */}

                        <button
                          type="button"
                          onClick={() => {
                            setFormError('');
                            setEditing(user);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActionError('');

                            setStatusTarget(
                              user,
                            );
                          }}
                          className={
                            user.status ===
                            'ACTIVE'
                              ? 'ml-3 text-red-600 hover:underline'
                              : 'ml-3 text-green-600 hover:underline'
                          }
                        >
                          {user.status ===
                          'ACTIVE'
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* =====================================================
          CREATE USER MODAL
      ====================================================== */}

      <Modal
        open={createOpen}
        title="Create User"
        onClose={() => {
          if (!saving) {
            setCreateOpen(false);
            setFormError('');
          }
        }}
      >
        <CreateUserForm
          roles={roles}
          employees={employees}
          saving={saving}
          error={formError}
          onSubmit={createUser}
          onCancel={() => {
            setCreateOpen(false);
            setFormError('');
          }}
        />
      </Modal>

      {/* =====================================================
          EDIT USER MODAL
      ====================================================== */}

      <Modal
        open={editing !== null}
        title="Edit User"
        onClose={() => {
          if (!saving) {
            setEditing(null);
            setFormError('');
          }
        }}
      >
        {editing && (
          <EditUserForm
            key={editing.id}
            user={editing}
            roles={roles}
            saving={saving}
            error={formError}
            onSubmit={async (
              input,
            ) => {
              const success =
                await updateUser(
                  editing.id,
                  input,
                );

              if (success) {
                setEditing(null);
              }

              return success;
            }}
            onCancel={() => {
              setEditing(null);
              setFormError('');
            }}
          />
        )}
      </Modal>

      {/* =====================================================
          ACTIVATE / DEACTIVATE CONFIRMATION
      ====================================================== */}

      <Modal
        open={statusTarget !== null}
        title={
          statusTarget?.status ===
          'ACTIVE'
            ? 'Deactivate User'
            : 'Activate User'
        }
        onClose={() => {
          if (!saving) {
            setStatusTarget(null);
            setActionError('');
          }
        }}
      >
        {statusTarget && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Are you sure you want to{' '}
              <strong>
                {statusTarget.status ===
                'ACTIVE'
                  ? 'deactivate'
                  : 'activate'}
              </strong>{' '}
              <strong>
                {statusTarget.email}
              </strong>
              ?
            </p>

            {/* DEACTIVATION WARNING */}

            {statusTarget.status ===
              'ACTIVE' && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                This user will no longer
                be able to sign in after
                deactivation.
              </div>
            )}

            {/* LINKED EMPLOYEE INFORMATION */}

            {statusTarget.employee && (
              <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                <p>
                  Linked employee:
                </p>

                <p className="mt-1 font-medium text-gray-800">
                  {
                    statusTarget.employee
                      .employeeCode
                  }{' '}
                  —{' '}
                  {
                    statusTarget.employee
                      .firstName
                  }{' '}
                  {
                    statusTarget.employee
                      .lastName
                  }
                </p>

                {statusTarget.status ===
                  'ACTIVE' && (
                  <p className="mt-2 text-xs">
                    The employee must
                    return all assigned
                    assets before the
                    account can be
                    deactivated.
                  </p>
                )}
              </div>
            )}

            {/* ACTION ERROR */}

            {actionError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {actionError}
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setStatusTarget(null);
                  setActionError('');
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  void changeStatus()
                }
                className={
                  statusTarget.status ===
                  'ACTIVE'
                    ? 'rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                    : 'rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
                }
              >
                {saving
                  ? 'Saving...'
                  : statusTarget.status ===
                      'ACTIVE'
                    ? 'Deactivate'
                    : 'Activate'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// =========================================================
// FORMAT ROLE NAME
// =========================================================

function formatRole(role: string) {
  return role
    .split('_')
    .map(
      (word) =>
        word.charAt(0) +
        word.slice(1).toLowerCase(),
    )
    .join(' ');
}