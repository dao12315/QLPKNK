export enum UserRole {
  AN_DANH = "AN_DANH",

  ADMIN = "admin",
  RECEPTIONIST = "receptionist",
  DENTIST = "dentist",
  PATIENT = "patient",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
