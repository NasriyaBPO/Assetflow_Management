'use client';

import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  CreateUserInput,
  Role,
} from '@/types/user.types';

import { Employee } from '@/types/employee.types';

interface Props {
  roles: Role[];
  employees: Employee[];
  saving: boolean;
  error: string;

  onSubmit: (
    input: CreateUserInput,
  ) => Promise<void>;

  onCancel: () => void;
}

export default function CreateUserForm({
  roles,
  employees,
  saving,
  error,
  onSubmit,
  onCancel,
}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');
  const [roleId, setRoleId] =
    useState('');
  const [employeeId, setEmployeeId] =
    useState('');

  const selectedRole = roles.find(
    (role) => role.id === roleId,
  );

  const isEmployeeRole =
    selectedRole?.name === 'EMPLOYEE';

  /*
   * When ADMIN selects an employee, automatically
   * use that employee's email.
   *
   * This helps satisfy the backend rule:
   * User email === Employee email.
   */
  useEffect(() => {
    if (!isEmployeeRole || !employeeId) {
      return;
    }

    const employee = employees.find(
      (item) => item.id === employeeId,
    );

    if (employee) {
      setEmail(employee.email);
    }
  }, [
    employeeId,
    employees,
    isEmployeeRole,
  ]);

  function handleRoleChange(
    newRoleId: string,
  ) {
    setRoleId(newRoleId);

    const role = roles.find(
      (item) => item.id === newRoleId,
    );

    if (role?.name !== 'EMPLOYEE') {
      setEmployeeId('');
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const input: CreateUserInput = {
      email: email.trim(),
      password,
      roleId,
    };

    if (isEmployeeRole) {
      input.employeeId = employeeId;
    }

    await onSubmit(input);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="role"
          className="mb-1 block text-sm font-medium"
        >
          Role
        </label>

        <select
          id="role"
          required
          value={roleId}
          onChange={(event) =>
            handleRoleChange(
              event.target.value,
            )
          }
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">
            Select a role
          </option>

          {roles.map((role) => (
            <option
              key={role.id}
              value={role.id}
            >
              {formatRole(role.name)}
            </option>
          ))}
        </select>
      </div>

      {isEmployeeRole && (
        <div>
          <label
            htmlFor="employee"
            className="mb-1 block text-sm font-medium"
          >
            Employee
          </label>

          <select
            id="employee"
            required
            value={employeeId}
            onChange={(event) =>
              setEmployeeId(
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="">
              Select an employee
            </option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.employeeCode}
                {' - '}
                {employee.firstName}{' '}
                {employee.lastName}
                {' - '}
                {employee.email}
              </option>
            ))}
          </select>

          <p className="mt-1 text-xs text-gray-500">
            Select the employee who will use
            this login account.
          </p>
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          readOnly={isEmployeeRole}
          placeholder="user@company.com"
          className={`w-full rounded-lg border border-gray-300 px-3 py-2 ${
            isEmployeeRole
              ? 'bg-gray-100 text-gray-600'
              : ''
          }`}
        />

        {isEmployeeRole && (
          <p className="mt-1 text-xs text-gray-500">
            Employee email is selected
            automatically.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Minimum 8 characters"
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />

        <p className="mt-1 text-xs text-gray-500">
          Password must contain at least
          8 characters.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            !email.trim() ||
            password.length < 8 ||
            !roleId ||
            (isEmployeeRole &&
              !employeeId)
          }
          className="rounded-lg bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? 'Creating...'
            : 'Create User'}
        </button>
      </div>
    </form>
  );
}

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