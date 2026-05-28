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
import { AuthInitializer } from "./AuthInitializer";

// Lazy load
const LoginPage = lazy(() => import("@/src/features/auth/pages/LoginPage"));
const RegisterPage = lazy(
  () => import("@/src/features/auth/pages/RegisterPage"),
);
const DashboardPage = lazy(
  () => import("@/src/features/admin/pages/DashboardPage"),
);
const UserManagementPage = lazy(
  () => import("@/src/features/admin/pages/UserManagementPage"),
);
const DoctorManagementPage = lazy(
  () => import("@/src/features/admin/pages/DoctorManagementPage"),
);
const PatientManagementPage = lazy(
  () => import("@/src/features/admin/pages/PatientManagementPage"),
);
const ServiceManagementPage = lazy(
  () => import("@/src/features/admin/pages/ServiceManagementPage"),
);
const MedicineManagementPage = lazy(
  () => import("@/src/features/admin/pages/MedicineManagementPage"),
);
const SettingsPage = lazy(
  () => import("@/src/features/admin/pages/SettingsPage"),
);
const ReportsPage = lazy(
  () => import("@/src/features/admin/pages/ReportsPage"),
);

const ReceptionistDashboardPage = lazy(
  () => import("@/src/features/receptionist/pages/ReceptionistDashboardPage"),
);
const AppointmentManagementPage = lazy(
  () => import("@/src/features/receptionist/pages/AppointmentManagementPage"),
);
const InvoiceManagementPage = lazy(
  () => import("@/src/features/receptionist/pages/InvoiceManagementPage"),
);
const PaymentPage = lazy(
  () => import("@/src/features/receptionist/pages/PaymentPage"),
);
const DoctorSchedulePage = lazy(
  () => import("@/src/features/receptionist/pages/DoctorSchedulePage"),
);
const TreatmentDetailPage = lazy(
  () => import("@/src/features/receptionist/pages/TreatmentDetailPage"),
);

// Dentist Pages
const DentistDashboardPage = lazy(
  () => import("@/src/features/dentist/pages/DentistDashboardPage"),
);
const DentistAppointmentPage = lazy(
  () => import("@/src/features/dentist/pages/DentistAppointmentPage"),
);
const DentistTreatmentListPage = lazy(
  () => import("@/src/features/dentist/pages/DentistTreatmentListPage"),
);
const TreatmentFormPage = lazy(
  () => import("@/src/features/dentist/pages/TreatmentFormPage"),
);
const DentistTreatmentDetailPage = lazy(
  () => import("@/src/features/dentist/pages/TreatmentDetailPage"),
);
const PrescriptionPage = lazy(
  () => import("@/src/features/dentist/pages/PrescriptionPage"),
);
const DentistPatientProfilePage = lazy(
  () => import("@/src/features/dentist/pages/PatientProfilePage"),
);

// Patient Pages
const PatientDashboardPage = lazy(
  () => import("@/src/features/patient/pages/PatientDashboardPage"),
);
const BookAppointmentPage = lazy(
  () => import("@/src/features/patient/pages/BookAppointmentPage"),
);
const AppointmentHistoryPage = lazy(
  () => import("@/src/features/patient/pages/AppointmentHistoryPage"),
);
const PatientProfilePage = lazy(
  () => import("@/src/features/patient/pages/ProfilePage"),
);
const PatientNotificationsPage = lazy(
  () => import("@/src/features/patient/pages/NotificationsPage"),
);

const ChangePasswordPage = lazy(
  () => import("@/src/features/profile/pages/ChangePasswordPage"),
);
const GuestHomePage = lazy(
  () => import("@/src/features/auth/pages/GuestHomePage"),
);
const StatusPage = lazy(() => import("@/src/shared/pages/StatusPage"));

const LoadingFallback = () => (
  <div className="loader-overlay">
    <div className="loader-spinner"></div>
    <style
      dangerouslySetInnerHTML={{
        __html: `
      .loader-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: var(--neutral-50);
      }
      .loader-spinner {
        width: 3rem;
        height: 3rem;
        border: 4px solid var(--neutral-200);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `,
      }}
    />
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

  // ================= AUTHENTICATED USER =================
  {
    element: (
      <ProtectedRoute
        allowedRoles={[
          UserRole.ADMIN,
          UserRole.RECEPTIONIST,
          UserRole.DENTIST,
          UserRole.PATIENT,
        ]}
      />
    ),
    children: [
      {
        path: "/profile/change-password",
        element: <ChangePasswordPage />,
      },
    ],
  },

  // ================= PATIENT =================
  {
    element: <ProtectedRoute allowedRoles={[UserRole.PATIENT]} />,
    children: [
      {
        path: "/patient",
        element: <Navigate to="/patient/dashboard" replace />,
      },
      {
        path: "/patient/dashboard",
        element: <PatientDashboardPage />,
      },
      {
        path: "/patient/appointments",
        element: <AppointmentHistoryPage />,
      },
      {
        path: "/patient/appointments/new",
        element: <BookAppointmentPage />,
      },
      {
        path: "/patient/profile",
        element: <PatientProfilePage />,
      },
      {
        path: "/patient/notifications",
        element: <PatientNotificationsPage />,
      },
    ],
  },

  // ================= ADMIN =================
  {
    element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
    children: [
      {
        path: "/admin",
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "/admin/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/admin/users",
        element: <UserManagementPage />,
      },
      {
        path: "/admin/doctors",
        element: <DoctorManagementPage />,
      },
      {
        path: "/admin/patients",
        element: <PatientManagementPage />,
      },
      {
        path: "/admin/services",
        element: <ServiceManagementPage />,
      },
      {
        path: "/admin/medicines",
        element: <MedicineManagementPage />,
      },
      {
        path: "/admin/settings",
        element: <SettingsPage />,
      },
      {
        path: "/admin/reports",
        element: <ReportsPage />,
      },
    ],
  },

  // ================= RECEPTIONIST =================
  {
    element: <ProtectedRoute allowedRoles={[UserRole.RECEPTIONIST]} />,
    children: [
      {
        path: "/receptionist",
        element: <Navigate to="/receptionist/dashboard" replace />,
      },
      {
        path: "/receptionist/dashboard",
        element: <ReceptionistDashboardPage />,
      },
      {
        path: "/receptionist/appointments",
        element: <AppointmentManagementPage />,
      },
      {
        path: "/receptionist/patients",
        element: <PatientManagementPage />,
      },
      {
        path: "/receptionist/invoices",
        element: <InvoiceManagementPage />,
      },
      {
        path: "/receptionist/invoices/:id/payment",
        element: <PaymentPage />,
      },
      {
        path: "/receptionist/doctor-schedules",
        element: <DoctorSchedulePage />,
      },
      {
        path: "/receptionist/treatments/:id",
        element: <TreatmentDetailPage />,
      },
    ],
  },

  // ================= DENTIST =================
  {
    element: <ProtectedRoute allowedRoles={[UserRole.DENTIST]} />,
    children: [
      {
        path: "/dentist",
        element: <Navigate to="/dentist/dashboard" replace />,
      },
      {
        path: "/dentist/dashboard",
        element: <DentistDashboardPage />,
      },
      {
        path: "/dentist/appointments",
        element: <DentistAppointmentPage />,
      },
      {
        path: "/dentist/treatments",
        element: <DentistTreatmentListPage />,
      },
      {
        path: "/dentist/treatments/new",
        element: <TreatmentFormPage />,
      },
      {
        path: "/dentist/treatments/:id/edit",
        element: <TreatmentFormPage />,
      },
      {
        path: "/dentist/treatments/:id",
        element: <DentistTreatmentDetailPage />,
      },
      {
        path: "/dentist/treatments/:id/prescriptions/new",
        element: <PrescriptionPage />,
      },
      {
        path: "/dentist/patients/:id",
        element: <DentistPatientProfilePage />,
      },
    ],
  },

  // ================= SYSTEM =================
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/403",
    element: <UnauthorizedPage />,
  },
  {
    path: "/404",
    element: <StatusPage code="404" />,
  },

  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
]);

export const AppRouter = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Suspense>
  </ErrorBoundary>
);
