import { apiClient } from '@/libs/api/api-client';

import {
  CreateUserInput,
  UpdateUserInput,
  User,
} from '@/types/user.types';

export const usersService = {
  list: () =>
    apiClient.get<User[]>('/users'),

  create: (input: CreateUserInput) =>
    apiClient.post<User>('/users', input),

  update: (
    id: string,
    input: UpdateUserInput,
  ) =>
    apiClient.patch<User>(
      `/users/${id}`,
      input,
    ),
};