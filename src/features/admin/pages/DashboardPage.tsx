import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useAuthStore } from "@/src/app/store/authStore";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowRight,
  UserPlus,
  Clock,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const stats = [
    {
      label: "Total Patients",
      value: "1,284",
      change: "+12%",
      icon: <Users size={20} className="icon-blue" />,
      path: "/admin/patients",
    },
    {
      label: "New Appointments",
      value: "42",
      change: "+8%",
      icon: <Calendar size={20} className="icon-purple" />,
      path: "/admin/schedule",
    },
    {
      label: "Revenue (MTD)",
      value: "$52,400",
      change: "+24%",
      icon: <DollarSign size={20} className="icon-green" />,
      path: "/admin/invoices",
    },
    {
      label: "Active Doctors",
      value: "12",
      change: "+1",
      icon: <Activity size={20} className="icon-red" />,
      path: "/admin/doctors",
    },
  ];

  return (
    <AdminLayout title="Phân tích phòng khám">
      <div className="space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => stat.path && navigate(stat.path)}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:ring-2 hover:ring-indigo-50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 transition-all duration-300">
                  <div className="group-hover:text-white text-slate-400 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100">
                  <TrendingUp size={10} />
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-slate-800 font-display tracking-tight relative z-10">
                {stat.value}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between group-hover:border-indigo-100 transition-colors relative z-10">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                  Chi tiết
                </span>
                <ArrowRight
                  size={14}
                  className="text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1"
                />
              </div>

              <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.03] text-indigo-600 rotate-12 transition-transform group-hover:scale-110">
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight">
                  Lịch hẹn gần đây
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                  Hôm nay, ngày 11 tháng 5 năm 2026
                </p>
              </div>
              <button className="px-5 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:text-indigo-600 transition-all shadow-sm">
                Tất cả
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/10">
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Bệnh nhân
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Bác sĩ
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Thời gian
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    {
                      pat: "Nguyễn Văn A",
                      doc: "Dr. John",
                      time: "09:00 AM",
                      status: "Confirmed",
                    },
                    {
                      pat: "Trần Thị B",
                      doc: "Dr. Sarah",
                      time: "10:30 AM",
                      status: "Checking-In",
                    },
                    {
                      pat: "Alex Johnson",
                      doc: "Dr. Michael",
                      time: "11:15 AM",
                      status: "Pending",
                    },
                    {
                      pat: "Maria Garcia",
                      doc: "Dr. Sarah",
                      time: "01:00 PM",
                      status: "Confirmed",
                    },
                    {
                      pat: "Lê Văn C",
                      doc: "Dr. John",
                      time: "02:30 PM",
                      status: "Pending",
                    },
                  ].map((app, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-sm">
                            {app.pat[0]}
                          </div>
                          <span className="font-bold text-slate-700 tracking-tight">
                            {app.pat}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-semibold text-slate-500">
                        {app.doc}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px]">
                          <Clock size={14} className="text-indigo-400" />
                          {app.time}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            app.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-600"
                              : app.status === "Checking-In"
                                ? "bg-indigo-50 text-indigo-600"
                                : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          {app.status === "Confirmed"
                            ? "Đã xác nhận"
                            : app.status === "Checking-In"
                              ? "Đang đến"
                              : "Đang chờ"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight text-center uppercase">
                  Hoạt động hệ thống
                </h3>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest text-center">
                  Thời gian thực
                </p>
              </div>

              <div className="space-y-6 relative ml-2">
                <div className="absolute left-2.5 top-1 bottom-1 w-px bg-slate-100"></div>
                {[
                  {
                    type: "reg",
                    text: 'Bệnh nhân mới đăng ký: "Hoàng Văn E"',
                    time: "12 phút trước",
                  },
                  {
                    type: "app",
                    text: "Lịch hẹn mới đặt bởi Alex J.",
                    time: "45 phút trước",
                  },
                  {
                    type: "pay",
                    text: "Hóa đơn #INV-2045 đã tất toán: 1.200.000đ",
                    time: "1 giờ trước",
                  },
                  {
                    type: "reg",
                    text: "Hồ sơ bác sĩ được thêm: Dr. Kelly",
                    time: "3 giờ trước",
                  },
                ].map((act, i) => (
                  <div key={i} className="flex gap-5 relative group">
                    <div
                      className={`w-5 h-5 rounded-lg border-2 border-white shadow-sm transition-transform group-hover:scale-125 z-10 ${
                        act.type === "reg"
                          ? "bg-indigo-500"
                          : act.type === "app"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                      }`}
                    ></div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-700 leading-normal group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                        {act.text}
                      </p>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={10} /> {act.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 p-10 rounded-[3rem] text-center space-y-8 relative overflow-hidden group">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white mx-auto transition-transform group-hover:scale-110 duration-500">
                <UserPlus size={24} />
              </div>
              <div className="space-y-1.5 relative z-10">
                <p className="text-xl font-bold font-display text-white tracking-tight leading-none uppercase">
                  Mở rộng đội ngũ?
                </p>
                <p className="text-slate-400 font-medium text-xs">
                  Mời thêm bác sĩ hoặc nhân viên quản trị.
                </p>
              </div>
              <button className="w-full py-4 bg-white text-slate-800 font-bold text-[11px] uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-lg relative z-10">
                Mời thành viên
              </button>

              <div className="absolute right-[-10%] bottom-[-10%] opacity-10 text-white rotate-12 transition-transform duration-1000">
                <Users size={150} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
