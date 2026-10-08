export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type UserRoleName =
  | 'ADMIN'
  | 'ASSET_MANAGER'
  | 'EMPLOYEE';

export interface Role {
  id: string;
  name: UserRoleName;
  description: string | null;
}

export interface LinkedEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  status: UserStatus;
  role: Role;
  employee?: LinkedEmployee | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  roleId: string;
  employeeId?: string;
}

export interface UpdateUserInput {
  email?: string;
  roleId?: string;
  status?: UserStatus;
}