import { InputHTMLAttributes } from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
}

export default function Input({
  label,
  error,
  className = '',
  id,
  disabled,
  ...rest
}: InputProps) {
  const inputId =
    id ??
    `input-${label
      .toLowerCase()
      .replace(/\s+/g, '-')}`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={inputId}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        {...rest}
        className={`
          mt-1
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
          placeholder:text-gray-400
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
      />

      {error && (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}