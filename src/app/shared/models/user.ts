export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: UserStatus;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  PENDING = 'PENDING'
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ChangeRoleRequest {
  role: string;
}

export interface ChangeStatusRequest {
  status: UserStatus;
}