import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  ArrowLeft, 
  Save, 
  Printer, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Info,
  Pill,
  Search,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PrescriptionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [items, setItems] = useState([
    { id: 1, medicine: 'Amoxicillin 500mg', stock: 120, expiry: '12/2027', qty: 20, dosage: 'Sáng 1, Chiều 1 sau ăn', warning: null },
    { id: 2, medicine: 'Paracetamol 500mg', stock: 15, expiry: '06/2026', qty: 10, dosage: 'Uống khi đau, cách nhau 6h', warning: 'stock' },
  ]);

  const addItem = () => {
    setItems([...items, { 
      id: Date.now(), 
      medicine: '', 
      stock: 0, 
      expiry: '', 
      qty: 0, 
      dosage: '', 
      warning: null 
    }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <AdminLayout title="Kê đơn thuốc">
      <div className="prescription-page p-1 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
           <button className="btn-back-luxury" onClick={() => navigate(-1)}>
             <ArrowLeft size={18} />
             Quay lại hồ sơ
           </button>
           <div className="d-flex gap-3">
             <button className="btn-print shadow-sm">
               <Printer size={18} />
               In đơn thuốc
             </button>
             <button className="btn-save-luxury shadow-lg focus-glow">
               <Save size={18} />
               Lưu & Hoàn tất
             </button>
           </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-luxury-clean border-0">
               <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                  <h5 className="fw-1000 text-dark uppercase letter-spacing-1 d-flex align-items-center gap-3">
                    <div className="icon-box-primary-sm"><Pill size={20} /></div>
                    Chi tiết đơn thuốc
                  </h5>
                  <button className="btn-add-item" onClick={addItem}>
                    <Plus size={16} /> Thêm thuốc
                  </button>
               </div>
               <div className="card-body p-4">
                  <div className="table-responsive">
                     <table className="table table-modern-form align-middle">
                        <thead>
                           <tr>
                              <th style={{ width: '35%' }}>Tên thuốc / Hàm lượng</th>
                              <th className="text-center">Số lượng</th>
                              <th>Cách dùng / Liều dùng</th>
                              <th className="text-end"></th>
                           </tr>
                        </thead>
                        <tbody>
                           {items.map((item) => (
                             <tr key={item.id} className={item.warning ? 'has-warning' : ''}>
                               <td>
                                  <div className="medicine-selector-box">
                                     <input 
                                       type="text" 
                                       className="form-control-minimal fw-800" 
                                       placeholder="Tìm tên thuốc..." 
                                       defaultValue={item.medicine} 
                                     />
                                     <div className="medicine-meta mt-1">
                                        <span className={`meta-pill ${item.warning === 'stock' ? 'low-stock' : ''}`}>
                                          Tồn: {item.stock}
                                        </span>
                                        <span className="meta-pill">HSD: {item.expiry}</span>
                                     </div>
                                  </div>
                               </td>
                               <td className="text-center">
                                  <input 
                                    type="number" 
                                    className="form-control-minimal text-center fw-900 fs-5" 
                                    defaultValue={item.qty} 
                                    style={{ width: '70px' }}
                                  />
                               </td>
                               <td>
                                  <textarea 
                                    className="form-control-minimal small fw-600" 
                                    rows={2} 
                                    placeholder="Ví dụ: Sáng 1 viên, Chiều 1 viên sau khi ăn"
                                    defaultValue={item.dosage}
                                  />
                               </td>
                               <td className="text-end">
                                  <button className="btn-trash-minimal" onClick={() => removeItem(item.id)}>
                                     <Trash2 size={16} />
                                  </button>
                               </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </div>

          <div className="col-lg-4">
             <div className="card shadow-luxury-clean border-0 mb-4 bg-primary-dark text-white user-mini-card">
                <div className="card-body p-4">
                   <div className="d-flex align-items-center gap-3 mb-4">
                      <div className="avatar-glass">L</div>
                      <div>
                         <h6 className="fw-950 mb-0">Lê Văn Tám</h6>
                         <span className="text-white-50 small fw-800">BN-1029 • 28 tuổi</span>
                      </div>
                   </div>
                   <div className="p-3 bg-glass-white rounded-4">
                      <label className="text-white-50 uppercase x-small fw-800 letter-spacing-1 d-block mb-1">Chẩn đoán điều trị</label>
                      <p className="small mb-0 fw-700">Sâu răng số 46, viêm tủy cấp.</p>
                   </div>
                </div>
             </div>

             <div className="card shadow-luxury-clean border-0 mb-4">
                <div className="card-body p-4">
                   <label className="form-label-luxury">Ghi chú chung cho đơn thuốc</label>
                   <textarea className="form-control-luxury" rows={3} placeholder="Dặn dò bệnh nhân về ăn uống, nghỉ ngơi..."></textarea>
                </div>
             </div>

             <div className="warning-stack">
                <div className="alert-warning-luxury mb-2">
                   <AlertTriangle size={18} />
                   <div>
                      <p className="mb-0 small fw-800">Cảnh báo tồn kho</p>
                      <p className="mb-0 x-small fw-600">Paracetamol 500mg chỉ còn 15 đơn vị trong kho.</p>
                   </div>
                </div>
                <div className="alert-info-luxury">
                   <Info size={18} />
                   <div>
                      <p className="mb-0 small fw-800">Quy định xuất thuốc</p>
                      <p className="mb-0 x-small fw-600">Đơn thuốc có giá trị trong vòng 5 ngày kể từ ngày kê.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .prescription-page { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .btn-back-luxury { border: none; background: white; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .btn-print { border: 1.5px solid #e2e8f0; background: white; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #64748b; display: flex; align-items: center; gap: 0.75rem; transition: all 0.2s; }
        .btn-save-luxury { border: none; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 0.75rem 2rem; border-radius: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .btn-save-luxury:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3); }

        .icon-box-primary-sm { width: 2.75rem; height: 2.75rem; background: #eff6ff; color: #2563eb; border-radius: 0.875rem; display: flex; align-items: center; justify-content: center; }
        .btn-add-item { border: none; background: #eff6ff; color: #2563eb; padding: 0.5rem 1rem; border-radius: 0.75rem; font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-add-item:hover { transform: scale(1.05); background: #dbeafe; }

        .table-modern-form th { font-size: 0.7rem; font-weight: 1000; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.1em; padding: 1.5rem 1rem !important; border-bottom: 2px solid #f8fafc; }
        .table-modern-form td { padding: 1.5rem 1rem !important; vertical-align: top; border-bottom: 1px solid #f8fafc; }
        
        .medicine-selector-box { display: flex; flex-direction: column; gap: 0.25rem; }
        .form-control-minimal { border: none; background: #f8fafc; padding: 0.75rem 1rem; border-radius: 0.75rem; outline: none; transition: all 0.2s; width: 100%; }
        .form-control-minimal:focus { background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.03); }
        .medicine-meta { display: flex; gap: 0.5rem; }
        .meta-pill { font-size: 0.625rem; font-weight: 800; color: #94a3b8; background: #f1f5f9; padding: 0.125rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
        .meta-pill.low-stock { background: #fffbeb; color: #d97706; border: 1px solid #fef3c7; }

        .btn-trash-minimal { border: none; background: #fff1f2; color: #ef4444; width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; transition: all 0.2s; }
        .btn-trash-minimal:hover { transform: rotate(8deg); }

        .bg-primary-dark { background: linear-gradient(135deg, #1e293b, #0f172a); }
        .user-mini-card { border-radius: 2.5rem !important; }
        .avatar-glass { width: 3.5rem; height: 3.5rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 1.125rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 1000; }
        .bg-glass-white { background: rgba(255,255,255,0.05); }

        .form-label-luxury { font-size: 0.8125rem; font-weight: 950; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: block; }
        .form-control-luxury { border: 1.5px solid #f1f5f9; background: #f8fafc; border-radius: 1.25rem; padding: 1rem; font-weight: 600; width: 100%; outline: none; }

        .alert-warning-luxury { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 1.25rem; padding: 1rem; display: flex; gap: 1rem; color: #b45309; }
        .alert-info-luxury { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 1.25rem; padding: 1rem; display: flex; gap: 1rem; color: #1e40af; }
        
        .fw-1000 { font-weight: 1000; }
        .letter-spacing-1 { letter-spacing: 0.05em; }
        .uppercase { text-transform: uppercase; }
        .x-small { font-size: 0.6875rem; }
      `}} />
    </AdminLayout>
  );
};

export default PrescriptionPage;
