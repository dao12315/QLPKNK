import React, { useState } from "react";
import { useAuthStore } from "@/src/app/store/authStore";
import {
  User,
  Calendar,
  Clipboard,
  CreditCard,
  LogOut,
  FileText,
  ChevronRight,
  ArrowLeft,
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock,
  Download,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

const PatientProfilePage = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info"); // info, treatment, invoices

  const treatmentHistory = [
    {
      id: "TR-001",
      date: "10/05/2026",
      doctor: "BS. Nguyễn Văn A",
      diagnosis: "Sâu răng hàm số 46",
      status: "completed",
    },
    {
      id: "TR-002",
      date: "15/04/2026",
      doctor: "BS. Trần Thị B",
      diagnosis: "Viêm lợi cấp tính",
      status: "completed",
    },
  ];

  const invoices = [
    {
      id: "INV-2026-001",
      date: "10/05/2026",
      total: "1,500,000",
      paid: "1,500,000",
      remaining: "0",
      status: "paid",
    },
    {
      id: "INV-2026-002",
      date: "15/04/2026",
      total: "500,000",
      paid: "500,000",
      remaining: "0",
      status: "paid",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] lg:p-8 p-4 font-sans text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top bar with back button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/patient/dashboard")}
            className="flex items-center gap-2 text-neutral-400 hover:text-blue-600 transition-colors font-bold text-sm group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Quay lại Dashboard
          </button>
        </div>

        {/* Profile Header Card */}
        <header className="bg-white p-8 lg:p-12 rounded-[3.5rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-blue-50 overflow-hidden ring-4 ring-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff&bold=true`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-neutral-100 text-blue-600 hover:scale-110 transition-transform active:scale-95">
                <Settings size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black font-display text-neutral-900 tracking-tight mb-2">
                  {user?.name}
                </h1>
                <p className="text-neutral-400 font-bold text-lg">
                  {user?.email}
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
                  Bệnh nhân
                </span>
                <span className="px-4 py-1.5 bg-neutral-100 text-neutral-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-neutral-200">
                  Mã ID: #8829
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl border border-neutral-100 bg-white active:scale-95 shadow-sm shrink-0"
          >
            <LogOut size={20} />
            Đăng xuất
          </button>

          <div className="absolute right-[-5%] top-[-10%] opacity-5 pointer-events-none rotate-12">
            <User size={300} />
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-[2rem] border border-neutral-100 shadow-sm w-fit max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "info" ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setActiveTab("treatment")}
            className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "treatment" ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Lịch sử điều trị
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === "invoices" ? "bg-blue-600 text-white shadow-xl shadow-blue-200" : "text-neutral-400 hover:bg-neutral-50"}`}
          >
            Hóa đơn & Thanh toán
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="md:col-span-2 bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm space-y-10">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black font-display text-neutral-900 tracking-tight">
                    Chi tiết hồ sơ
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-2xl bg-neutral-400 text-neutral-700 text-sm font-bold hover:bg-neutral-200 transition-all">
                      Chỉnh sửa thông tin
                    </button>

                    <button
                      onClick={() => navigate("/profile/change-password")}
                      className="px-4 py-2 rounded-2xl bg-blue-700 text-white text-sm font-bold hover:bg-blue-300 shadow-sm shadow-blue-200 transition-all"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-2">
                      Họ và tên
                    </p>
                    <p className="font-bold text-neutral-900 text-lg uppercase tracking-tight">
                      {user?.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-2">
                      Số điện thoại
                    </p>
                    <p className="font-bold text-neutral-900 text-lg tracking-tight">
                      0982-123-456
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-2">
                      Email xác thực
                    </p>
                    <p className="font-bold text-neutral-900 text-lg tracking-tight">
                      {user?.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-2">
                      Ngày sinh / Giới tính
                    </p>
                    <p className="font-bold text-neutral-900 text-lg tracking-tight">
                      12/08/1995 • Nam
                    </p>
                  </div>
                  <div className="sm:col-span-2 space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-2">
                      Địa chỉ thường trú
                    </p>
                    <p className="font-bold text-neutral-900 text-lg leading-relaxed tracking-tight">
                      123 Đường Bà Huyện Thanh Quan, Quận 3, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50/50 p-10 rounded-[3rem] border border-amber-100 shadow-sm space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-xl font-black font-display text-amber-900 tracking-tight">
                    Cảnh báo y tế
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="p-5 bg-white rounded-2xl border border-amber-100/50 shadow-sm">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 leading-none">
                      Dị ứng
                    </p>
                    <p className="text-sm font-bold text-amber-900 leading-relaxed">
                      Dị ứng với thuốc Penicillin và hải sản.
                    </p>
                  </div>
                  <div className="p-5 bg-white rounded-2xl border border-amber-100/50 shadow-sm">
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2 leading-none">
                      Bệnh lý nền
                    </p>
                    <p className="text-sm font-bold text-amber-900 leading-relaxed">
                      Huyết áp thấp, từng tiểu phẫu nhổ răng khôn #38, #48.
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-amber-600 font-bold italic leading-relaxed text-center">
                  * Thông tin bảo mật, chỉ dùng trong mục đích y tế.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === "treatment" && (
            <motion.div
              key="treatment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {treatmentHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all flex flex-col md:flex-row justify-between items-center gap-8 group"
                >
                  <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <Clipboard size={28} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black font-display text-neutral-900 text-xl tracking-tight">
                        {item.diagnosis}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} /> {item.date}
                        </span>
                        <span>•</span>
                        <span className="text-purple-500">{item.doctor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-neutral-50 md:pl-10 shrink-0">
                    <button className="flex-grow md:shrink-0 px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center gap-2 justify-center shadow-xl shadow-neutral-900/10 active:scale-95">
                      <FileText size={16} /> Chi tiết phim X-Quang
                    </button>
                    <ChevronRight className="text-neutral-200 group-hover:text-blue-500 transition-colors hidden sm:block" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "invoices" && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <h4 className="font-black font-display text-neutral-900 text-2xl tracking-tight">
                        Hóa đơn {inv.id}
                      </h4>
                      <span className="px-4 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                        Đã quyết toán
                      </span>
                    </div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} /> Ngày lập lệnh: {inv.date}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 w-full lg:w-auto items-center">
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 leading-none">
                        Phát sinh
                      </p>
                      <p className="font-black text-neutral-900 text-lg tracking-tight">
                        {inv.total}đ
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 leading-none">
                        Miễn giảm
                      </p>
                      <p className="font-black text-green-600 text-lg tracking-tight">
                        -{inv.remaining}đ
                      </p>
                    </div>
                    <div className="col-span-2 lg:col-span-1 border-t lg:border-t-0 lg:border-l border-neutral-50 pt-8 lg:pt-0 lg:pl-10">
                      <button className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                        <Download size={18} /> Lưu trữ PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PatientProfilePage;
