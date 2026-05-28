import React from "react";
import { motion } from "motion/react";
import AdminLayout from "../../admin/layouts/AdminLayout";
import {
  Calendar,
  Clock,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ReceptionistDashboardPage = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: "Today's Appointments",
      value: "24",
      icon: <Calendar size={24} />,
      color: "primary",
    },
    {
      label: "Pending Confirm",
      value: "8",
      icon: <Clock size={24} />,
      color: "warning",
    },
    {
      label: "In Treatment",
      value: "4",
      icon: <AlertCircle size={24} />,
      color: "info",
    },
    {
      label: "Completed",
      value: "12",
      icon: <CheckCircle2 size={24} />,
      color: "success",
    },
  ];

  const pendingAppointments = [
    {
      id: 1,
      time: "09:00",
      patient: "Alice Johnson",
      phone: "0987123456",
      doctor: "Dr. Nguyen Van A",
      chair: "Chair 01",
    },
    {
      id: 2,
      time: "10:30",
      patient: "Bob Smith",
      phone: "0912345678",
      doctor: "Dr. Tran Thi B",
      chair: "Chair 02",
    },
  ];

  const todaySchedule = [
    {
      time: "08:00",
      patient: "Charlie Brown",
      doctor: "Dr. Nguyen Van A",
      status: "completed",
      chair: "Chair 01",
    },
    {
      time: "09:30",
      patient: "David Wilson",
      doctor: "Dr. Tran Thi B",
      status: "confirmed",
      chair: "Chair 02",
    },
    {
      time: "11:00",
      patient: "Eve Online",
      doctor: "Dr. Nguyen Van A",
      status: "pending",
      chair: "Chair 01",
    },
  ];

  return (
    <AdminLayout title="Bảng điều khiển Lễ tân">
      <div className="space-y-10 pb-20">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-slate-800 font-display tracking-tight">
              Chào buổi sáng,{" "}
              {
                // user?.fullName ||
                "Admin"
              }
              !
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Hôm nay là một ngày bận rộn tại DentaCare.
            </p>
          </div>
          <div className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center gap-3 group">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Calendar size={16} />
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Monday, May 11, 2026
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-white px-8 py-5 rounded-[2.5rem] border border-slate-100 shadow-sm w-full xl:w-1/2 group focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-300">
            <Search
              size={20}
              className="text-slate-300 group-focus-within:text-indigo-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân, ID hoặc số điện thoại..."
              className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          <div className="flex gap-4 w-full xl:w-auto">
            <button
              onClick={() => navigate("/receptionist/patients")}
              className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-8 py-5 bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-lg shadow-slate-800/10 hover:bg-slate-700 transition-all active:scale-95 shrink-0"
            >
              <UserPlus size={18} />
              Đăng ký bệnh nhân
            </button>
            <button
              onClick={() => navigate("/receptionist/appointments")}
              className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-8 py-5 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition-all active:scale-95 shrink-0"
            >
              <Plus size={18} />
              Lịch hẹn mới
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-center"
            >
              <div className="flex justify-between items-start relative z-10 mb-8">
                <div className="w-16 h-16 bg-indigo-100/50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Calendar size={32} />
                </div>
                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  +12% so với hôm qua
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stats[0].label}
                </span>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-7xl font-bold text-slate-800 font-display tracking-tight leading-none">
                    {stats[0].value}
                  </h1>
                  <span className="text-lg font-bold text-slate-300 uppercase tracking-widest">
                    Lịch hẹn
                  </span>
                </div>
              </div>

              <div className="absolute right-[-5%] top-[-5%] opacity-[0.03] text-indigo-600 rotate-12 transition-transform group-hover:scale-110 duration-700">
                <Calendar size={250} />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {stats.slice(1).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-lg transition-all cursor-pointer"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    stat.color === "info"
                      ? "bg-sky-50 text-sky-500"
                      : stat.color === "success"
                        ? "bg-emerald-50 text-emerald-500"
                        : "bg-amber-50 text-amber-500"
                  } group-hover:scale-110`}
                >
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </span>
                  <h3 className="text-3xl font-bold text-slate-800 font-display">
                    {stat.value}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Priority Tasks */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
              <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-display text-slate-800 uppercase tracking-tight">
                    Tổng quan hôm nay
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Theo dõi tiến độ khám chữa bệnh
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100">
                  <button className="px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white shadow-md">
                    Tất cả
                  </button>
                  <button className="px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:bg-slate-50 transition-colors">
                    Sắp tới
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/20">
                      <th className="px-10 py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Già GIẤY
                      </th>
                      <th className="py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        BỆNH NHÂN
                      </th>
                      <th className="py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        BÁC SĨ
                      </th>
                      <th className="py-6 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        TRẠNG THÁI
                      </th>
                      <th className="px-10 py-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {todaySchedule.map((item, i) => (
                      <tr
                        key={i}
                        className="group hover:bg-slate-50/30 transition-colors cursor-pointer"
                      >
                        <td className="px-10 py-8">
                          <span className="text-xs font-bold font-display text-slate-700 bg-slate-100 px-4 py-1.5 rounded-lg">
                            {item.time}
                          </span>
                        </td>
                        <td className="py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-sm">
                              {item.patient.charAt(0)}
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-bold text-slate-800">
                                {item.patient}
                              </div>
                              <div className="text-[10px] font-medium text-slate-400">
                                Khám tổng quát
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-8">
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                            {item.doctor}
                          </span>
                        </td>
                        <td className="py-8">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                              item.status === "completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : item.status === "confirmed"
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                item.status === "completed"
                                  ? "bg-emerald-500"
                                  : item.status === "confirmed"
                                    ? "bg-indigo-500"
                                    : "bg-amber-500"
                              }`}
                            ></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-slate-800 uppercase tracking-tight">
                    Cảnh báo thanh toán
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400">
                    Danh sách hóa đơn chưa tất toán
                  </p>
                </div>

                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="p-6 bg-slate-50/50 rounded-2xl border border-transparent hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-indigo-500 tracking-wider uppercase">
                            #INV-00{i}
                          </span>
                          <h5 className="text-sm font-bold text-slate-700">
                            Mark Fletcher
                          </h5>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-800">
                            1.200.000đ
                          </div>
                          <button
                            onClick={() => navigate("/receptionist/invoices")}
                            className="mt-2 text-[10px] font-bold text-indigo-600 hover:underline"
                          >
                            Xử lý ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-xl shadow-indigo-600/10 text-center relative overflow-hidden group">
                <div className="relative z-10 space-y-8 flex flex-col items-center py-4">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-700">
                    <UserPlus size={32} />
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-2xl font-bold text-white font-display tracking-tight">
                      TIẾP NHẬN BỆNH NHÂN
                    </h5>
                    <p className="text-xs font-medium text-indigo-100 leading-relaxed">
                      Đăng ký thông tin và tạo hồ sơ mới
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/receptionist/patients")}
                    className="w-full py-4 bg-white text-indigo-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
                  >
                    Bắt đầu ngay
                  </button>
                </div>
                <div className="absolute right-[-10%] top-[-10%] opacity-10 text-white rotate-12">
                  <UserPlus size={180} />
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-slate-50 group">
              <div className="relative z-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
                      <AlertCircle size={24} />
                    </div>
                    <h5 className="text-lg font-bold font-display text-slate-800 uppercase tracking-tight">
                      Chờ xác nhận
                    </h5>
                  </div>
                  <span className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-4 border-white shadow-md animate-pulse">
                    2
                  </span>
                </div>

                <div className="space-y-4">
                  {pendingAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group/item shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-slate-800">
                          {appt.time}
                        </span>
                        <span className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {appt.chair}
                        </span>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-0.5">
                          <h4 className="text-base font-bold text-slate-800">
                            {appt.patient}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                            <span>{appt.phone}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                            <span className="text-indigo-500 font-bold">
                              {appt.doctor}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 py-3 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-emerald-600 transition-all">
                            Xác nhận
                          </button>
                          <button className="flex-1 py-3 bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                            Hủy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800 p-8 rounded-3xl text-white relative overflow-hidden group/shift">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock size={20} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        Kết thúc ca làm
                      </p>
                      <p className="text-xl font-bold font-display tracking-tight text-white">
                        04 : 22 : 15
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReceptionistDashboardPage;
