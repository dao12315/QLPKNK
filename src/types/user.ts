import { UserRole } from "./auth";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserFilter {
  page?: number;
  size?: number;
  sort?: string;
  email?: string;
  name?: string;
  role?: UserRole;
}
