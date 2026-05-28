// src/shared/utils/auth.ts
import { UserRole } from "@/src/types/auth";

export const getDefaultRoute = (role?: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin";

    case UserRole.RECEPTIONIST:
      return "/receptionist";

    case UserRole.DENTIST:
      return "/dentist";

    case UserRole.PATIENT:
      return "/patient";

    default:
      return "/";
  }
};
