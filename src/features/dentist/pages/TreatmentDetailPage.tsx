import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Clock, 
  CheckCircle, 
  FileText, 
  Pill, 
  Stethoscope,
  ChevronRight,
  User,
  Activity,
  Calendar,
  AlertCircle,
  Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TreatmentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  const treatment = {
    id: id || 'TR-001',
    patient: 'Lê Văn Tám',
    doctor: 'Bác sĩ Nguyễn Văn A',
    date: '04/05/2026',
    status: 'in_progress',
    diagnosis: 'Sâu răng hàm số 46, viêm tủy cấp tính.',
    notes: 'Bệnh nhân có tiền sử nhạy cảm với thuốc tê nhẹ. Cần theo dõi phản ứng sau mỗi phiên.',
    teeth: [46],
    totalAmount: 3500000,
    hasInvoice: false
  };

  const sessions = [
    { date: '04/05/2026', title: 'Phiên 1: Khám & Diagnosis', note: 'Chụp X-ray, xác định sâu răng số 46. Tư vấn điều trị tủy.', appt: 'Hẹn 08:00' },
    { date: '08/05/2026', title: 'Phiên 2: Mở tủy & Làm sạch', note: 'Đã mở buồng tủy, lấy tủy buồng. Đặt thuốc diệt tủy.', appt: 'Hẹn 09:30' },
  ];

  const prescriptions = [
    { id: 'PRES-123', date: '08/05/2026', medicines: 'Amoxicillin, Paracetamol' }
  ];

  return (
    <AdminLayout title="Chi tiết hồ sơ điều trị">
      <div className="treatment-detail p-1 pb-5">
        {/* Superior Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
           <button className="btn-back-luxury" onClick={() => navigate('/dentist/treatments')}>
             <ArrowLeft size={18} />
             Danh sách hồ sơ
           </button>
           <div className="d-flex gap-3">
             <button className="btn-action-outline-luxury" onClick={() => navigate(`/dentist/treatments/${id}/edit`)}>
               <Edit size={18} />
               Sửa hồ sơ
             </button>
             <button className="btn-action-primary glow" onClick={() => navigate(`/dentist/treatments/${id}/prescriptions/new`)}>
               <Pill size={18} />
               Kê đơn thuốc
             </button>
           </div>
        </div>

        {/* Identity Section */}
        <div className="card shadow-luxury-clean border-0 mb-5 overflow-hidden identity-header-card">
           <div className="card-body p-0">
              <div className="row g-0">
                 <div className="col-md-4 bg-primary-dark p-4 text-white d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                       <div className="avatar-circle-lg">T</div>
                       <div>
                          <h4 className="fw-950 mb-0">{treatment.patient}</h4>
                          <span className="text-white-50 small fw-700">Mã BN: #BN-1029</span>
                       </div>
                    </div>
                    <div className="mt-5">
                       <span className="badge-status-luxury">
                         <div className="dot pulse"></div>
                         {treatment.status === 'in_progress' ? 'Đang điều trị' : 'Hoàn thành'}
                       </span>
                    </div>
                 </div>
                 <div className="col-md-8 p-4 bg-white d-flex align-items-center">
                    <div className="row w-100 g-4">
                       <div className="col-sm-4">
                          <label className="meta-label">Bác sĩ phụ trách</label>
                          <div className="d-flex align-items-center gap-2">
                             <Stethoscope size={16} className="text-primary" />
                             <span className="fw-800 text-dark">{treatment.doctor}</span>
                          </div>
                       </div>
                       <div className="col-sm-4">
                          <label className="meta-label">Ngày khởi tạo</label>
                          <div className="d-flex align-items-center gap-2">
                             <Calendar size={16} className="text-primary" />
                             <span className="fw-800 text-dark">{treatment.date}</span>
                          </div>
                       </div>
                       <div className="col-sm-4">
                          <label className="meta-label">Tổng chi phí dự kiến</label>
                          <div className="d-flex align-items-center gap-2">
                             <span className="fw-1000 fs-5 text-primary">{treatment.totalAmount.toLocaleString()} đ</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Tab System */}
        <div className="luxury-tabs-container mb-4">
           <button className={`luxury-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Tổng quan</button>
           <button className={`luxury-tab ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}>Phiên điều trị</button>
           <button className={`luxury-tab ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')}>Đơn thuốc</button>
           <button className={`luxury-tab ${activeTab === 'invoice' ? 'active' : ''}`} onClick={() => setActiveTab('invoice')}>Hóa đơn</button>
        </div>

        {/* Tab Contents */}
        <div className="tab-content-luxury">
           {activeTab === 'overview' && (
             <div className="row g-4 fade-in">
                <div className="col-lg-8">
                   <div className="card shadow-luxury-clean border-0 h-100">
                      <div className="card-body p-4">
                         <h6 className="fw-1000 text-dark uppercase letter-spacing-1 mb-4">Thông tin bệnh lý</h6>
                         <div className="mb-5">
                            <label className="info-label">Chẩn đoán lâm sàng</label>
                            <div className="p-3 bg-light rounded-4 border-start-primary">
                               <p className="mb-0 fw-800 text-dark">{treatment.diagnosis}</p>
                            </div>
                         </div>
                         <div className="mb-5">
                            <label className="info-label">Ghi chú chi tiết</label>
                            <p className="text-muted fw-500">{treatment.notes}</p>
                         </div>
                         <h6 className="fw-1000 text-dark uppercase letter-spacing-1 mb-4">Dịch vụ đã chỉ định</h6>
                         <div className="table-responsive">
                            <table className="table table-modern-simple">
                               <thead>
                                  <tr>
                                     <th>Dịch vụ</th>
                                     <th className="text-end">Đơn giá</th>
                                     <th className="text-end">SL</th>
                                     <th className="text-end">Thành tiền</th>
                                  </tr>
                               </thead>
                               <tbody>
                                  <tr>
                                     <td className="fw-800 text-dark">Điều trị tủy răng hàm</td>
                                     <td className="text-end">1,500,000</td>
                                     <td className="text-end">1</td>
                                     <td className="text-end fw-900">1,500,000</td>
                                  </tr>
                                  <tr>
                                     <td className="fw-800 text-dark">Chụp X-ray chẩn đoán</td>
                                     <td className="text-end">200,000</td>
                                     <td className="text-end">1</td>
                                     <td className="text-end fw-900">200,000</td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="col-lg-4">
                   <div className="card shadow-luxury-clean border-0 tooth-viz-card h-100">
                      <div className="card-body p-4 text-center">
                         <h6 className="fw-1000 text-dark uppercase letter-spacing-1 mb-4">Vị trí điều trị</h6>
                         <div className="tooth-chart-mini-viz border rounded-4 p-4 mb-4">
                            <Activity size={48} className="text-primary-soft mb-2" />
                            <p className="mb-0 fw-950 text-primary">RĂNG SỐ #46</p>
                         </div>
                         <div className="alert-luxury-blue text-start">
                            <div className="d-flex gap-2">
                               <Info size={16} className="mt-1 flex-shrink-0" />
                               <p className="small mb-0 fw-600">Bạn đã hoàn thành 2 trên 4 phiên dự kiến cho răng này.</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'sessions' && (
             <div className="card shadow-luxury-clean border-0 fade-in">
                <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                   <h6 className="fw-1000 text-dark uppercase letter-spacing-1">Tiến trình điều trị</h6>
                   <button className="btn-add-session">
                      <Plus size={16} /> Thêm phiên mới
                   </button>
                </div>
                <div className="card-body p-4">
                   <div className="treatment-timeline">
                      {sessions.map((s, i) => (
                        <div key={i} className="session-card">
                           <div className="session-left">
                              <span className="session-date">{s.date}</span>
                              <span className="session-appt-tag">{s.appt}</span>
                           </div>
                           <div className="session-marker">
                              <div className="marker-dot"></div>
                           </div>
                           <div className="session-right">
                              <h6 className="fw-900 text-dark mb-1">{s.title}</h6>
                              <p className="text-muted small mb-0">{s.note}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'prescriptions' && (
              <div className="card shadow-luxury-clean border-0 fade-in">
                 <div className="card-body p-4">
                   {prescriptions.map((p, i) => (
                     <div key={i} className="prescription-item-luxury d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-4">
                           <div className="box-pill"><Pill size={20} /></div>
                           <div>
                              <h6 className="fw-900 mb-1">{p.id}</h6>
                              <p className="text-muted small mb-0">Ngày kê: {p.date} • {p.medicines}</p>
                           </div>
                        </div>
                        <button className="btn-icon-link-luxury"><ChevronRight size={20} /></button>
                     </div>
                   ))}
                 </div>
              </div>
           )}

           {activeTab === 'invoice' && (
             <div className="card shadow-luxury-clean border-0 p-5 text-center fade-in">
                <div className="box-invoice-empty mx-auto mb-4">
                   <FileText size={48} className="text-muted" />
                </div>
                <h5 className="fw-950">Chưa có hóa đơn</h5>
                <p className="text-muted">Hồ sơ điều trị này chưa được lập hóa đơn thanh toán.</p>
                <div className="d-flex justify-content-center mt-3">
                   <button className="btn-luxury-invoice" disabled>Lập hóa đơn (Yêu cầu Hoàn thành)</button>
                </div>
             </div>
           )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .treatment-detail { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .btn-back-luxury { border: none; background: white; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: all 0.2s; }
        .btn-action-outline-luxury { border: 1.5px solid #2563eb; background: white; color: #2563eb; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; transition: all 0.2s; }
        .btn-action-primary { border: none; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 0.75rem 2rem; border-radius: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .btn-action-primary.glow { box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25); }

        .bg-primary-dark { background: linear-gradient(135deg, #1e293b, #0f172a); }
        .avatar-circle-lg { width: 4.5rem; height: 4.5rem; background: rgba(255,255,255,0.1); border: 2px solid rgba(255,255,255,0.2); border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 1000; }
        
        .badge-status-luxury { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 0.5rem 1.25rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.75rem; font-size: 0.8125rem; font-weight: 800; color: #cbd5e1; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #2563eb; }
        .dot.pulse { animation: pulseAnim 2s infinite; }
        @keyframes pulseAnim { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); } 70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); } }

        .meta-label { font-size: 0.6875rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem; }
        
        .luxury-tabs-container { display: flex; gap: 1rem; border-bottom: 1px solid #f1f5f9; padding-bottom: 2px; }
        .luxury-tab { border: none; background: transparent; padding: 1rem 1.5rem; font-weight: 800; color: #94a3b8; position: relative; transition: all 0.2s; }
        .luxury-tab.active { color: #1e293b; }
        .luxury-tab:after { content: ""; position: absolute; bottom: -2px; left: 0; width: 0%; height: 3px; background: #2563eb; transition: all 0.3s; border-radius: 10px; }
        .luxury-tab.active:after { width: 100%; }

        .info-label { font-size: 0.8125rem; font-weight: 950; color: #64748b; text-transform: uppercase; margin-bottom: 1rem; display: block; }
        .border-start-primary { border-left: 4px solid #2563eb; }
        
        .table-modern-simple th { border-bottom: 2px solid #f8fafc; font-size: 0.7rem; font-weight: 1000; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.1em; padding: 1.25rem 1rem !important; }
        .table-modern-simple td { padding: 1.25rem 1rem !important; border-bottom: 1px solid #f8fafc; }

        .tooth-chart-mini-viz { background: #fcfcfd; border-color: #f1f5f9 !important; }
        .alert-luxury-blue { background: #eff6ff; color: #2563eb; padding: 1.25rem; border-radius: 1.5rem; }

        .btn-add-session { border: none; background: #f1f5f9; color: #475569; padding: 0.5rem 1.25rem; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; transition: all 0.2s; }
        .btn-add-session:hover { background: #e2e8f0; }

        .treatment-timeline { position: relative; padding-left: 120px; }
        .treatment-timeline:before { content: ""; position: absolute; left: 135px; top: 0; bottom: 0; width: 2px; background: #f1f5f9; }
        .session-card { display: flex; align-items: flex-start; gap: 3rem; margin-bottom: 3rem; position: relative; }
        .session-left { width: 100px; display: flex; flex-direction: column; align-items: flex-end; position: absolute; left: -120px; text-align: right; }
        .session-date { font-weight: 950; color: #1e293b; font-size: 0.875rem; }
        .session-appt-tag { font-size: 0.6875rem; font-weight: 800; color: #2563eb; background: #eff6ff; padding: 0.125rem 0.5rem; border-radius: 4px; margin-top: 4px; }
        .session-marker { width: 32px; height: 32px; background: white; border: 2px solid #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1; }
        .marker-dot { width: 12px; height: 12px; background: #cbd5e1; border-radius: 2px; transform: rotate(45deg); }
        .session-card:first-child .marker-dot { background: #2563eb; }
        .session-card:first-child .session-marker { border-color: #dbeafe; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05); }

        .prescription-item-luxury { padding: 1.5rem; background: #fcfcfd; border-radius: 1.75rem; border: 1px solid #f1f5f9; margin-bottom: 1rem; transition: all 0.2s; }
        .prescription-item-luxury:hover { transform: scale(1.01); background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.03); border-color: #dbeafe; }
        .box-pill { width: 3rem; height: 3rem; background: #eff6ff; color: #2563eb; border-radius: 1rem; display: flex; align-items: center; justify-content: center; }
        .btn-icon-link-luxury { width: 2.5rem; height: 2.5rem; border: none; background: white; color: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        .box-invoice-empty { width: 6rem; height: 6rem; background: #f8fafc; border-radius: 2rem; display: flex; align-items: center; justify-content: center; }
        .btn-luxury-invoice { border: none; background: #1e293b; color: white; padding: 0.875rem 2rem; border-radius: 1.25rem; font-weight: 800; font-size: 0.875rem; opacity: 0.5; cursor: not-allowed; }

        .fw-1000 { font-weight: 1000; }
        .letter-spacing-1 { letter-spacing: 0.05em; }
        .uppercase { text-transform: uppercase; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
      `}} />
    </AdminLayout>
  );
};

export default TreatmentDetailPage;
