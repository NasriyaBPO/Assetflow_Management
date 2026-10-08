export type ReturnCondition =
  | 'NEW'
  | 'GOOD'
  | 'FAIR'
  | 'DAMAGED';

export interface CreateReturnInput {
  assignmentId: string;
  returnedAt?: string;
  condition: ReturnCondition;
  notes?: string;
}