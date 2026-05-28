import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope, 
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Info,
  Calendar,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const BookAppointmentPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    doctor: '',
    doctorId: '',
    date: '',
    time: '',
    note: ''
  });

  const doctors = [
    { id: '1', name: 'BS. Nguyễn Văn A', specialty: 'Răng Hàm Mặt', experience: '12 năm', rating: 4.9, avatar: 'dra' },
    { id: '2', name: 'BS. Trần Thị B', specialty: 'Niềng răng - Chỉnh nha', experience: '8 năm', rating: 4.8, avatar: 'drb' },
    { id: '3', name: 'BS. Phạm Minh C', specialty: 'Phẫu thuật thẩm mỹ', experience: '15 năm', rating: 5.0, avatar: 'drc' },
  ];

  const availableSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => step > 1 ? setStep(step - 1) : navigate('/patient/dashboard');

  const handleSubmit = () => {
    // Logic for POST /api/appointments status='pending'
    setStep(5); // Success step
  };

  return (
    <div className="min-h-screen bg-[#fafafa] lg:p-8 p-4 font-sans text-neutral-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-2">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-neutral-400 hover:text-blue-600 transition-colors font-bold text-sm mb-4 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> {step === 1 ? 'Quay lại Dashboard' : 'Bước trước đó'}
            </button>
            <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-neutral-900">Đặt lịch khám</h1>
          </div>
           
           <div className="flex items-center gap-6 p-4 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm w-full md:w-auto">
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div 
                     key={i} 
                     className={`h-3 rounded-full transition-all duration-700 ${step >= i ? 'bg-blue-600 w-12' : 'bg-neutral-100 w-4'}`}
                  ></div>
                ))}
              </div>
              <div className="border-l border-neutral-50 pl-6 text-right shrink-0">
                 <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest block leading-none mb-1">Tiến trình {step}/4</span>
                 <span className="font-black text-blue-600 text-xs uppercase tracking-tighter">
                    {step === 1 && 'Chọn bác sĩ'}
                    {step === 2 && 'Chọn ngày khám'}
                    {step === 3 && 'Chọn giờ trống'}
                    {step === 4 && 'Xác nhận'}
                 </span>
              </div>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center md:text-left space-y-3">
                <h2 className="text-3xl font-black font-display tracking-tight text-neutral-900">Đội ngũ chuyên gia</h2>
                <p className="text-neutral-400 font-bold text-lg">Lựa chọn bác sĩ để bắt đầu hành trình chăm sóc nụ cười.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {doctors.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => { setFormData({...formData, doctor: doc.name, doctorId: doc.id}); handleNext(); }}
                      className="bg-white p-8 rounded-[3rem] border border-neutral-100 shadow-sm hover:border-blue-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all text-left flex flex-col group relative overflow-hidden active:scale-[0.98]"
                    >
                       <div className="flex items-center gap-6 mb-8 relative z-10">
                          <div className="w-20 h-20 rounded-[1.5rem] bg-blue-50 overflow-hidden ring-4 ring-white shadow-lg transition-transform group-hover:scale-110">
                             <img src={`https://ui-avatars.com/api/?name=${doc.name}&background=eff6ff&color=2563eb&bold=true`} alt={doc.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-1">
                             <h4 className="font-black font-display text-neutral-900 text-xl tracking-tight leading-tight">{doc.name}</h4>
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{doc.specialty}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-4 relative z-10">
                          <div className="flex items-center justify-between text-xs font-bold text-neutral-400">
                             <div className="flex items-center gap-2"><Star size={14} className="text-amber-400" fill="currentColor" /> {doc.rating}</div>
                             <div className="flex items-center gap-2 underline uppercase tracking-widest text-[10px]">Xem hồ sơ</div>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-500">
                             <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest group-hover:text-blue-200 transition-colors">Kinh nghiệm</p>
                             <p className="font-black text-neutral-900 text-lg group-hover:text-white transition-colors">{doc.experience}</p>
                          </div>
                       </div>
                       
                       <ChevronRight size={60} className="absolute -right-6 -bottom-6 text-blue-500/5 group-hover:text-blue-500/10 transition-colors" />
                    </button>
                 ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto space-y-10"
            >
              <div className="text-center space-y-3">
                 <h2 className="text-3xl font-black font-display tracking-tight text-neutral-900">Chọn ngày khám</h2>
                 <p className="text-neutral-400 font-bold text-lg">Hẹn gặp bác sĩ {formData.doctor} vào ngày nào?</p>
              </div>

              <div className="bg-white p-10 lg:p-14 rounded-[4rem] border border-neutral-100 shadow-sm space-y-12">
                 <div className="space-y-6">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-3">
                       <CalendarIcon size={16} className="text-blue-600" /> Ngày làm việc dự kiến
                    </label>
                    <div className="flex flex-wrap gap-4 justify-center">
                       {[1, 2, 3, 4, 5, 6, 7].map(i => {
                          const d = new Date();
                          d.setDate(d.getDate() + i);
                          const dateStr = d.toISOString().split('T')[0];
                          const isSelected = formData.date === dateStr;
                          return (
                             <button
                               key={i}
                               onClick={() => { setFormData({...formData, date: dateStr}); handleNext(); }}
                               className={`w-28 h-36 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 border transition-all active:scale-95 ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/20' : 'bg-neutral-50 border-neutral-100 text-neutral-400 hover:border-blue-200'}`}
                             >
                                <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Th.{d.getMonth() + 1}</span>
                                <span className={`text-4xl font-black font-display ${isSelected ? 'text-white' : 'text-neutral-900'}`}>{d.getDate()}</span>
                                <span className="text-[10px] uppercase font-black tracking-widest">{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()]}</span>
                             </button>
                          )
                       })}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-[2rem] text-blue-700 border border-blue-100 shadow-inner">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                       <Info size={20} />
                    </div>
                    <p className="text-sm font-bold leading-relaxed">
                       Chúng tôi gợi ý các khung giờ trống gần nhất trong vòng 7 ngày tới dựa trên lịch làm việc của bác sĩ.
                    </p>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto space-y-10"
            >
              <div className="text-center space-y-3">
                 <h2 className="text-3xl font-black font-display tracking-tight text-neutral-900">Chọn khung giờ</h2>
                 <p className="text-neutral-400 font-bold text-lg">Bạn dự định đến vào mấy giờ ngày {formData.date}?</p>
              </div>

              <div className="bg-white p-10 lg:p-14 rounded-[4rem] border border-neutral-100 shadow-sm">
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {availableSlots.map(t => (
                       <button
                         key={t}
                         onClick={() => { setFormData({...formData, time: t}); handleNext(); }}
                         className={`py-6 rounded-[2rem] font-black font-display text-lg transition-all active:scale-95 border ${formData.time === t ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/20' : 'bg-neutral-50 border-neutral-100 text-neutral-500 hover:border-blue-200'}`}
                       >
                         {t}
                       </button>
                    ))}
                 </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto space-y-10"
            >
              <div className="text-center space-y-3">
                 <h2 className="text-3xl font-black font-display tracking-tight text-neutral-900">Xác nhận lịch hẹn</h2>
                 <p className="text-neutral-400 font-bold text-lg">Vui lòng kiểm tra kỹ thông tin trước khi hoàn tất.</p>
              </div>

              <div className="bg-white rounded-[3.5rem] border border-neutral-100 shadow-xl shadow-neutral-100/30 overflow-hidden">
                 <div className="p-10 lg:p-14 space-y-10">
                    <div className="flex items-center gap-8 pb-10 border-b border-neutral-50 relative">
                       <div className="w-20 h-20 rounded-[2rem] bg-blue-600 flex flex-col items-center justify-center text-white font-black font-display shadow-xl shadow-blue-500/20">
                          <span className="text-[10px] opacity-60 uppercase tracking-widest leading-none mb-1">Ngày</span>
                          <span className="text-3xl leading-none">{formData.date.split('-')[2]}</span>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest leading-none">Thời gian hẹn</p>
                          <p className="font-black text-neutral-900 text-2xl tracking-tighter uppercase whitespace-nowrap">Lúc {formData.time} • {formData.date}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8">
                       <div className="w-20 h-20 rounded-[2rem] bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300">
                          <User size={36} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest leading-none">Chuyên khoa / Bác sĩ</p>
                          <p className="font-black text-neutral-900 text-2xl tracking-tighter uppercase">{formData.doctor}</p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-6">Ghi chú quan trọng</p>
                       <textarea 
                          placeholder="Bạn có muốn lưu ý điều gì đặc biệt cho bác sĩ không?"
                          className="w-full p-8 bg-neutral-50 border border-neutral-100 rounded-[2.5rem] h-40 focus:outline-none focus:ring-4 focus:ring-blue-100/50 font-bold text-neutral-700 text-sm transition-all shadow-inner"
                          value={formData.note}
                          onChange={(e) => setFormData({...formData, note: e.target.value})}
                       ></textarea>
                    </div>
                 </div>

                 <button 
                   onClick={handleSubmit}
                   className="w-full py-8 bg-neutral-900 text-white font-black text-xs uppercase tracking-[0.25em] hover:bg-neutral-800 transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-2xl"
                 >
                    Xác nhận đặt lịch ngay <CheckCircle2 size={24} />
                 </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center space-y-12 py-10"
            >
              <div className="w-32 h-32 bg-green-50 text-green-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-green-100 relative">
                <CheckCircle2 size={64} strokeWidth={3} />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 animate-bounce">
                  <Star size={24} fill="currentColor" />
                </div>
              </div>
              
              <div className="space-y-4">
                 <h1 className="text-4xl lg:text-5xl font-black font-display tracking-tight text-neutral-900 uppercase">Thành công!</h1>
                 <p className="text-neutral-400 font-bold text-lg max-w-sm mx-auto leading-relaxed">
                   Mã lịch khám <strong className="text-blue-600 whitespace-nowrap">#DT-2026-X</strong> đã được hệ thống ghi nhận.
                 </p>
              </div>

              <div className="bg-amber-50 p-10 rounded-[3.5rem] border border-amber-100 text-left space-y-6 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm">
                      <Info size={24} />
                   </div>
                   <h3 className="text-xl font-black font-display text-amber-900 tracking-tight">Cần chuẩn bị gì?</h3>
                </div>
                <div className="space-y-4 relative z-10">
                   {[
                      'Đến trước 10-15 phút để hoàn tất thủ tục hành chính.',
                      'Mang theo thẻ Bảo Hiểm hoặc hồ sơ bệnh án cũ (nếu có).',
                      'Thông báo trước nếu bạn có triệu chứng sốt hoặc dị ứng mới.'
                   ].map((text, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                         <div className="w-6 h-6 rounded-full bg-amber-200/50 flex items-center justify-center text-amber-700 text-[10px] font-black shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors">{i+1}</div>
                         <p className="text-sm font-bold text-amber-800 leading-relaxed">{text}</p>
                      </div>
                   ))}
                </div>
                <div className="absolute right-[-10%] bottom-[-10%] opacity-5 text-amber-900 rotate-12">
                   <Calendar size={200} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                 <button 
                  onClick={() => navigate('/patient/dashboard')}
                  className="px-12 py-6 bg-neutral-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/20 active:scale-95"
                 >
                   Về Dashboard
                 </button>
                 <button 
                  onClick={() => navigate('/patient/appointments')}
                  className="px-12 py-6 bg-white border border-neutral-100 text-neutral-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
                 >
                   Xem tất cả lịch hẹn
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default BookAppointmentPage;
