import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/src/app/store/authStore';
import { getDefaultRoute } from '@/src/shared/utils/auth';

export const GuestRoute = () => {
  const { accessToken, user, isHydrated } = useAuthStore();

  if (!isHydrated) return null;

  if (accessToken) {
    return <Navigate to={getDefaultRoute(user?.role)} replace />;
  }

  return <Outlet />;
};