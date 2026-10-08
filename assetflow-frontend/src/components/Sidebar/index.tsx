'use client';

import Link from 'next/link';

import {
  usePathname,
} from 'next/navigation';

import {
  useAuth,
} from '@/contexts/AuthContext';

import {
  RoleName,
} from '@/types/auth.types';

interface NavItem {
  href: string;
  label: string;
  roles: RoleName[];
  icon: React.ReactNode;
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    roles: [
      'ADMIN',
      'ASSET_MANAGER',
      'EMPLOYEE',
    ],
    icon: <DashboardIcon />,
  },

  {
    href: '/my-assets',
    label: 'My Assets',
    roles: ['EMPLOYEE'],
    icon: <AssetsIcon />,
  },

  {
    href: '/assets',
    label: 'Assets',
    roles: [
      'ADMIN',
      'ASSET_MANAGER',
    ],
    icon: <AssetsIcon />,
  },

  {
    href: '/categories',
    label: 'Categories',
    roles: [
      'ADMIN',
      'ASSET_MANAGER',
    ],
    icon: <CategoryIcon />,
  },

  {
    href: '/employees',
    label: 'Employees',
    roles: [
      'ADMIN',
      'ASSET_MANAGER',
    ],
    icon: <EmployeesIcon />,
  },

  {
    href: '/assignments',
    label: 'Assignments',
    roles: [
      'ADMIN',
      'ASSET_MANAGER',
    ],
    icon: <AssignmentIcon />,
  },

  {
    href: '/returns',
    label: 'Returns',
    roles: [
      'ADMIN',
      'ASSET_MANAGER',
    ],
    icon: <ReturnIcon />,
  },

  {
    href: '/users',
    label: 'Users',
    roles: ['ADMIN'],
    icon: <UsersIcon />,
  },
];

export default function Sidebar({
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  const {
    user,
    loading,
    logout,
  } = useAuth();

  if (pathname === '/login') {
    return null;
  }

  if (!loading && !user) {
    return null;
  }

  const visibleItems =
    NAV_ITEMS.filter((item) =>
      user
        ? item.roles.includes(user.role)
        : false,
    );

  return (
    <>
      {/* Mobile overlay */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-200
          lg:translate-x-0
          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* Logo */}

        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm">
              AF
            </div>

            <div>
              <p className="text-base font-bold leading-none tracking-tight text-slate-900">
                AssetFlow
              </p>

              <p className="mt-1 text-[11px] font-medium text-slate-400">
                Asset Management
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Navigation
            </p>

            {loading ? (
              <div className="space-y-2 px-2 pt-2">
                {[1, 2, 3, 4].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-10 animate-pulse rounded-lg bg-slate-100"
                    />
                  ),
                )}
              </div>
            ) : (
              <nav className="space-y-1">
                {visibleItems.map(
                  (item) => {
                    const active =
                      pathname ===
                        item.href ||
                      pathname.startsWith(
                        `${item.href}/`,
                      );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={
                          onMobileClose
                        }
                        className={`
                          group flex items-center gap-3
                          rounded-lg px-3 py-2.5
                          text-sm font-medium
                          transition-colors
                          ${
                            active
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }
                        `}
                      >
                        <span
                          className={
                            active
                              ? 'text-blue-600'
                              : 'text-slate-400 group-hover:text-slate-600'
                          }
                        >
                          {item.icon}
                        </span>

                        <span>
                          {item.label}
                        </span>

                        {active && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />
                        )}
                      </Link>
                    );
                  },
                )}
              </nav>
            )}
          </div>

          {/* User section */}

          {user && (
            <div className="border-t border-slate-100 p-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {getInitial(
                      user.email,
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {user.email}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatRole(
                        user.role,
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  <LogoutIcon />

                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function getInitial(
  email: string,
) {
  return (
    email
      .charAt(0)
      .toUpperCase() || 'U'
  );
}

function formatRole(
  role: RoleName,
) {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';

    case 'ASSET_MANAGER':
      return 'Asset Manager';

    case 'EMPLOYEE':
      return 'Employee';

    default:
      return role;
  }
}

/* =========================================================
   ICONS
   ========================================================= */

function DashboardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
      />
    </svg>
  );
}

function AssetsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
      />
    </svg>
  );
}

function EmployeesIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle
        cx="9"
        cy="7"
        r="4"
      />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AssignmentIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
      />
      <path d="M9 3v4h6V3" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 14 4 9l5-5" />
      <path d="M4 9h10a6 6 0 0 1 6 6v5" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}