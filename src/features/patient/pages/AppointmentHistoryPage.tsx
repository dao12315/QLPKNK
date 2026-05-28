import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal,
  Stethoscope,
  MapPin,
  ArrowLeft,
  XCircle,
  AlertCircle,
  Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const AppointmentHistoryPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past
  const [searchTerm, setSearchTerm] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const navigate = useNavigate();

  const appointments = [
    { id: '101', date: '15/05/2026', time: '09:00 AM', doctor: 'BS. Nguyễn Văn A', service: 'Khám tổng quát', status: 'confirmed', location: 'Phòng 01, Tầng 1', note: 'Đau răng hàm trái' },
    { id: '095', date: '20/04/2026', time: '14:30 PM', doctor: 'BS. Trần Thị B', service: 'Lấy cao răng', status: 'done', location: 'Phòng 02, Tầng 2', note: 'Vệ sinh định kỳ' },
    { id: '088', date: '12/03/2026', time: '10:00 AM', doctor: 'BS. Phạm Minh C', service: 'Trám răng', status: 'cancelled', location: 'Phòng 03, Tầng 1', reason: 'Bận đột xuất' },
  ];

  const filteredAppointments = appointments.filter(appt => {
    const isMatched = appt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      appt.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'upcoming') {
      return isMatched && ['pending', 'confirmed'].includes(appt.status);
    } else {
      return isMatched && ['done', 'cancelled', 'no_show'].includes(appt.status);
    }
  });

  const getStatusBadgeStyle = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-50 text-green-600 border-green-100';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'done': return 'bg-neutral-50 text-neutral-500 border-neutral-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-neutral-50 text-neutral-400 border-neutral-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Đang chờ';
      case 'done': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      case 'no_show': return 'Không đến';
      default: return status;
    }
  };

  const handleCancel = (id: string) => {
    // Logic for PATCH /api/appointments/{id}/cancel
    console.log(`Cancelling ${id} with reason: ${cancelReason}`);
    setShowCancelModal(null);
    setCancelReason('');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] lg:p-8 p-4 font-sans text-neutral-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/patient/dashboard')}
              className="flex items-center gap-2 text-neutral-400 hover:text-blue-600 transition-colors font-bold text-sm mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Quay lại Dashboard
            </button>
            <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-neutral-900">Lịch sử khám bệnh</h1>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-white rounded-[1.5rem] border border-neutral-100 shadow-sm">
            <button 
               className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-neutral-400 hover:bg-neutral-50'}`}
               onClick={() => setActiveTab('upcoming')}
            >
               Sắp tới
            </button>
            <button 
               className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'past' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'text-neutral-400 hover:bg-neutral-50'}`}
               onClick={() => setActiveTab('past')}
            >
               Đã qua
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo bác sĩ, dịch vụ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white border border-neutral-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100/50 focus:border-blue-200 transition-all font-bold text-sm shadow-sm"
            />
          </div>
          <button className="p-5 bg-white border border-neutral-100 rounded-2xl text-neutral-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-95">
            <Filter size={24} />
          </button>
        </div>

        {/* List Content */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {filteredAppointments.length > 0 ? (
              <motion.div 
                 key={activeTab}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="space-y-6"
              >
                {filteredAppointments.map((appt) => (
                  <div key={appt.id} className="bg-white p-8 lg:p-10 rounded-[3rem] border border-neutral-100 shadow-sm flex flex-col lg:flex-row items-center gap-10 group hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all relative overflow-hidden">
                    
                    {/* Date Block */}
                    <div className="w-full lg:w-32 h-32 bg-neutral-50 rounded-[2.5rem] flex flex-col items-center justify-center border border-neutral-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500 shadow-inner">
                       <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1 group-hover:text-blue-200">T.{appt.date.split('/')[1]}</span>
                       <span className="text-4xl font-black font-display text-neutral-900 group-hover:text-white transition-colors">{appt.date.split('/')[0]}</span>
                    </div>

                    {/* Main Info */}
                    <div className="flex-grow space-y-5 text-center lg:text-left w-full relative z-10">
                       <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
                          <h3 className="text-2xl font-black font-display tracking-tight text-neutral-900">{appt.service}</h3>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBadgeStyle(appt.status)}`}>
                             {getStatusLabel(appt.status)}
                          </span>
                       </div>

                       <div className="flex flex-wrap justify-center lg:justify-start gap-x-10 gap-y-4 pt-1">
                          <div className="flex items-center gap-3 text-neutral-500 font-bold text-sm">
                             <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><Clock size={16} /></div> {appt.time}
                          </div>
                          <div className="flex items-center gap-3 text-neutral-500 font-bold text-sm">
                             <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Stethoscope size={16} /></div> {appt.doctor}
                          </div>
                          <div className="flex items-center gap-3 text-neutral-500 font-bold text-sm">
                             <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><MapPin size={16} /></div> {appt.location}
                          </div>
                       </div>
                       
                       {appt.note && (
                         <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 inline-flex items-center gap-3 text-xs font-bold text-neutral-400 italic">
                            <Hash size={14} /> "{appt.note}"
                         </div>
                       )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 w-full lg:w-auto pt-8 lg:pt-0 lg:pl-12 border-t lg:border-t-0 lg:border-l border-neutral-50 shrink-0">
                       {['pending', 'confirmed'].includes(appt.status) && (
                          <button 
                            onClick={() => setShowCancelModal(appt.id)}
                            className="w-full px-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-sm"
                          >
                             <XCircle size={18} /> Hủy lịch
                          </button>
                       )}
                       <button className="w-full px-8 py-4 bg-neutral-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-neutral-900/10">
                          Chi tiết <ChevronRight size={18} />
                       </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-neutral-200"
              >
                <div className="w-24 h-24 bg-neutral-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-neutral-300">
                   <Calendar size={48} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Chưa có lịch hẹn nào</h3>
                <p className="text-neutral-500 max-w-sm mx-auto font-medium">Bạn hiện không có lịch hẹn nào trong mục này. Hãy thử đặt một lịch hẹn mới để được chăm sóc tốt nhất.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
         {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCancelModal(null)}
                  className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
               />
               <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl space-y-8"
               >
                  <div className="text-center space-y-2">
                     <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} />
                     </div>
                     <h3 className="text-2xl font-black tracking-tight">Xác nhận hủy lịch</h3>
                     <p className="text-neutral-500 font-bold">Vui lòng nhập lý do để chúng tôi hỗ trợ bạn tốt hơn.</p>
                  </div>
                  
                  <textarea 
                     placeholder="Ví dụ: Tôi bận việc đột xuất, cần dời lịch sau..."
                     className="w-full p-5 bg-neutral-50 border border-neutral-100 rounded-2xl h-32 focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-medium"
                     value={cancelReason}
                     onChange={(e) => setCancelReason(e.target.value)}
                  ></textarea>

                  <div className="flex gap-4">
                     <button 
                        onClick={() => setShowCancelModal(null)}
                        className="flex-grow py-4 bg-neutral-100 text-neutral-600 rounded-xl font-bold transition-all"
                     >
                        Quay lại
                     </button>
                     <button 
                        disabled={!cancelReason}
                        onClick={() => handleCancel(showCancelModal)}
                        className="flex-grow py-4 bg-red-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-900/10"
                     >
                        Hủy lịch hẹn
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default AppointmentHistoryPage;
