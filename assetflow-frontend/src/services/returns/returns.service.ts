import { apiClient } from '@/libs/api/api-client';
import { Assignment } from '@/types/assignment.types';
import { CreateReturnInput } from '@/types/return.types';

export const returnsService = {
  create: (input: CreateReturnInput) =>
    apiClient.post<Assignment>('/returns', input),
};