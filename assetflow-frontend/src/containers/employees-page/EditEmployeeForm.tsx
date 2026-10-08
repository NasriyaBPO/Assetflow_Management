'use client';

import {
  FormEvent,
  useState,
} from 'react';

import {
  Employee,
  EmployeeStatus,
  UpdateEmployeeInput,
} from '@/types/employee.types';

interface Props {
  employee: Employee;

  onSubmit: (
    id: string,
    input: UpdateEmployeeInput,
  ) => Promise<void>;

  onCancel: () => void;
}

export default function EditEmployeeForm({
  employee,
  onSubmit,
  onCancel,
}: Props) {
  // --------------------------------------------------
  // Form state
  // --------------------------------------------------

  const [firstName, setFirstName] =
    useState(employee.firstName);

  const [lastName, setLastName] =
    useState(employee.lastName);

  const [email, setEmail] =
    useState(employee.email);

  const [department, setDepartment] =
    useState(
      employee.department ?? '',
    );

  const [designation, setDesignation] =
    useState(
      employee.designation ?? '',
    );

  const [status, setStatus] =
    useState<EmployeeStatus>(
      employee.status,
    );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [info, setInfo] =
    useState('');

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setInfo('');

    // Clean current form values
    const currentValues = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      department: department.trim(),
      designation: designation.trim(),
      status,
    };

    // Original employee values
    const originalValues = {
      firstName:
        employee.firstName.trim(),

      lastName:
        employee.lastName.trim(),

      email:
        employee.email.trim(),

      department:
        employee.department?.trim() ??
        '',

      designation:
        employee.designation?.trim() ??
        '',

      status:
        employee.status,
    };

    // --------------------------------------------------
    // Check whether anything changed
    // --------------------------------------------------

    const hasChanges =
      currentValues.firstName !==
        originalValues.firstName ||
      currentValues.lastName !==
        originalValues.lastName ||
      currentValues.email !==
        originalValues.email ||
      currentValues.department !==
        originalValues.department ||
      currentValues.designation !==
        originalValues.designation ||
      currentValues.status !==
        originalValues.status;

    // --------------------------------------------------
    // Nothing changed
    // --------------------------------------------------

    if (!hasChanges) {
      setInfo('No changes to save.');

      return;
    }

    // --------------------------------------------------
    // Update employee
    // --------------------------------------------------

    try {
      setIsSubmitting(true);

      const input: UpdateEmployeeInput = {
        firstName:
          currentValues.firstName,

        lastName:
          currentValues.lastName,

        email:
          currentValues.email,

        department:
          currentValues.department,

        designation:
          currentValues.designation,

        status:
          currentValues.status,
      };

      await onSubmit(
        employee.id,
        input,
      );

      // Close only after successful update
      onCancel();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to update employee.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* API Error */}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Employee Code */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Employee Code
        </label>

        <input
          value={employee.employeeCode}
          disabled
          className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500"
        />
      </div>

      {/* Name */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            First Name
          </label>

          <input
            value={firstName}
            onChange={(event) => {
              setFirstName(
                event.target.value,
              );

              setInfo('');
            }}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Last Name
          </label>

          <input
            value={lastName}
            onChange={(event) => {
              setLastName(
                event.target.value,
              );

              setInfo('');
            }}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      {/* Email */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(
              event.target.value,
            );

            setInfo('');
          }}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Department */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Department
        </label>

        <input
          value={department}
          onChange={(event) => {
            setDepartment(
              event.target.value,
            );

            setInfo('');
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Designation */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Designation
        </label>

        <input
          value={designation}
          onChange={(event) => {
            setDesignation(
              event.target.value,
            );

            setInfo('');
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      {/* Status */}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Status
        </label>

        <select
          value={status}
          onChange={(event) => {
            setStatus(
              event.target
                .value as EmployeeStatus,
            );

            setInfo('');
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>
      </div>

      {/* No changes information */}

      {info && (
        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          {info}
        </div>
      )}

      {/* Buttons */}

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border px-4 py-2 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}