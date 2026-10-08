import { apiClient } from '@/libs/api/api-client';
import { DashboardSummary } from '@/types/dashboard.types';

export const dashboardService = {
  getSummary: (signal?: AbortSignal) =>
    apiClient.get<DashboardSummary>(
      '/dashboard/summary',
      undefined,
      signal,
    ),
};