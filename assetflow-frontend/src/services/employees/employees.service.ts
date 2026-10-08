import { apiClient } from '@/libs/api/api-client';
import {
  CreateEmployeeInput,
  Employee,
  EmployeeQuery,
  UpdateEmployeeInput,
} from '@/types/employee.types';

import {
  EmployeeSelfProfile,
  EmployeeMyAssetsResponse,
} from '@/types/employee-self.types';

import { Paginated } from '@/types/common.types';

export const employeesService = {
  list: (query: EmployeeQuery, signal?: AbortSignal) =>
    apiClient.get<Paginated<Employee>>(
      '/employees',
      query,
      signal,
    ),

getMe: () =>
  apiClient.get<EmployeeSelfProfile>(
    '/employees/me',
  ),

getMyAssets: () =>
  apiClient.get<EmployeeMyAssetsResponse>(
    '/employees/me/assets',
  ),

  get: (id: string) =>
    apiClient.get<Employee>(`/employees/${id}`),

  create: (input: CreateEmployeeInput) =>
    apiClient.post<Employee>('/employees', input),

  update: (id: string, input: UpdateEmployeeInput) =>
    apiClient.patch<Employee>(
      `/employees/${id}`,
      input,
    ),
};