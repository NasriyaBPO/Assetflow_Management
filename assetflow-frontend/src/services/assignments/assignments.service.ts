import { apiClient } from '@/libs/api/api-client';
import {
  Assignment,
  AssignmentQuery,
  CreateAssignmentInput,
} from '@/types/assignment.types';
import { Paginated } from '@/types/common.types';

export const assignmentsService = {
  list: (
    query: AssignmentQuery,
    signal?: AbortSignal,
  ) =>
    apiClient.get<Paginated<Assignment>>(
      '/assignments',
      query,
      signal,
    ),

  create: (input: CreateAssignmentInput) =>
    apiClient.post<Assignment>(
      '/assignments',
      input,
    ),
};