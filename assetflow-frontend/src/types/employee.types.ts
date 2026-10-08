export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string | null;
  designation: string | null;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;

  _count?: {
    assignments: number;
  };
}

export interface EmployeeQuery
  extends Record<string, string | number | boolean | undefined | null> {
  page?: number;
  limit?: number;
  search?: string;
  status?: EmployeeStatus;
  department?: string;
}

export interface CreateEmployeeInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  designation?: string;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  designation?: string;
  status?: EmployeeStatus;
}