import { apiClient } from '@/libs/api/api-client';

import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/category.types';

export const categoriesService = {
  list: () =>
    apiClient.get<Category[]>(
      '/categories',
    ),

  create: (input: CreateCategoryInput) =>
    apiClient.post<Category>(
      '/categories',
      input,
    ),

  update: (
    id: string,
    input: UpdateCategoryInput,
  ) =>
    apiClient.patch<Category>(
      `/categories/${id}`,
      input,
    ),

  remove: (id: string) =>
    apiClient.delete<{
      message: string;
    }>(`/categories/${id}`),
};