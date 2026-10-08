'use client';

import {
  FormEvent,
  useState,
} from 'react';

import { Assignment } from '@/types/assignment.types';

import {
  CreateReturnInput,
  ReturnCondition,
} from '@/types/return.types';

interface CreateReturnFormProps {
  assignment: Assignment;

  onSubmit: (
    input: CreateReturnInput,
  ) => Promise<void>;

  onCancel: () => void;
}

export default function CreateReturnForm({
  assignment,
  onSubmit,
  onCancel,
}: CreateReturnFormProps) {
  const [condition, setCondition] =
    useState<ReturnCondition>('GOOD');

  const [notes, setNotes] =
    useState('');

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await onSubmit({
        assignmentId: assignment.id,
        condition,
        notes:
          notes.trim() || undefined,
      });

      onCancel();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to return asset.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Information message */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="text-sm text-blue-700">
          Confirm the returned asset and
          record its current condition.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Asset and Employee Information */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Asset */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <AssetIcon />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Asset
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {assignment.asset.assetCode}
              </p>

              <p className="mt-0.5 text-sm text-gray-500">
                {assignment.asset.name}
              </p>
            </div>
          </div>
        </div>

        {/* Employee */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
              <EmployeeIcon />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Employee
              </p>

              <p className="mt-1 truncate font-semibold text-gray-900">
                {assignment.employee.firstName}{' '}
                {assignment.employee.lastName}
              </p>

              <p className="mt-0.5 text-sm text-gray-500">
                {
                  assignment.employee
                    .employeeCode
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Information */}
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Assigned Date
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {new Date(
            assignment.assignedAt,
          ).toLocaleString()}
        </p>
      </div>

      {/* Return Condition */}
      <div>
        <label
          htmlFor="return-condition"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Return Condition
          <span className="ml-1 text-red-500">
            *
          </span>
        </label>

        <select
          id="return-condition"
          value={condition}
          onChange={(event) =>
            setCondition(
              event.target
                .value as ReturnCondition,
            )
          }
          disabled={isSubmitting}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="NEW">
            New — No visible usage or damage
          </option>

          <option value="GOOD">
            Good — Normal working condition
          </option>

          <option value="FAIR">
            Fair — Visible wear but still usable
          </option>

          <option value="DAMAGED">
            Damaged — Requires repair or
            inspection
          </option>
        </select>

        <p className="mt-2 text-xs text-gray-500">
          The selected condition will be
          recorded when the asset is returned.
        </p>
      </div>

      {/* Condition Warning */}
      {condition === 'DAMAGED' && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start gap-2">
            <WarningIcon />

            <div>
              <p className="text-sm font-medium text-amber-800">
                Damaged asset
              </p>

              <p className="mt-0.5 text-xs text-amber-700">
                Add a note describing the
                damage so it can be inspected
                or repaired.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Return Notes */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="return-notes"
            className="text-sm font-medium text-gray-700"
          >
            Return Notes
          </label>

          <span className="text-xs text-gray-400">
            {notes.length}/500
          </span>
        </div>

        <textarea
          id="return-notes"
          value={notes}
          onChange={(event) =>
            setNotes(event.target.value)
          }
          rows={4}
          maxLength={500}
          disabled={isSubmitting}
          placeholder={
            condition === 'DAMAGED'
              ? 'Describe the damage or issue...'
              : 'Add optional notes about the returned asset...'
          }
          className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      {/* Return Summary */}
      <div className="rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Return condition
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              This information will be saved
              with the return.
            </p>
          </div>

          <ConditionBadge
            condition={condition}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-[140px] items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner />

              <span className="ml-2">
                Processing...
              </span>
            </>
          ) : (
            'Confirm Return'
          )}
        </button>
      </div>
    </form>
  );
}

/* =========================================================
   CONDITION BADGE
   ========================================================= */

function ConditionBadge({
  condition,
}: {
  condition: ReturnCondition;
}) {
  const styles: Record<
    ReturnCondition,
    string
  > = {
    NEW:
      'bg-blue-50 text-blue-700',

    GOOD:
      'bg-emerald-50 text-emerald-700',

    FAIR:
      'bg-amber-50 text-amber-700',

    DAMAGED:
      'bg-red-50 text-red-700',
  };

  const labels: Record<
    ReturnCondition,
    string
  > = {
    NEW: 'New',
    GOOD: 'Good',
    FAIR: 'Fair',
    DAMAGED: 'Damaged',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[condition]}`}
    >
      {labels[condition]}
    </span>
  );
}

/* =========================================================
   ICONS
   ========================================================= */

function AssetIcon() {
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
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />

      <path d="m3.3 7 8.7 5 8.7-5" />

      <path d="M12 22V12" />
    </svg>
  );
}

function EmployeeIcon() {
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
      <path d="M20 21a8 8 0 0 0-16 0" />

      <circle
        cx="12"
        cy="7"
        r="4"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      className="mt-0.5 shrink-0 text-amber-600"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />

      <path d="M12 9v4" />

      <path d="M12 17h.01" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}