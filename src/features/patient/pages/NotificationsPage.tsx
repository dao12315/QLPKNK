import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  CheckCircle2, 
  Clock,
  ArrowLeft,
  Trash2,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const notifications = [
    { 
      id: 1, 
      title: 'Xác nhận lịch hẹn', 
      message: 'Lễ tân đã xác nhận lịch hẹn khám tổng quát của bạn vào lúc 09:00, Ngày 15/05/2026.', 
      time: '2 giờ trước', 
      type: 'appointment',
      isRead: false,
      date: '2026-05-11'
    },
    { 
      id: 2, 
      title: 'Lời nhắc tái khám', 
      message: 'Đã 6 tháng kể từ lần khám gần nhất, hãy dành ít phút để kiểm tra răng định kỳ nhé!', 
      time: '5 giờ trước', 
      type: 'reminder',
      isRead: false,
      date: '2026-05-11'
    },
    { 
      id: 3, 
      title: 'Hóa đơn mới được tạo', 
      message: 'Hóa đơn mã INV-2026-003 cho dịch vụ Điều trị tủy đã sẵn sàng. Vui lòng thanh toán.', 
      time: 'Hôm qua', 
      type: 'payment',
      isRead: true,
      date: '2026-05-10'
    },
    { 
      id: 4, 
      title: 'Thay đổi trạng thái', 
      message: 'Lịch hẹn ngày 12/03 đã chuyển sang trạng thái "Đã hủy" theo yêu cầu của bạn.', 
      time: '2 ngày trước', 
      type: 'appointment',
      isRead: true,
      date: '2026-05-09'
    },
  ];

  const filteredNotifs = filter === 'All' 
    ? notifications 
    : notifications.filter(n => {
        if (filter === 'Appointments') return n.type === 'appointment';
        if (filter === 'Payments') return n.type === 'payment';
        return true;
      });

  const getIcon = (type: string) => {
    switch(type) {
      case 'appointment': return <Calendar className="text-blue-500" />;
      case 'payment': return <CreditCard className="text-amber-500" />;
      case 'reminder': return <Clock className="text-purple-500" />;
      default: return <Bell size={20} className="text-neutral-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] lg:p-8 p-4 font-sans text-neutral-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/patient/dashboard')}
              className="flex items-center gap-2 text-neutral-400 hover:text-blue-600 transition-colors font-bold text-sm mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Quay lại Dashboard
            </button>
            <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-neutral-900">Thông báo</h1>
          </div>
          
          <div className="flex gap-3">
             <button className="px-6 py-4 bg-white border border-neutral-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95">
                Đánh dấu đã đọc
             </button>
             <button className="p-4 bg-white border border-neutral-100 rounded-2xl text-neutral-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm active:scale-95">
                <Trash2 size={22} />
             </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
           {['All', 'Appointments', 'Payments', 'System'].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border ${filter === cat ? 'bg-neutral-900 text-white border-neutral-900 shadow-xl shadow-neutral-200' : 'bg-white border-neutral-100 text-neutral-400 hover:border-neutral-200'}`}
              >
                {cat === 'All' ? 'Tất cả thông báo' : cat === 'Appointments' ? 'Lịch hẹn' : cat === 'Payments' ? 'Thanh toán' : 'Hệ thống'}
              </button>
           ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-[3.5rem] border border-neutral-100 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
               key={filter}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="divide-y divide-neutral-50"
            >
              {filteredNotifs.length > 0 ? filteredNotifs.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-10 flex gap-10 items-start hover:bg-neutral-50/50 transition-all cursor-pointer relative group ${!notif.isRead ? 'bg-blue-50/10' : ''}`}
                >
                   {!notif.isRead && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-20 bg-blue-600 rounded-r-full"></div>
                   )}
                   
                   <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-sm border transition-all duration-300 group-hover:scale-105 ${!notif.isRead ? 'bg-white border-blue-100 ring-4 ring-blue-50' : 'bg-neutral-50 border-neutral-100'}`}>
                      {getIcon(notif.type)}
                   </div>

                   <div className="flex-grow space-y-3 pt-1">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                         <h3 className={`text-xl font-black font-display tracking-tight ${!notif.isRead ? 'text-neutral-900' : 'text-neutral-500'}`}>{notif.title}</h3>
                         <div className="flex flex-wrap items-center gap-4">
                            {!notif.isRead && (
                               <span className="px-3 py-1 bg-blue-600 text-white text-[8px] font-black rounded-full uppercase tracking-widest shadow-md shadow-blue-500/10">Mới</span>
                            )}
                            <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest whitespace-nowrap">
                               <Clock size={12} className="inline mr-1" /> {notif.time}
                            </span>
                         </div>
                      </div>
                      <p className={`text-base font-medium leading-relaxed max-w-3xl ${!notif.isRead ? 'text-neutral-600' : 'text-neutral-400'}`}>
                         {notif.message}
                      </p>
                   </div>

                   <ChevronRight className="self-center text-neutral-100 group-hover:text-blue-200 transition-colors flex-shrink-0" />
                </div>
              )) : (
                <div className="p-32 text-center space-y-6">
                   <div className="w-24 h-24 bg-neutral-50 rounded-[2rem] flex items-center justify-center mx-auto text-neutral-200">
                      <Bell size={64} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black font-display text-neutral-900 tracking-tight">Hộp thư trống</h3>
                      <p className="text-neutral-400 font-bold max-w-sm mx-auto">Bạn hiện không có thông báo nào trong danh mục này.</p>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tip Banner */}
        <section className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-[3rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-2 text-center md:text-left">
                 <h4 className="text-xl font-black tracking-tight">Kích hoạt thông báo đẩy?</h4>
                 <p className="text-blue-100 text-sm font-bold max-w-md">Nhận ngay nhắc nhở lịch hẹn và ưu đãi mới nhất trực tiếp trên điện thoại của bạn.</p>
              </div>
              <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
                 Kích hoạt ngay
              </button>
           </div>
           <div className="absolute right-[-5%] top-[-10%] opacity-10 rotate-12 pointer-events-none">
              <Info size={180} />
           </div>
        </section>

      </div>
    </div>
  );
};

export default NotificationsPage;
