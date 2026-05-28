import React from 'react';
import { motion } from 'motion/react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ChevronRight,
  Users,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DentistDashboardPage = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Lịch hẹn hôm nay", value: '12', icon: <Calendar size={24} />, color: 'primary', trend: '+2 so với hôm qua' },
    { label: 'Đang điều trị', value: '3', icon: <Activity size={24} />, color: 'info', trend: 'Hiện tại' },
    { label: 'Hoàn thành tháng', value: '84', icon: <CheckCircle2 size={24} />, color: 'success', trend: '+15% tháng trước' },
    { label: 'Bệnh nhân theo dõi', value: '45', icon: <Users size={24} />, color: 'warning', trend: 'Dài hạn' },
  ];

  const timelineAppointments = [
    { time: '08:00', patient: 'Lê Văn Tám', chair: 'Ghế 01', status: 'completed' },
    { time: '09:30', patient: 'Nguyễn Thị Hoa', chair: 'Ghế 02', status: 'in_progress' },
    { time: '11:00', patient: 'Trần Văn B', chair: 'Ghế 01', status: 'confirmed' },
    { time: '14:00', patient: 'Phạm Minh C', chair: 'Ghế 03', status: 'confirmed' },
  ];

  const ongoingTreatments = [
    { patient: 'Nguyễn Thị Hoa', session: 'Phiên 3: Điều trị tủy', nextAppt: '15/05/2026', progress: 60 },
    { patient: 'Trần Văn D', session: 'Phiên 1: Niềng răng', nextAppt: '20/05/2026', progress: 10 },
  ];

  return (
    <AdminLayout title="Bảng điều khiển Bác sĩ">
      <div className="space-y-10 pb-20">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
           <div className="space-y-1">
             <h2 className="text-4xl font-bold text-slate-800 font-display tracking-tight leading-none">Chào buổi sáng, Bác sĩ!</h2>
             <p className="text-xs font-medium text-slate-400">Hôm nay bạn có {stats[0].value} lịch hẹn cần xử lý.</p>
           </div>
           <div className="flex gap-4">
             <button 
                onClick={() => navigate('/dentist/treatments/new')}
                className="flex items-center gap-2 px-8 py-5 bg-indigo-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 transition-all active:scale-95 group"
             >
               <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
               Tạo hồ sơ điều trị
             </button>
           </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col justify-center"
            >
              <div className="flex justify-between items-start relative z-10 mb-8">
                 <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Calendar size={32} />
                 </div>
                 <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {stats[0].trend}
                 </div>
              </div>
              <div className="space-y-1 relative z-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stats[0].label}</span>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-7xl font-bold text-slate-800 font-display tracking-tight leading-none">{stats[0].value}</h1>
                  <span className="text-lg font-bold text-slate-300 uppercase tracking-widest">Ca hẹn hôm nay</span>
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
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  stat.color === 'info' ? 'bg-sky-50 text-sky-500' : 
                  stat.color === 'success' ? 'bg-emerald-50 text-emerald-500' : 
                  'bg-amber-50 text-amber-500'
                } group-hover:scale-110`}>
                   {stat.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  <h3 className="text-3xl font-bold text-slate-800 font-display">{stat.value}</h3>
                  <p className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">{stat.trend}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Today Timeline */}
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display text-slate-800 uppercase tracking-tight">Trình tự làm việc</h3>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tiến độ điều trị trong ngày</p>
              </div>
              <button 
                onClick={() => navigate('/dentist/appointments')}
                className="px-6 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:text-indigo-600 transition-all shadow-sm flex items-center gap-1"
              >
                Tất cả <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="p-10 space-y-10 flex-1">
              {timelineAppointments.map((appt, i) => (
                <div key={i} className="flex gap-8 group relative">
                  {i !== timelineAppointments.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-[-40px] w-px bg-slate-100"></div>
                  )}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-3">{appt.time}</span>
                    <div className={`w-10 h-10 rounded-xl border-4 border-white shadow-md relative z-10 transition-transform group-hover:scale-110 duration-300 flex items-center justify-center ${
                      appt.status === 'completed' ? 'bg-emerald-500 text-white' : 
                      appt.status === 'in_progress' ? 'bg-indigo-600 text-white' : 
                      'bg-slate-100 text-slate-400'
                    }`}>
                        {appt.status === 'completed' ? <CheckCircle2 size={16} /> : 
                         appt.status === 'in_progress' ? <Activity size={16} /> : 
                         <Clock size={16} />}
                    </div>
                  </div>
                  
                  <div className={`flex-1 p-6 rounded-2xl transition-all duration-300 border ${
                    appt.status === 'in_progress' ? 'bg-slate-800 text-white shadow-xl shadow-slate-800/10' : 
                    'bg-slate-50 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-md'
                  }`}>
                     <div className="flex justify-between items-center mb-1">
                        <h4 className="text-base font-bold tracking-tight uppercase">{appt.patient}</h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          appt.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                          appt.status === 'in_progress' ? 'bg-white/10 text-white shadow-sm' : 
                          'bg-slate-200 text-slate-400'
                        }`}>
                           {appt.status === 'completed' ? 'Xong' : appt.status === 'in_progress' ? 'Đang khám' : 'Chờ'}
                        </span>
                     </div>
                     <p className={`text-[10px] font-medium uppercase tracking-wider ${appt.status === 'in_progress' ? 'text-slate-400' : 'text-slate-400'}`}>Phòng: {appt.chair}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold font-display text-slate-800 uppercase tracking-tight">Theo dõi đặc biệt</h3>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Các ca cần quan tâm sát</p>
              </div>
              
              <div className="space-y-4">
                {ongoingTreatments.map((treatment, i) => (
                  <div key={i} className="p-6 bg-slate-50/50 rounded-2xl border border-transparent hover:bg-white hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group">
                     <div className="flex justify-between mb-3 items-end">
                       <div className="space-y-0.5">
                         <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Bệnh nhân</span>
                         <h5 className="text-base font-bold text-slate-800 uppercase leading-none">{treatment.patient}</h5>
                       </div>
                       <span className="text-xl font-bold text-indigo-600 font-display">{treatment.progress}%</span>
                     </div>
                     
                     <div className="space-y-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{treatment.session}</p>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${treatment.progress}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className="h-full bg-indigo-500 rounded-full"
                          ></motion.div>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">Tái khám: {treatment.nextAppt}</span>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 p-10 rounded-[3rem] shadow-xl shadow-slate-800/10 group relative overflow-hidden">
               <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold font-display text-white tracking-tight uppercase">Lịch tuần này</h3>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
                       <Clock size={20} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                     {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                       <div key={i} className="flex flex-col items-center gap-3">
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${i === 0 ? 'text-indigo-400' : 'text-slate-500'}`}>{day}</span>
                         <div className={`w-2 h-2 rounded-full transition-transform ${i === 0 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                       </div>
                     ))}
                  </div>
                  
                  <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                     <div className="flex items-center gap-4">
                       <div className="text-left flex-1">
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Ca trực hôm nay</p>
                          <p className="text-lg font-bold text-white">08:00 — 12:00</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">Phòng</p>
                          <p className="text-sm font-bold text-indigo-400 uppercase">Tầng 2, A</p>
                       </div>
                     </div>
                  </div>
               </div>
               
               <div className="absolute right-[-10%] bottom-[-10%] opacity-10 text-white rotate-[-15deg]">
                  <Clock size={150} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DentistDashboardPage;
