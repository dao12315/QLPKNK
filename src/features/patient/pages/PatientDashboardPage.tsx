import React from "react";
import {
  Calendar,
  Clock,
  Plus,
  ChevronRight,
  Bell,
  User,
  MapPin,
  Stethoscope,
  Activity,
  CreditCard,
  Star,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/src/app/store/authStore";
import { motion } from "motion/react";

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const upcomingAppointment = {
    id: "APP-201",
    date: "15/05/2026",
    time: "09:00 AM",
    doctor: "BS. Nguyễn Văn A",
    location: "Phòng 01, Tầng 1",
  };

  const ongoingTreatment = {
    name: "Niềng răng Invisalign",
    doctor: "BS. Trần Thị B",
    progress: 65,
  };

  const menuItems = [
    {
      title: "Đặt lịch hẹn",
      icon: <Plus className="text-blue-600" />,
      path: "/patient/appointments/new",
      color: "bg-blue-50",
    },
    {
      title: "Lịch sử khám",
      icon: <Calendar className="text-purple-600" />,
      path: "/patient/appointments",
      color: "bg-purple-50",
    },
    {
      title: "Hồ sơ y tế",
      icon: <Activity className="text-green-600" />,
      path: "/patient/profile",
      color: "bg-green-50",
    },
    {
      title: "Thanh toán",
      icon: <CreditCard className="text-amber-600" />,
      path: "/patient/profile",
      color: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] lg:p-8 p-4 font-sans text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-2 text-neutral-900">
              Chào {user?.name?.split(" ").pop()}! 👋
            </h1>
            <p className="text-neutral-500 font-medium">
              Bắt đầu ngày mới với một nụ cười rạng rỡ.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/patient/notifications")}
              className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm text-neutral-400 hover:text-blue-600 transition-all relative group active:scale-95"
              id="notifications-btn"
            >
              <Bell size={24} />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button
              onClick={() => navigate("/patient/profile")}
              className="flex items-center gap-3 p-1.5 pr-6 bg-white rounded-full border border-neutral-100 shadow-sm hover:border-blue-200 transition-all group"
              id="profile-btn"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff&bold=true`}
                  alt="avatar"
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">
                  Của tôi
                </p>
                <p className="font-bold text-neutral-900 text-sm group-hover:text-blue-600 transition-colors">
                  Tài khoản
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Hero Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all text-left group flex flex-col h-full"
              id={`menu-item-${i}`}
            >
              <div
                className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>
              <h3 className="font-black font-display text-xl text-neutral-900 tracking-tight mb-1">
                {item.title}
              </h3>
              <p className="text-neutral-400 text-sm font-medium mb-6">
                Dịch vụ chăm sóc chuyên nghiệp
              </p>
              <div className="mt-auto flex items-center justify-between w-full font-bold text-blue-600 text-[10px] uppercase tracking-widest">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Xem thêm
                </span>
                <ChevronRight
                  size={18}
                  className="text-neutral-200 group-hover:text-blue-500 transition-colors"
                />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-10">
            {/* Upcoming Appointment Section */}
            <section className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <h2 className="text-2xl font-black font-display tracking-tight text-neutral-900">
                  Lịch hẹn sắp tới
                </h2>
                <button
                  onClick={() => navigate("/patient/appointments")}
                  className="text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors"
                >
                  Tất cả lịch hẹn
                </button>
              </div>

              <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-10 lg:gap-16 relative overflow-hidden group">
                <div className="w-32 h-40 bg-blue-600 rounded-[2.5rem] flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-200 relative z-10 shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
                    Tháng 5
                  </span>
                  <span className="text-6xl font-black font-display">15</span>
                </div>

                <div className="flex-grow space-y-8 relative z-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-100">
                      Đã xác nhận
                    </span>
                    <span className="text-neutral-400 font-bold text-sm flex items-center gap-2 bg-neutral-50 px-3 py-1 rounded-lg">
                      <Clock size={16} /> {upcomingAppointment.time}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black font-display leading-tight text-neutral-900">
                    Khám răng định kỳ & Lấy cao răng
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">
                          Bác sĩ chuyên khoa
                        </p>
                        <p className="font-bold text-neutral-900 text-base">
                          {upcomingAppointment.doctor}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">
                          Vị trí phòng khám
                        </p>
                        <p className="font-bold text-neutral-900 text-base">
                          {upcomingAppointment.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-[-2%] bottom-[-5%] opacity-5 group-hover:rotate-6 transition-transform duration-1000 ease-in-out pointer-events-none">
                  <Calendar size={300} />
                </div>
              </div>
            </section>

            {/* Promotional / Health Tips Card */}
            <section className="bg-neutral-900 p-12 lg:p-16 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 md:max-w-md space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">
                  <Sparkles size={14} /> Mẹo sức khỏe
                </div>
                <h2 className="text-3xl lg:text-4xl font-black font-display tracking-tight leading-tight">
                  Bí quyết nụ cười tỏa sáng mỗi sớm mai
                </h2>
                <p className="text-neutral-400 font-medium text-lg leading-relaxed">
                  Đừng quên sử dụng xịt miệng thảo dược sau khi vệ sinh răng
                  miệng để hơi thở luôn ngọt ngào và diệt khuẩn.
                </p>
                <button className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/10 active:scale-95 group">
                  Xem thêm bí kíp{" "}
                  <ChevronRight
                    size={18}
                    className="inline ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-1/2 hidden md:block group">
                <img
                  src="https://images.unsplash.com/photo-1606811841660-1b516b05c71b?auto=format&fit=crop&q=80&w=800"
                  alt="dental tip"
                  className="w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-neutral-900"></div>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-10">
            {/* Ongoing Treatment Progress Card */}
            <section className="bg-white p-8 lg:p-10 rounded-[3rem] border border-neutral-100 shadow-sm space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-xl font-black font-display tracking-tight">
                    Tiến trình
                  </h3>
                </div>
                <Star
                  size={20}
                  className="text-amber-400"
                  fill="currentColor"
                />
              </div>

              <div className="space-y-8">
                <div className="p-6 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-black text-neutral-900 text-lg">
                        {ongoingTreatment.name}
                      </h4>
                      <span className="text-blue-600 font-black text-base">
                        {ongoingTreatment.progress}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-neutral-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${ongoingTreatment.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
                      <img
                        src="https://ui-avatars.com/api/?name=Tran+Thi+B&background=e9d5ff&color=7e22ce"
                        alt="dr avatar"
                      />
                    </div>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      BS. {ongoingTreatment.doctor.split(". ").pop()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/patient/profile")}
                  className="w-full py-5 border-2 border-neutral-100 rounded-2xl font-black text-sm text-neutral-500 hover:bg-neutral-50 hover:border-neutral-200 transition-all active:scale-[0.98]"
                >
                  Chi tiết lộ trình
                </button>
              </div>
            </section>

            {/* Feedback Invitation Card */}
            <section className="bg-amber-50 p-10 rounded-[3rem] border border-amber-100 text-center space-y-6 overflow-hidden relative">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto text-amber-500 shadow-xl shadow-amber-900/5 relative z-10">
                <Star size={36} fill="currentColor" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-black font-display text-amber-900 tracking-tight">
                  Bạn hài lòng chứ?
                </h3>
                <p className="text-amber-700/80 text-sm font-bold px-4 leading-relaxed">
                  Đóng góp của bạn giúp chúng tôi nâng cao chất lượng dịch vụ
                  mỗi ngày.
                </p>
              </div>
              <button className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95 relative z-10 text-center">
                Gửi đánh giá dịch vụ
              </button>
              <div className="absolute right-[-20%] bottom-[-20%] text-amber-200/20 rotate-45">
                <Activity size={200} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
