import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/src/types/auth";
import { useAuthStore } from "@/src/app/store/authStore";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const getDashboardRoute = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return "/admin/dashboard";

      case UserRole.RECEPTIONIST:
        return "/receptionist/dashboard";

      case UserRole.DENTIST:
        return "/dentist/dashboard";

      case UserRole.PATIENT:
        return "/patient/dashboard";

      default:
        return "/";
    }
  };
  return (
    <nav className="flex items-center gap-2 mb-6">
      <div
        className="text-neutral-500 hover:text-blue-600 cursor-pointer transition-colors"
        onClick={() => navigate(getDashboardRoute())}
        id="breadcrumb-home"
      >
        <Home size={14} />
      </div>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-neutral-300" />
          <div
            className={`
              text-[13px] font-medium transition-colors
              ${
                index === items.length - 1
                  ? "text-neutral-900 font-bold cursor-default"
                  : "text-neutral-500 hover:text-blue-600 cursor-pointer"
              }
            `}
            onClick={() => item.path && navigate(item.path)}
            id={`breadcrumb-item-${index}`}
          >
            {item.label}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};
