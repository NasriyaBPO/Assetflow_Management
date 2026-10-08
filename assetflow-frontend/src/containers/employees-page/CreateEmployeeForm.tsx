'use client';

import { FormEvent, useState } from 'react';
import { CreateEmployeeInput } from '@/types/employee.types';

interface Props {
  onSubmit: (input: CreateEmployeeInput) => Promise<void>;
  onCancel: () => void;
}

export default function CreateEmployeeForm({
  onSubmit,
  onCancel,
}: Props) {
  const [employeeCode, setEmployeeCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await onSubmit({
        employeeCode,
        firstName,
        lastName,
        email,
        department: department || undefined,
        designation: designation || undefined,
      });

      onCancel();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create employee.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">
          Employee Code
        </label>
        <input
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          placeholder="EMP-003"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            First Name
          </label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Department
        </label>
        <input
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Designation
        </label>
        <input
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Employee'}
        </button>
      </div>
    </form>
  );
}