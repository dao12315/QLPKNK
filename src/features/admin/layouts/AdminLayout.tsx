import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/src/app/store/authStore";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Stethoscope,
  UserSquare2,
  BriefcaseMedical,
  Pill,
  Armchair,
  ShieldCheck,
  BarChart3,
  FileText,
  CreditCard,
  Clock,
  Bell,
} from "lucide-react";
import { UserRole } from "@/src/types/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    if (user?.role === UserRole.ADMIN) {
      return [
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={20} />,
          path: "/admin/dashboard",
        },
        { label: "Users", icon: <Users size={20} />, path: "/admin/users" },
        {
          label: "Doctors",
          icon: <Stethoscope size={20} />,
          path: "/admin/doctors",
        },
        {
          label: "Patients",
          icon: <UserSquare2 size={20} />,
          path: "/admin/patients",
        },
        {
          label: "Services",
          icon: <BriefcaseMedical size={20} />,
          path: "/admin/services",
        },
        {
          label: "Medicines",
          icon: <Pill size={20} />,
          path: "/admin/medicines",
        },
        {
          label: "Reports",
          icon: <BarChart3 size={20} />,
          path: "/admin/reports",
        },
        {
          label: "Settings",
          icon: <Settings size={20} />,
          path: "/admin/settings",
        },
      ];
    }

    if (user?.role === UserRole.RECEPTIONIST) {
      return [
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={20} />,
          path: "/receptionist/dashboard",
        },
        {
          label: "Appointments",
          icon: <Calendar size={20} />,
          path: "/receptionist/appointments",
        },
        {
          label: "Patients",
          icon: <UserSquare2 size={20} />,
          path: "/receptionist/patients",
        },
        {
          label: "Invoices",
          icon: <FileText size={20} />,
          path: "/receptionist/invoices",
        },
        {
          label: "Doctor Schedules",
          icon: <Clock size={20} />,
          path: "/receptionist/doctor-schedules",
        },
        {
          label: "Settings",
          icon: <Settings size={20} />,
          path: "/admin/settings",
        }, // Shared settings for now
      ];
    }

    if (user?.role === UserRole.DENTIST) {
      return [
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={20} />,
          path: "/dentist/dashboard",
        },
        {
          label: "Patients",
          icon: <UserSquare2 size={20} />,
          path: "/admin/patients",
        },
        {
          label: "Settings",
          icon: <Settings size={20} />,
          path: "/admin/settings",
        },
      ];
    }

    if (user?.role === UserRole.PATIENT) {
      return [
        {
          label: "Dashboard",
          icon: <LayoutDashboard size={20} />,
          path: "/patient/dashboard",
        },
        {
          label: "Appointments",
          icon: <Calendar size={20} />,
          path: "/patient/appointments",
        },
        {
          label: "Profile",
          icon: <UserSquare2 size={20} />,
          path: "/patient/profile",
        },
        {
          label: "Notifications",
          icon: <Bell size={20} />,
          path: "/patient/notifications",
        },
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const getBrandText = () => {
    if (user?.role === UserRole.ADMIN) return "DentaCare Admin";
    if (user?.role === UserRole.RECEPTIONIST) return "DentaCare Staff";
    if (user?.role === UserRole.DENTIST) return "DentaCare Dentist";
    if (user?.role === UserRole.PATIENT) return "DentaCare Patient";
    return "DentaCare";
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-50/50 flex flex-col h-screen sticky top-0 shrink-0 border-r border-slate-100">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              D
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-800 font-display tracking-tight leading-none">
                {getBrandText()}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                Management System
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pt-2">
          {menuItems.map((item, i) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all group ${isActive ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"}`}
              >
                <div
                  className={`transition-transform duration-300 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-xs font-semibold tracking-tight ${isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-900"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
          >
            <LogOut size={18} />
            <span className="text-xs font-semibold">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 border-b border-slate-50 sticky top-0 z-30">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              DentaCare Clinic Portal
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <Bell size={18} />
              </button>
              <button
                onClick={() => navigate("/profile/change-password")}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
              >
                <ShieldCheck size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-100">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 leading-none">
                  {user?.name}
                </p>
                <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mt-1">
                  {user?.role}
                </p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=e0e7ff&color=4f46e5&bold=true`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 flex-1 overflow-y-auto bg-slate-50/30">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
