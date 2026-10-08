'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (
    message: string,
    type?: ToastType,
  ) => void;
}

const ToastContext =
  createContext<ToastContextValue | undefined>(
    undefined,
  );

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>(
    [],
  );

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = 'success',
    ) => {
      const id = Date.now();

      setToasts((current) => [
        ...current,
        {
          id,
          message,
          type,
        },
      ]);

      window.setTimeout(() => {
        setToasts((current) =>
          current.filter(
            (toast) => toast.id !== id,
          ),
        );
      }, 3000);
    },
    [],
  );

  function removeToast(id: number) {
    setToasts((current) =>
      current.filter(
        (toast) => toast.id !== id,
      ),
    );
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      {/* Toast container */}
      <div className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              toast.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-lg">
                {toast.type === 'success'
                  ? '✓'
                  : '✕'}
              </span>

              <p className="text-sm font-medium">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                removeToast(toast.id)
              }
              aria-label="Close notification"
              className="text-lg leading-none opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      'useToast must be used inside ToastProvider',
    );
  }

  return context;
}