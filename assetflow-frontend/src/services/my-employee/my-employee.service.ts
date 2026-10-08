import { apiClient } from '@/libs/api/api-client';

import {
  MyAssetsResponse,
  MyEmployeeProfile,
} from '@/types/my-employee.types';

export const myEmployeeService = {
  getProfile: () =>
    apiClient.get<MyEmployeeProfile>(
      '/employees/me',
    ),

  getAssets: () =>
    apiClient.get<MyAssetsResponse>(
      '/employees/me/assets',
    ),
};