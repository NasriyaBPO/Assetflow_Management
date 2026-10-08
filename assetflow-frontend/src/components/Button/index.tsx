import { ButtonHTMLAttributes } from 'react';

type Variant =
  | 'primary'
  | 'secondary'
  | 'danger';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const styles: Record<Variant, string> = {
  primary:
    'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-400',

  secondary:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-300',

  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300',
};

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled =
    disabled || loading;

  return (
    <button
      {...rest}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        px-4
        py-2.5
        text-sm
        font-medium
        transition
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${styles[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />

          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}