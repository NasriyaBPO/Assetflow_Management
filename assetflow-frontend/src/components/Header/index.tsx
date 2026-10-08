'use client';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useAuth } from '@/contexts/AuthContext';

import {
  Notification,
  notificationService,
} from '@/services/notification/notificationService';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const { user } = useAuth();

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [
    isNotificationOpen,
    setIsNotificationOpen,
  ] = useState(false);

  // Notification shown temporarily as popup
  const [
    popupNotification,
    setPopupNotification,
  ] = useState<Notification | null>(null);

  const notificationRef =
    useRef<HTMLDivElement>(null);

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setPopupNotification(null);
      return;
    }

    const loadNotifications = async () => {
      try {
        const data =
          await notificationService.getAll();

        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);

        // Find the newest unread notification.
        const newestUnread =
          data.notifications.find(
            (notification) =>
              !notification.isRead,
          );

        if (newestUnread) {
          setPopupNotification(newestUnread);
        }
      } catch (error) {
        console.error(
          'Failed to load notifications:',
          error,
        );
      }
    };

    void loadNotifications();
  }, [user]);

  // =========================================================
  // AUTO HIDE POPUP AFTER 5 SECONDS
  // =========================================================
  useEffect(() => {
    if (!popupNotification) {
      return;
    }

    const timer = window.setTimeout(() => {
      setPopupNotification(null);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [popupNotification]);

  // =========================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent,
    ) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  // =========================================================
  // OPEN / CLOSE NOTIFICATION DROPDOWN
  // =========================================================
  const handleNotificationClick = async () => {
    const willOpen = !isNotificationOpen;

    setIsNotificationOpen(willOpen);

    // Do nothing when closing.
    if (!willOpen) {
      return;
    }

    // Hide popup because user is opening
    // the full notification panel.
    setPopupNotification(null);

    // Mark unread notifications as read only
    // when the user opens the bell.
    if (unreadCount > 0) {
      try {
        await notificationService.markAllAsRead();

        const readAt =
          new Date().toISOString();

        setNotifications((current) =>
          current.map((notification) => {
            if (notification.isRead) {
              return notification;
            }

            return {
              ...notification,
              isRead: true,
              readAt,
            };
          }),
        );

        setUnreadCount(0);
      } catch (error) {
        console.error(
          'Failed to mark notifications as read:',
          error,
        );
      }
    }
  };

  // =========================================================
  // CLOSE POPUP MANUALLY
  // =========================================================
  const closePopup = () => {
    setPopupNotification(null);

    // IMPORTANT:
    // We do NOT call markAllAsRead() here.
    // Closing the popup does not mark it as read.
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
          >
            <MenuIcon />
          </button>

          {/* Application Name */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-700">
              Employee Asset &amp; Inventory
              Management
            </p>
          </div>

          {/* Notification Bell */}
          {user && (
            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={handleNotificationClick}
                aria-label="Notifications"
                aria-expanded={
                  isNotificationOpen
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
              >
                <BellIcon />

                {/* Unread Count */}
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 99
                      ? '99+'
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                  {/* Dropdown Header */}
                  <div className="border-b border-slate-100 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-sm font-semibold text-slate-800">
                        Notifications
                      </h2>

                      <span className="text-xs text-slate-400">
                        {notifications.length}{' '}
                        recent
                      </span>
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length ===
                    0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-slate-500">
                          No notifications
                          yet.
                        </p>
                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <div
                            key={
                              notification.id
                            }
                            className={`border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                              notification.isRead
                                ? 'bg-white'
                                : 'bg-blue-50/60'
                            }`}
                          >
                            <div className="flex gap-3">
                              {/* Read Status Dot */}
                              <div className="pt-1.5">
                                <span
                                  className={`block h-2 w-2 rounded-full ${
                                    notification.isRead
                                      ? 'bg-slate-300'
                                      : 'bg-blue-500'
                                  }`}
                                />
                              </div>

                              {/* Notification Content */}
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-sm text-slate-800 ${
                                    notification.isRead
                                      ? 'font-medium'
                                      : 'font-semibold'
                                  }`}
                                >
                                  {
                                    notification.title
                                  }
                                </p>

                                <p className="mt-1 text-sm leading-5 text-slate-600">
                                  {
                                    notification.message
                                  }
                                </p>

                                <p className="mt-2 text-xs text-slate-400">
                                  {formatNotificationDate(
                                    notification.createdAt,
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        ),
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current User */}
          {user && (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="max-w-48 truncate text-sm font-medium text-slate-700">
                  {user.email}
                </p>

                <p className="text-xs text-slate-400">
                  {formatRole(user.role)}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                {user.email
                  .charAt(0)
                  .toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          TEMPORARY NOTIFICATION POPUP
          ===================================================== */}
      {popupNotification && (
        <div className="fixed right-4 top-20 z-[100] w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-right rounded-xl border border-blue-200 bg-white shadow-xl">
          <div className="flex gap-3 p-4">
            {/* Notification Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <BellIcon />
            </div>

            {/* Notification Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">
                {popupNotification.title}
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-600">
                {popupNotification.message}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                {formatNotificationDate(
                  popupNotification.createdAt,
                )}
              </p>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closePopup}
              aria-label="Close notification"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <CloseIcon />
            </button>
          </div>

          {/* 5-second visual progress bar */}
          <div className="h-1 overflow-hidden rounded-b-xl bg-slate-100">
            <div className="h-full w-full origin-left animate-[notification-progress_5s_linear_forwards] bg-blue-500" />
          </div>
        </div>
      )}
    </>
  );
}

function formatRole(role: string) {
  if (role === 'ADMIN') {
    return 'Administrator';
  }

  if (role === 'ASSET_MANAGER') {
    return 'Asset Manager';
  }

  if (role === 'EMPLOYEE') {
    return 'Employee';
  }

  return role;
}

function formatNotificationDate(
  value: string,
) {
  const date = new Date(value);

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}