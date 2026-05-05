import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/src/app/store/authStore';
import { UserRole } from '@/src/types/auth';

interface Props {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { accessToken, user, isHydrated } = useAuthStore();

  // 🔥 Fix bug reload
  if (!isHydrated) return null;

  // ❌ chưa login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // ❌ sai role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};