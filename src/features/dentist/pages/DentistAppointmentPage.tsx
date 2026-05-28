import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  Calendar, 
  List, 
  Search, 
  Filter, 
  Clock, 
  User, 
  MapPin, 
  ChevronRight,
  CheckCircle,
  PlayCircle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DentistAppointmentPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState('all');

  const appointments = [
    { id: 1, time: '08:00', patientId: 'PAT-001', patient: 'Lê Văn Tám', chair: 'Ghế 01', note: 'Nhổ răng khôn', status: 'done' },
    { id: 2, time: '09:30', patientId: 'PAT-012', patient: 'Nguyễn Thị Hoa', chair: 'Ghế 02', note: 'Điều trị tủy phiên 3', status: 'in_progress' },
    { id: 3, time: '11:00', patientId: 'PAT-025', patient: 'Trần Văn B', chair: 'Ghế 01', note: 'Khám định kỳ', status: 'confirmed' },
    { id: 4, time: '14:00', patientId: 'PAT-044', patient: 'Phạm Minh C', chair: 'Ghế 03', note: 'Lấy cao răng', status: 'confirmed' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'done': return 'status-done';
      case 'in_progress': return 'status-progress';
      case 'confirmed': return 'status-confirmed';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'done': return 'Hoàn thành';
      case 'in_progress': return 'Đang khám';
      case 'confirmed': return 'Chờ khám';
      default: return status;
    }
  };

  return (
    <AdminLayout title="Lịch hẹn của Bác sĩ">
      <div className="dentist-appointments p-1">
        {/* Header Actions */}
        <div className="d-flex justify-content-between align-items-center mb-5">
           <div className="search-box-modern shadow-sm">
             <Search size={18} className="text-muted" />
             <input type="text" placeholder="Tìm tên bệnh nhân, ghi chú..." />
           </div>
           <div className="d-flex gap-3">
             <div className="view-switcher shadow-sm">
                <button 
                  className={viewMode === 'calendar' ? 'active' : ''} 
                  onClick={() => setViewMode('calendar')}
                >
                  <Calendar size={18} />
                </button>
                <button 
                  className={viewMode === 'list' ? 'active' : ''} 
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
             </div>
             <button className="btn-filter-modern shadow-sm">
                <Filter size={18} />
                Bộ lọc
             </button>
           </div>
        </div>

        {/* Filters/Date Selection */}
        <div className="d-flex justify-content-between align-items-end mb-4">
           <div>
             <h4 className="fw-950 text-dark mb-1">Thứ Hai, 11 Tháng 5</h4>
             <p className="text-muted small fw-600 mb-0">Bạn có 4 cuộc hẹn đã lên lịch cho hôm nay</p>
           </div>
           <div className="status-legend d-flex gap-4">
              <div className="legend-item"><span className="dot confirmed"></span> Chờ khám</div>
              <div className="legend-item"><span className="dot progress"></span> Đang khám</div>
              <div className="legend-item"><span className="dot done"></span> Hoàn thành</div>
           </div>
        </div>

        {viewMode === 'list' ? (
          <div className="card shadow-luxury-clean border-0 overflow-hidden">
             <div className="table-responsive">
               <table className="table table-modern align-middle mb-0">
                 <thead>
                   <tr>
                     <th className="px-4">GIỜ HẸN</th>
                     <th>BỆNH NHÂN</th>
                     <th>GHẾ KHÁM</th>
                     <th>GHI CHÚ</th>
                     <th>TRẠNG THÁI</th>
                     <th className="px-4 text-end">THAO TÁC</th>
                   </tr>
                 </thead>
                 <tbody>
                   {appointments.map((appt) => (
                     <tr key={appt.id}>
                       <td className="px-4">
                          <div className="time-display">
                            <Clock size={16} className="text-primary-soft" />
                            <span className="fw-900">{appt.time}</span>
                          </div>
                       </td>
                       <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-circle-sm">{appt.patient.charAt(0)}</div>
                            <div className="patient-info">
                              <span className="fw-800 text-dark d-block mb-1">{appt.patient}</span>
                              <span className="extra-small text-muted">{appt.patientId}</span>
                            </div>
                          </div>
                       </td>
                       <td>
                          <div className="chair-pill">
                            <MapPin size={14} />
                            {appt.chair}
                          </div>
                       </td>
                       <td>
                          <p className="mb-0 text-muted small fw-600 truncate-text">{appt.note}</p>
                       </td>
                       <td>
                          <span className={`status-pill-modern ${getStatusStyle(appt.status)}`}>
                            {getStatusLabel(appt.status)}
                          </span>
                       </td>
                       <td className="px-4 text-end">
                          <div className="d-flex gap-2 justify-content-end align-items-center">
                            {appt.status === 'confirmed' && (
                              <button className="btn-action-start" title="Bắt đầu khám">
                                <PlayCircle size={18} />
                                Bắt đầu
                              </button>
                            )}
                            {appt.status === 'in_progress' && (
                              <button className="btn-action-done" title="Hoàn thành">
                                <CheckCircle size={18} />
                                Hoàn thành
                              </button>
                            )}
                            <button className="btn-icon-square" onClick={() => navigate(`/dentist/patients/${appt.patientId}`)} title="Hồ sơ bệnh nhân">
                              <User size={18} />
                            </button>
                            {(appt.status === 'in_progress' || appt.status === 'done') && (
                              <button className="btn-icon-square pulse-primary" onClick={() => navigate('/dentist/treatments/new')} title="Tạo hồ sơ điều trị">
                                <Plus size={18} />
                              </button>
                            )}
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        ) : (
          <div className="calendar-view-placeholder card shadow-luxury-clean border-0 p-5 text-center">
             <div className="empty-state-icon mx-auto mb-4">
               <Calendar size={48} className="text-primary-soft" />
             </div>
             <h5 className="fw-950">Chế độ xem lịch</h5>
             <p className="text-muted">Tính năng xem lịch theo tuần/ngày đang được phát triển.</p>
             <button className="btn btn-primary rounded-pill px-4 mt-3" onClick={() => setViewMode('list')}>
               Quay lại danh sách
             </button>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dentist-appointments { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .fw-950 { font-weight: 1000; letter-spacing: -0.02em; }
        
        .search-box-modern { 
          display: flex; align-items: center; gap: 1rem; 
          background: white; padding: 0.875rem 1.75rem; 
          border-radius: 1.75rem; border: 1.5px solid #f1f5f9; 
          width: 420px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .search-box-modern:focus-within { border-color: var(--primary-color); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.1); transform: translateY(-2px); }
        .search-box-modern input { border: none; outline: none; width: 100%; font-weight: 500; color: #1e293b; }

        .view-switcher { background: white; padding: 0.4rem; border-radius: 1rem; border: 1.5px solid #f1f5f9; display: flex; gap: 0.5rem; }
        .view-switcher button { width: 2.75rem; height: 2.75rem; border: none; background: transparent; border-radius: 0.75rem; color: #94a3b8; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .view-switcher button.active { background: #eff6ff; color: #2563eb; }

        .btn-filter-modern { border: 1.5px solid #f1f5f9; background: white; padding: 0 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 0.75rem; transition: all 0.2s; }
        .btn-filter-modern:hover { background: #f8fafc; border-color: #cbd5e1; }

        .status-legend { font-size: 0.8125rem; font-weight: 700; color: #64748b; }
        .legend-item { display: flex; align-items: center; gap: 0.5rem; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.confirmed { background: #2563eb; }
        .dot.progress { background: #f59e0b; }
        .dot.done { background: #10b981; }

        .shadow-luxury-clean { box-shadow: 0 20px 60px rgba(0,0,0,0.03) !important; border-radius: 3rem !important; }
        .table-modern thead th { background: white; padding: 1.75rem 1rem !important; font-size: 0.75rem; font-weight: 1000; color: #cbd5e1; letter-spacing: 0.1em; border-bottom: 2.5px solid #f8fafc; }
        .table-modern tbody tr { transition: all 0.2s; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
        .table-modern tbody tr:hover { background: #f8fafc; }
        .table-modern td { padding: 1.5rem 1rem !important; }

        .time-display { display: flex; align-items: center; gap: 0.75rem; color: #2563eb; }
        .text-primary-soft { opacity: 0.4; }
        
        .avatar-circle-sm { width: 2.75rem; height: 2.75rem; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 1rem; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #64748b; }
        .patient-info .extra-small { font-size: 0.75rem; font-weight: 800; }
        
        .chair-pill { background: #f1f5f9; color: #475569; padding: 0.375rem 0.875rem; border-radius: 0.875rem; display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; font-weight: 800; }
        .truncate-text { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .status-pill-modern { padding: 0.5rem 1.25rem; border-radius: 9999px; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; }
        .status-done { background: #dcfce7; color: #166534; }
        .status-progress { background: #fffbeb; color: #b45309; }
        .status-confirmed { background: #eff6ff; color: #1e40af; }

        .btn-action-start { background: #2563eb; color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 1rem; font-weight: 900; font-size: 0.8125rem; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-action-start:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
        .btn-action-done { background: #10b981; color: white; border: none; padding: 0.625rem 1.25rem; border-radius: 1rem; font-weight: 900; font-size: 0.8125rem; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-action-done:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(16, 163, 127, 0.2); }

        .btn-icon-square { width: 2.75rem; height: 2.75rem; background: #f1f5f9; border: none; border-radius: 1rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-icon-square:hover { background: #e2e8f0; color: #1e293b; transform: rotate(5deg) scale(1.1); }
        .pulse-primary { border: 1.5px solid #dbeafe; color: #2563eb; background: white; }
        .pulse-primary:hover { border-color: #2563eb; background: #eff6ff; }
        
        .empty-state-icon { width: 6rem; height: 6rem; background: #f0f7ff; border-radius: 2.5rem; display: flex; align-items: center; justify-content: center; }
      `}} />
    </AdminLayout>
  );
};

export default DentistAppointmentPage;
