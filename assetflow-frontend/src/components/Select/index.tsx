import { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string | null;
}

export default function Select({
  label,
  options,
  placeholder,
  error,
  className = '',
  id,
  disabled,
  ...rest
}: SelectProps) {
  const selectId =
    id ??
    (label
      ? `select-${label
          .toLowerCase()
          .replace(/\s+/g, '-')}`
      : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <select
        id={selectId}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        {...rest}
        className={`
          ${label ? 'mt-1' : ''}
          w-full
          rounded-lg
          border
          bg-white
          px-3
          py-2.5
          text-sm
          text-gray-900
          outline-none
          transition
          focus:ring-2
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-500
          ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-gray-300 focus:border-gray-500 focus:ring-gray-100'
          }
          ${className}
        `}
      >
        {placeholder !== undefined && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}