'use client';

import {
  ReactNode,
  useState,
} from 'react';

import { usePathname } from 'next/navigation';

import Header from '../Header';
import Sidebar from '../Sidebar';

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() =>
          setMobileSidebarOpen(false)
        }
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          onMenuClick={() =>
            setMobileSidebarOpen(true)
          }
        />

        <main className="min-h-[calc(100vh-65px)]">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}