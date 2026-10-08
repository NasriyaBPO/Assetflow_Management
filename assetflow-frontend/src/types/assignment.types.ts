export type AssignmentStatus = 'ACTIVE' | 'RETURNED';

export interface AssignmentAsset {
  id: string;
  assetCode: string;
  name: string;
  status: string;
  serialNumber?: string | null;
}

export interface AssignmentEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface Assignment {
  id: string;
  assetId: string;
  employeeId: string;
  assignedAt: string;
  returnedAt: string | null;
  assignedBy: string | null;
  returnCondition: string | null;
  notes: string | null;
  returnNotes: string | null;
  status: AssignmentStatus;

  asset: AssignmentAsset;
  employee: AssignmentEmployee;
}

export interface AssignmentQuery
  extends Record<
    string,
    string | number | boolean | undefined | null
  > {
  page?: number;
  limit?: number;
  status?: AssignmentStatus;
  employeeId?: string;
  assetId?: string;
}

export interface CreateAssignmentInput {
  assetId: string;
  employeeId: string;
  assignedAt?: string;
  notes?: string;
}