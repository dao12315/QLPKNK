import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { UserRole } from "@/src/types/auth";
import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import { ErrorBoundary } from "@/src/shared/components/ErrorBoundary";
import UnauthorizedPage from "@/src/shared/pages/UnauthorizedPage";
import RegisterPage from "@/src/features/auth/pages/RegisterPage";

// Lazy load
const LoginPage = lazy(() => import("@/src/features/auth/pages/LoginPage"));
const DashboardPage = lazy(
  () => import("@/src/features/admin/pages/DashboardPage"),
);
const PatientProfilePage = lazy(
  () => import("@/src/features/patient/pages/ProfilePage"),
);
const GuestHomePage = lazy(
  () => import("@/src/features/auth/pages/GuestHomePage"),
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const router = createBrowserRouter([
  // ================= PUBLIC =================
  {
    path: "/",
    element: <GuestHomePage />,
  },

  // ================= GUEST ONLY =================
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  // ================= USER =================
  {
    element: <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.ADMIN]} />,
    children: [
      {
        path: "/profile",
        element: <PatientProfilePage />,
      },
    ],
  },

  // ================= ADMIN =================
  {
    element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
    children: [
      {
        path: "/admin",
        element: <DashboardPage />,
      },
    ],
  },

  // ================= SYSTEM =================
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  </ErrorBoundary>
);
