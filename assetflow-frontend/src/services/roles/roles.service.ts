import { apiClient } from '@/libs/api/api-client';
import { Role } from '@/types/user.types';

export const rolesService = {
  list: () =>
    apiClient.get<Role[]>('/roles'),
};