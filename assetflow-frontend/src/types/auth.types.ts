export type RoleName =
  | 'ADMIN'
  | 'ASSET_MANAGER'
  | 'EMPLOYEE';

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthRole {
  id: string;
  name: RoleName;
}

export interface AuthUser {
  id: string;
  email: string;
  status: string;
  role: AuthRole;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export interface CurrentUser {
  id: string;
  email: string;
  role: RoleName;
}