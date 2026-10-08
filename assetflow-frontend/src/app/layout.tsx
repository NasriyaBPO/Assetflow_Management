import type { Metadata } from 'next';
import { ReactNode } from 'react';
import './globals.css';

import AppShell from '@/components/AppShell';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

export const metadata: Metadata = {
  title: 'AssetFlow',
  description:
    'Employee Asset & Inventory Management',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>
          <ToastProvider>
            <AppShell>
              {children}
            </AppShell>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}