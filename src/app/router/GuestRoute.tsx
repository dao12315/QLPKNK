import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/src/app/store/authStore";
import { getDefaultRoute } from "@/src/shared/utils/auth";

export const GuestRoute = () => {
  const { user, isHydrated, isAuthenticated, isSessionChecked } =
    useAuthStore();

  if (!isHydrated || !isSessionChecked) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute(user?.role)} replace />;
  }

  return <Outlet />;
};
