import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DentistTreatmentListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const treatments = [
    { id: 'TR-001', patient: 'Lê Văn Tám', date: '04/05/2026', diagnosis: 'Sâu răng hàm số 46, viêm tủy cấp', teeth: '#46', status: 'completed' },
    { id: 'TR-002', patient: 'Nguyễn Thị Hoa', date: '08/05/2026', diagnosis: 'Điều trị tủy định kỳ, phục hồi răng sứ', teeth: '#12, #11', status: 'in_progress' },
    { id: 'TR-003', patient: 'Trần Văn B', date: '11/05/2026', diagnosis: 'Khám định kỳ, lấy cao răng', teeth: 'Nguyên hàm', status: 'planned' },
    { id: 'TR-004', patient: 'Phạm Minh C', date: '11/05/2026', diagnosis: 'Niềng răng Invisalign giai đoạn 1', teeth: 'Nguyên hàm', status: 'in_progress' },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="badge-pill bg-success-soft text-success">Completed</span>;
      case 'in_progress': return <span className="badge-pill bg-primary-soft text-primary">In Progress</span>;
      case 'planned': return <span className="badge-pill bg-neutral-soft text-muted">Planned</span>;
      case 'cancelled': return <span className="badge-pill bg-danger-soft text-danger">Cancelled</span>;
      default: return <span className="badge-pill bg-neutral-soft text-muted">{status}</span>;
    }
  };

  return (
    <AdminLayout title="Hồ sơ điều trị">
      <div className="treatment-list p-1">
        {/* Superior Actions Bar */}
        <div className="d-flex justify-content-between align-items-center mb-5">
           <div className="d-flex gap-3">
             <div className="search-bar-rounded shadow-sm">
               <Search size={18} className="text-muted" />
               <input type="text" placeholder="Tìm theo tên bệnh nhân hoặc mã hồ sơ..." />
             </div>
             <button className="btn-filter-luxury shadow-sm">
               <Filter size={18} />
               Bộ lọc nâng cao
             </button>
           </div>
           <button className="btn-create-luxury glow" onClick={() => navigate('/dentist/treatments/new')}>
              <Plus size={20} />
              Tạo hồ sơ điều trị
           </button>
        </div>

        {/* Content Card */}
        <div className="card shadow-luxury-clean border-0 overflow-hidden">
           <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-950 text-dark">Danh sách hồ sơ</h5>
                <p className="text-muted small fw-600 mb-0">Hiển thị 10 hồ sơ điều trị gần nhất</p>
              </div>
              <div className="status-tabs d-flex gap-2">
                 <button className="tab-item active">Tất cả</button>
                 <button className="tab-item">Đang tiến hành</button>
                 <button className="tab-item">Đã xong</button>
              </div>
           </div>
           <div className="card-body p-0">
             <div className="table-responsive">
               <table className="table table-modern align-middle mb-0">
                 <thead>
                   <tr>
                     <th className="px-4">MÃ HỒ SƠ</th>
                     <th>BỆNH NHÂN</th>
                     <th>NGÀY TẠO</th>
                     <th>CHẨN ĐOÁN</th>
                     <th>MÃ RĂNG</th>
                     <th>TRẠNG THÁI</th>
                     <th className="px-4 text-end">THAO TÁC</th>
                   </tr>
                 </thead>
                 <tbody>
                   {treatments.map((tr, i) => (
                     <tr key={tr.id}>
                       <td className="px-4">
                          <span className="id-tag-modern">{tr.id}</span>
                       </td>
                       <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="patient-avatar-mini">{tr.patient.charAt(0)}</div>
                            <span className="fw-800 text-dark">{tr.patient}</span>
                          </div>
                       </td>
                       <td>
                          <span className="fw-600 text-muted small">{tr.date}</span>
                       </td>
                       <td>
                          <p className="mb-0 small fw-600 text-muted diagnosis-truncate" title={tr.diagnosis}>
                            {tr.diagnosis}
                          </p>
                       </td>
                       <td>
                          <span className="teeth-tag">{tr.teeth}</span>
                       </td>
                       <td>
                          {getStatusBadge(tr.status)}
                       </td>
                       <td className="px-4 text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <button className="btn-icon-action" onClick={() => navigate(`/dentist/treatments/${tr.id}`)}>
                               <Eye size={18} />
                            </button>
                            <button className="btn-icon-action" onClick={() => navigate(`/dentist/treatments/${tr.id}/edit`)}>
                               <Edit2 size={18} />
                            </button>
                            <button className="btn-icon-action danger">
                               <Trash2 size={18} />
                            </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
           
           {/* Pagination */}
           <div className="card-footer bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
              <span className="small text-muted fw-700">Đang xem trang {currentPage} của 12</span>
              <div className="pagination-rounded shadow-sm">
                 <button className="page-btn"><ChevronLeft size={16} /></button>
                 <button className="page-btn active">1</button>
                 <button className="page-btn">2</button>
                 <button className="page-btn">3</button>
                 <span className="mx-2">...</span>
                 <button className="page-btn">12</button>
                 <button className="page-btn"><ChevronRight size={16} /></button>
              </div>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .treatment-list { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .fw-950 { font-weight: 1000; letter-spacing: -0.02em; }
        
        .search-bar-rounded { 
          display: flex; align-items: center; gap: 1rem; 
          background: white; padding: 0.875rem 1.75rem; 
          border-radius: 1.75rem; border: 1.5px solid #f1f5f9; 
          width: 380px; transition: all 0.3s ease;
        }
        .search-bar-rounded:focus-within { border-color: var(--primary-color); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.1); transform: translateY(-2px); }
        .search-bar-rounded input { border: none; outline: none; width: 100%; font-weight: 500; }

        .btn-filter-luxury { border: 1.5px solid #f1f5f9; background: white; padding: 0 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 0.75rem; }
        .btn-create-luxury { border: none; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 0 2rem; border-radius: 1.5rem; font-weight: 800; font-size: 0.9375rem; display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .btn-create-luxury:hover { transform: translateY(-3px) scale(1.02); filter: brightness(1.1); box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3); }

        .shadow-luxury-clean { box-shadow: 0 20px 60px rgba(0,0,0,0.03) !important; border-radius: 3rem !important; }
        
        .status-tabs { background: #f8fafc; padding: 0.375rem; border-radius: 1rem; }
        .tab-item { border: none; background: transparent; padding: 0.5rem 1.25rem; border-radius: 0.75rem; font-size: 0.8125rem; font-weight: 800; color: #94a3b8; transition: all 0.2s; }
        .tab-item.active { background: white; color: #2563eb; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        .table-modern thead th { padding: 1.75rem 1rem !important; font-size: 0.7rem; font-weight: 1000; color: #cbd5e1; letter-spacing: 0.1em; border-bottom: 2px solid #f8fafc; }
        .table-modern td { padding: 1.5rem 1rem !important; }
        .table-modern tbody tr { border-bottom: 1px solid #f1f5f9; }

        .id-tag-modern { font-family: var(--font-mono); font-weight: 950; color: #2563eb; background: #eff6ff; padding: 0.375rem 0.875rem; border-radius: 0.75rem; font-size: 0.8125rem; }
        .patient-avatar-mini { width: 2.5rem; height: 2.5rem; background: linear-gradient(135deg, #f8fafc, #e2e8f0); border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; font-weight: 1000; color: #64748b; }
        .diagnosis-truncate { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .teeth-tag { background: #f1f5f9; color: #475569; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 800; }

        .badge-pill { padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 900; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .bg-success-soft { background: #dcfce7; }
        .bg-primary-soft { background: #eff6ff; }
        .bg-neutral-soft { background: #f8fafc; }
        .bg-danger-soft { background: #fee2e2; }

        .btn-icon-action { width: 2.5rem; height: 2.5rem; border-radius: 0.875rem; border: none; background: #f8fafc; color: #64748b; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-icon-action:hover { background: #eff6ff; color: #2563eb; transform: rotate(5deg) scale(1.1); }
        .btn-icon-action.danger:hover { background: #fee2e2; color: #ef4444; }

        .pagination-rounded { background: white; padding: 0.375rem; border-radius: 1.25rem; border: 1.5px solid #f1f5f9; display: flex; align-items: center; gap: 0.25rem; }
        .page-btn { width: 2.5rem; height: 2.5rem; border: none; background: transparent; border-radius: 0.875rem; font-weight: 900; color: #64748b; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .page-btn.active { background: #2563eb; color: white; }
        .page-btn:hover:not(.active) { background: #f8fafc; color: #1e293b; }
      `}} />
    </AdminLayout>
  );
};

export default DentistTreatmentListPage;
