import React from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clipboard, 
  Activity, 
  FileText,
  ChevronRight,
  Info,
  Clock,
  Heart,
  Droplet
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const DentistPatientProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const patient = {
    id: id || 'PAT-001',
    name: 'Lê Văn Tám',
    dob: '12/04/1998',
    gender: 'Nam',
    phone: '0987-XXX-XXX',
    address: 'Q3, TP. Hồ Chí Minh',
    medicalHistory: 'Dị ứng nhẹ với thuốc gây tê Lidocaine. Từng mắc viêm nha chu năm 2024.',
    bloodGroup: 'AB+',
    heartRate: '72 bpm'
  };

  const treatments = [
    { id: 'TR-001', date: '04/05/2026', title: 'Điều trị tủy răng số 46', doctor: 'Dr. Nguyễn Văn A', status: 'in_progress' },
    { id: 'TR-000', date: '15/02/2024', title: 'Cạo vôi răng định kỳ', doctor: 'Dr. Trần Thị B', status: 'completed' },
  ];

  return (
    <AdminLayout title="Hồ sơ bệnh nhân">
      <div className="dentist-patient-profile p-1 pb-5">
        <div className="mb-5">
           <button className="btn-back-luxury" onClick={() => navigate(-1)}>
             <ArrowLeft size={18} />
             Quay lại
           </button>
        </div>

        <div className="row g-5">
           {/* Left Column: Personal Info */}
           <div className="col-lg-4">
              <div className="card shadow-luxury-clean border-0 text-center p-4 mb-4 user-profile-card">
                 <div className="profile-avatar-giant mx-auto mb-4">L</div>
                 <h4 className="fw-1000 text-dark mb-1">{patient.name}</h4>
                 <span className="badge-id-large mb-4">Mã BN: {patient.id}</span>
                 
                 <div className="profile-meta-grid text-start mt-4">
                    <div className="meta-item-luxury">
                       <Calendar size={18} />
                       <div>
                          <label>Ngày sinh</label>
                          <p>{patient.dob}</p>
                       </div>
                    </div>
                    <div className="meta-item-luxury">
                       <User size={18} />
                       <div>
                          <label>Giới tính</label>
                          <p>{patient.gender}</p>
                       </div>
                    </div>
                    <div className="meta-item-luxury">
                       <Phone size={18} />
                       <div>
                          <label>Số điện thoại</label>
                          <p>{patient.phone}</p>
                       </div>
                    </div>
                    <div className="meta-item-luxury">
                       <MapPin size={18} />
                       <div>
                          <label>Địa chỉ</label>
                          <p>{patient.address}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="card shadow-luxury-clean border-0 mb-4 bg-primary text-white health-quick-stats">
                 <div className="card-body p-4">
                    <h6 className="fw-950 mb-3 uppercase letter-spacing-1 small opacity-75">Chỉ số sức khỏe</h6>
                    <div className="d-flex justify-content-between">
                       <div className="health-box">
                          <Droplet size={20} />
                          <span className="label">Nhóm máu</span>
                          <span className="value">{patient.bloodGroup}</span>
                       </div>
                       <div className="divider-v"></div>
                       <div className="health-box">
                          <Heart size={20} />
                          <span className="label">Nhịp tim</span>
                          <span className="value">{patient.heartRate}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Medical Record */}
           <div className="col-lg-8">
              <div className="card shadow-luxury-clean border-0 mb-4">
                 <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                    <h5 className="fw-1000 text-dark uppercase letter-spacing-1 d-flex align-items-center gap-3">
                       <div className="icon-box-primary-sm"><Clipboard size={20} /></div>
                       Tiền sử bệnh lý
                    </h5>
                 </div>
                 <div className="card-body p-4">
                    <div className="medical-history-box p-4 bg-light rounded-4">
                       <p className="mb-0 fw-600 text-dark-soft line-height-relaxed">
                          {patient.medicalHistory}
                       </p>
                    </div>
                    <div className="alert-info-luxury mt-4">
                       <Info size={18} />
                       <p className="mb-0 small fw-700">Dữ liệu tiền sử bệnh được cập nhật lần cuối bởi Điều dưỡng vào 10/05/2026.</p>
                    </div>
                 </div>
              </div>

              <div className="card shadow-luxury-clean border-0 mb-4">
                 <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                    <h5 className="fw-1000 text-dark uppercase letter-spacing-1 d-flex align-items-center gap-3">
                       <div className="icon-box-primary-sm"><Activity size={20} /></div>
                       Lịch sử điều trị
                    </h5>
                 </div>
                 <div className="card-body p-4">
                    <div className="treatment-history-list">
                       {treatments.map((tr, i) => (
                         <div key={i} className="treatment-history-item p-3 rounded-4 mb-3 border-light-2" onClick={() => navigate(`/dentist/treatments/${tr.id}`)}>
                            <div className="d-flex justify-content-between align-items-center">
                               <div className="d-flex gap-4 align-items-center">
                                  <div className="date-box">
                                     <span className="day">{tr.date.split('/')[0]}</span>
                                     <span className="month">Th{tr.date.split('/')[1]}</span>
                                  </div>
                                  <div>
                                     <h6 className="fw-950 text-dark mb-1">{tr.title}</h6>
                                     <p className="text-muted extra-small mb-0">BS thực hiện: {tr.doctor}</p>
                                  </div>
                               </div>
                               <div className="d-flex align-items-center gap-3">
                                  <span className={`status-pill ${tr.status}`}>
                                     {tr.status === 'in_progress' ? 'Đang điều trị' : 'Hoàn thành'}
                                  </span>
                                  <ChevronRight size={18} className="text-muted" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="card shadow-luxury-clean border-0">
                 <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                    <h5 className="fw-1000 text-dark uppercase letter-spacing-1 d-flex align-items-center gap-3">
                       <div className="icon-box-primary-sm"><Clock size={20} /></div>
                       Lịch hẹn sắp tới
                    </h5>
                 </div>
                 <div className="card-body p-4">
                    <div className="p-4 border-dashed rounded-4 text-center">
                       <Calendar size={32} className="text-muted mb-2" />
                       <p className="mb-0 text-muted fw-700">Không có lịch hẹn nào sắp tới.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dentist-patient-profile { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .btn-back-luxury { border: none; background: white; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        
        .shadow-luxury-clean { box-shadow: 0 20px 60px rgba(0,0,0,0.03) !important; border-radius: 3rem !important; }
        .user-profile-card { border-top: 6px solid #2563eb; }
        .profile-avatar-giant { width: 6.5rem; height: 6.5rem; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; border-radius: 2.25rem; display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 1000; box-shadow: 0 15px 35px rgba(37, 99, 235, 0.2); }
        .badge-id-large { background: #f1f5f9; color: #475569; padding: 0.5rem 1.25rem; border-radius: 1rem; font-weight: 900; font-size: 0.8125rem; font-family: var(--font-mono); }
        
        .profile-meta-grid { display: flex; flex-direction: column; gap: 1.5rem; }
        .meta-item-luxury { display: flex; align-items: center; gap: 1.25rem; }
        .meta-item-luxury svg { color: #2563eb; opacity: 0.5; }
        .meta-item-luxury label { font-size: 0.6875rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 0; }
        .meta-item-luxury p { font-size: 1rem; font-weight: 800; color: #1e293b; margin-bottom: 0; }

        .health-quick-stats { border-radius: 2.5rem !important; }
        .health-box { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; flex: 1; }
        .health-box .label { font-size: 0.625rem; font-weight: 900; opacity: 0.6; text-transform: uppercase; }
        .health-box .value { font-size: 1.25rem; font-weight: 1000; }
        .divider-v { width: 1px; background: rgba(255,255,255,0.2); }

        .icon-box-primary-sm { width: 2.75rem; height: 2.75rem; background: #eff6ff; color: #2563eb; border-radius: 1rem; display: flex; align-items: center; justify-content: center; }
        .medical-history-box { border-left: 5px solid #2563eb; }
        .text-dark-soft { color: #334155; }
        .line-height-relaxed { line-height: 1.7; }
        
        .alert-info-luxury { background: #eff6ff; color: #2563eb; padding: 1.25rem; border-radius: 1.5rem; display: flex; gap: 1rem; align-items: center; }

        .treatment-history-item { border: 1.5px solid #f8fafc; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
        .treatment-history-item:hover { transform: translateY(-3px); border-color: #dbeafe; background: #fcfcfd; box-shadow: 0 15px 35px rgba(0,0,0,0.03); }
        .date-box { background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 1rem; display: flex; flex-direction: column; align-items: center; min-width: 65px; }
        .date-box .day { font-size: 1.25rem; font-weight: 1000; color: #1e293b; line-height: 1; }
        .date-box .month { font-size: 0.6875rem; font-weight: 900; color: #2563eb; text-transform: uppercase; }
        
        .status-pill { padding: 0.375rem 1rem; border-radius: 9999px; font-weight: 900; font-size: 0.7rem; text-transform: uppercase; }
        .status-pill.in_progress { background: #eff6ff; color: #2563eb; }
        .status-pill.completed { background: #dcfce7; color: #166534; }

        .border-dashed { border: 2.5px dashed #f1f5f9; }
        
        .fw-1000 { font-weight: 1000; }
        .letter-spacing-1 { letter-spacing: 0.1em; }
        .uppercase { text-transform: uppercase; }
        .extra-small { font-size: 0.75rem; font-weight: 800; }
      `}} />
    </AdminLayout>
  );
};

export default DentistPatientProfilePage;
