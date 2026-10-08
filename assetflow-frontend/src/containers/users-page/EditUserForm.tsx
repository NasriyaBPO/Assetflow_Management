'use client';

import {
  FormEvent,
  useState,
} from 'react';

import {
  Role,
  UpdateUserInput,
  User,
} from '@/types/user.types';

interface Props {
  user: User;
  roles: Role[];
  saving: boolean;
  error: string;

  onSubmit: (
    input: UpdateUserInput,
  ) => Promise<boolean>;

  onCancel: () => void;
}

export default function EditUserForm({
  user,
  roles,
  saving,
  error,
  onSubmit,
  onCancel,
}: Props) {
  // --------------------------------------------------
  // FORM STATE
  // --------------------------------------------------

  const [email, setEmail] =
    useState(user.email);

  const [roleId, setRoleId] =
    useState(user.role.id);

  const [info, setInfo] =
    useState('');

  // If the User is linked to an Employee,
  // the email must remain synchronized with
  // the Employee record.
  const linkedEmployee =
    Boolean(user.employee);

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    // Remove previous information message.
    setInfo('');

    const currentEmail =
      email.trim();

    const originalEmail =
      user.email.trim();

    const currentRoleId =
      roleId;

    const originalRoleId =
      user.role.id;

    // ------------------------------------------------
    // CHECK WHAT CHANGED
    // ------------------------------------------------

    const emailChanged =
      currentEmail !== originalEmail;

    const roleChanged =
      currentRoleId !== originalRoleId;

    // ------------------------------------------------
    // NOTHING CHANGED
    // ------------------------------------------------

    if (
      !emailChanged &&
      !roleChanged
    ) {
      setInfo(
        'No changes to save.',
      );

      return;
    }

    // ------------------------------------------------
    // BUILD UPDATE OBJECT
    //
    // Only send fields that actually changed.
    // ------------------------------------------------

    const input: UpdateUserInput = {};

    if (emailChanged) {
      input.email =
        currentEmail;
    }

    if (roleChanged) {
      input.roleId =
        currentRoleId;
    }

    // ------------------------------------------------
    // CALL PARENT UPDATE FUNCTION
    // ------------------------------------------------

    await onSubmit(input);
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* BACKEND / API ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* LINKED EMPLOYEE INFORMATION */}

      {user.employee && (
        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <p className="font-medium">
            Linked employee
          </p>

          <p className="mt-1 text-gray-600">
            {
              user.employee
                .employeeCode
            }{' '}
            —{' '}
            {
              user.employee
                .firstName
            }{' '}
            {
              user.employee
                .lastName
            }
          </p>
        </div>
      )}

      {/* EMAIL */}

      <div>
        <label
          htmlFor="edit-user-email"
          className="mb-1 block text-sm font-medium"
        >
          Email
        </label>

        <input
          id="edit-user-email"
          type="email"
          required
          value={email}
          onChange={(event) => {
            setEmail(
              event.target.value,
            );

            setInfo('');
          }}
          disabled={linkedEmployee}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
        />

        {linkedEmployee && (
          <p className="mt-1 text-xs text-gray-500">
            Change the employee email from
            the Employees page so both records
            remain synchronized.
          </p>
        )}
      </div>

      {/* ROLE */}

      <div>
        <label
          htmlFor="edit-user-role"
          className="mb-1 block text-sm font-medium"
        >
          Role
        </label>

        <select
          id="edit-user-role"
          required
          value={roleId}
          onChange={(event) => {
            setRoleId(
              event.target.value,
            );

            setInfo('');
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          {roles.map((role) => (
            <option
              key={role.id}
              value={role.id}
            >
              {formatRole(
                role.name,
              )}
            </option>
          ))}
        </select>

        {linkedEmployee && (
          <p className="mt-1 text-xs text-gray-500">
            Changing the role updates this
            employee&apos;s system access without
            removing the linked employee record.
          </p>
        )}
      </div>

      {/* NO CHANGES INFORMATION */}

      {info && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
          {info}
        </div>
      )}

      {/* ACTIONS */}

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            saving ||
            !email.trim() ||
            !roleId
          }
          className="rounded-lg bg-gray-900 px-4 py-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? 'Saving...'
            : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

// --------------------------------------------------
// FORMAT ROLE
// --------------------------------------------------

function formatRole(
  role: string,
) {
  return role
    .split('_')
    .map(
      (word) =>
        word.charAt(0) +
        word
          .slice(1)
          .toLowerCase(),
    )
    .join(' ');
}