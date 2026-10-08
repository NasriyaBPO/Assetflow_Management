'use client';

import {
  ReactNode,
  useEffect,
} from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({
  open,
  title,
  onClose,
  children,
}: ModalProps) {
  // Close modal when Escape is pressed
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    // Prevent page scrolling behind modal
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-black/40
        p-4
        backdrop-blur-[1px]
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[calc(100vh-2rem)]
          w-full
          max-w-xl
          flex-col
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-xl
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-xl
              text-gray-400
              transition
              hover:bg-gray-100
              hover:text-gray-700
              focus:outline-none
              focus:ring-2
              focus:ring-gray-200
            "
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}