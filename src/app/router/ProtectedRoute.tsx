import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/src/app/store/authStore";
import { UserRole } from "@/src/types/auth";

interface Props {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { accessToken, user, isHydrated, isAuthenticated, isSessionChecked } =
    useAuthStore();

  console.log("🛡️ [PROTECTED ROUTE]", {
    isHydrated,
    isSessionChecked,
    isAuthenticated,
    hasToken: !!accessToken,
    role: user?.role,
    allowedRoles,
  });

  if (!isHydrated || !isSessionChecked) {
    console.log("⏳ [PROTECTED] Checking session / Đang kiểm tra phiên");
    return null;
  }

  if (!accessToken || !isAuthenticated) {
    console.log("🚫 [PROTECTED] Not authenticated / Chưa xác thực");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.log("⛔ [PROTECTED] Role not allowed / Sai quyền");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ [PROTECTED] Access allowed / Được phép vào");
  return <Outlet />;
};
