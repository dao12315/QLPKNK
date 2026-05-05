// src/shared/utils/auth.ts
import { UserRole } from '@/src/types/auth';

export const getDefaultRoute = (role?: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin';
    case UserRole.USER:
      return '/profile';
    default:
      return '/';
  }
};