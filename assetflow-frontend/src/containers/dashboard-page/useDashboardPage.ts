'use client';

import { useEffect, useState } from 'react';

import { dashboardService } from '@/services/dashboard/dashboard.service';
import { DashboardSummary } from '@/types/dashboard.types';

export function useDashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError('');

        const summary = await dashboardService.getSummary(
          controller.signal,
        );

        setData(summary);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to load dashboard.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    data,
    isLoading,
    error,
  };
}