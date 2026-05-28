import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Search, 
  Clipboard, 
  Activity, 
  Stethoscope,
  Pill,
  Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TreatmentFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([
    { id: 1, name: 'Khám tổng quát', qty: 1, price: 200000 },
    { id: 2, name: 'Lấy cao răng siêu âm', qty: 1, price: 300000 }
  ]);

  const toggleTooth = (num: number) => {
    setSelectedTeeth(prev => 
      prev.includes(num) ? prev.filter(t => t !== num) : [...prev, num]
    );
  };

  const calculateTotal = () => selectedServices.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);

  // Render Tooth Chart (FDI standard 11-48)
  const renderTeethRow = (start: number, end: number, step: number) => {
    const teeth = [];
    for (let i = start; i !== end + step; i += step) {
      teeth.push(
        <div 
          key={i} 
          className={`tooth-item ${selectedTeeth.includes(i) ? 'selected' : ''}`}
          onClick={() => toggleTooth(i)}
        >
          <span className="tooth-number">{i}</span>
          <div className="tooth-shape"></div>
        </div>
      );
    }
    return teeth;
  };

  return (
    <AdminLayout title={isEdit ? 'Chỉnh sửa hồ sơ điều trị' : 'Tạo hồ sơ điều trị mới'}>
      <div className="treatment-form p-1 pb-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
           <button className="btn-back-luxury" onClick={() => navigate(-1)}>
             <ArrowLeft size={18} />
             Quay lại
           </button>
           <div className="d-flex gap-3">
             <button className="btn-draft shadow-sm">Lưu nháp</button>
             <button className="btn-save-luxury shadow-lg">
               <Save size={18} />
               Lưu hồ sơ điều trị
             </button>
           </div>
        </div>

        <div className="row g-4">
          {/* Main Info Column */}
          <div className="col-lg-8">
            {/* Section 1: General Info */}
            <div className="card shadow-luxury-clean border-0 mb-4">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                <h5 className="fw-950 text-dark d-flex align-items-center gap-2">
                  <Clipboard size={20} className="text-primary" />
                  Thông tin chung
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label-luxury">Bệnh nhân</label>
                    <div className="custom-autocomplete">
                       <Search size={16} className="text-muted" />
                       <input type="text" placeholder="Tìm tên bệnh nhân..." defaultValue="Lê Văn Tám" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-luxury">Trạng thái điều trị</label>
                    <select className="form-select-luxury">
                       <option value="planned">Dự kiến (Planned)</option>
                       <option value="in_progress" selected>Đang tiến hành (In Progress)</option>
                       <option value="completed">Hoàn thành (Completed)</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label-luxury">Chẩn đoán (Bắt buộc)</label>
                    <textarea 
                      className="form-control-luxury" 
                      rows={3} 
                      placeholder="Nhập chẩn đoán lâm sàng..."
                      defaultValue="Sâu răng hàm số 46, viêm tủy cấp tính."
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label-luxury">Ghi chú điều trị</label>
                    <textarea 
                      className="form-control-luxury" 
                      rows={2} 
                      placeholder="Ghi chú thêm về ca điều trị..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Services */}
            <div className="card shadow-luxury-clean border-0">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-950 text-dark d-flex align-items-center gap-2">
                  <Stethoscope size={20} className="text-primary" />
                  Dịch vụ điều trị
                </h5>
                <button className="btn-add-service">
                  <Plus size={16} /> Thêm dịch vụ
                </button>
              </div>
              <div className="card-body p-4">
                <div className="table-responsive">
                  <table className="table table-modern-simple align-middle">
                    <thead>
                      <tr>
                        <th>Tên dịch vụ</th>
                        <th className="text-center">SL</th>
                        <th className="text-end">Đơn giá</th>
                        <th className="text-end">Thành tiền</th>
                        <th className="text-end"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedServices.map(svc => (
                        <tr key={svc.id}>
                          <td className="fw-800 text-dark">{svc.name}</td>
                          <td className="text-center">
                            <div className="qty-control">
                              <button>-</button>
                              <span>{svc.qty}</span>
                              <button>+</button>
                            </div>
                          </td>
                          <td className="text-end fw-700">{svc.price.toLocaleString()}</td>
                          <td className="text-end fw-900 text-primary">{(svc.price * svc.qty).toLocaleString()}</td>
                          <td className="text-end">
                            <button className="btn-trash"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                       <tr>
                         <td colSpan={3} className="pt-4 text-end fw-950 text-muted uppercase small">Tổng chi phí:</td>
                         <td className="pt-4 text-end fw-1000 fs-4 text-dark">{calculateTotal().toLocaleString()} VND</td>
                         <td></td>
                       </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4">
            {/* Section 2: Tooth Chart */}
            <div className="card shadow-luxury-clean border-0 mb-4 tooth-chart-card">
              <div className="card-header bg-white border-0 pt-4 px-4 pb-0">
                 <h5 className="fw-950 text-dark d-flex align-items-center gap-2">
                   <Activity size={20} className="text-primary" />
                   Sơ đồ răng (FDI)
                 </h5>
              </div>
              <div className="card-body p-4">
                 <div className="tooth-chart-interactive">
                    <div className="teeh-row upper">
                      <div className="teeth-group">{renderTeethRow(18, 11, -1)}</div>
                      <div className="teeth-group">{renderTeethRow(21, 28, 1)}</div>
                    </div>
                    <div className="chart-divider"></div>
                    <div className="teeh-row lower">
                      <div className="teeth-group">{renderTeethRow(48, 41, -1)}</div>
                      <div className="teeth-group">{renderTeethRow(31, 38, 1)}</div>
                    </div>
                 </div>
                 
                 <div className="selected-teeth-tags mt-4">
                    <label className="extra-small fw-800 text-muted uppercase mb-2 d-block">Răng đã chọn:</label>
                    <div className="d-flex flex-wrap gap-2">
                       {selectedTeeth.length > 0 ? selectedTeeth.sort().map(t => (
                         <span key={t} className="tooth-tag shadow-sm">
                           R-{t}
                           <button onClick={() => toggleTooth(t)}>×</button>
                         </span>
                       )) : <span className="small text-muted italic">Chưa chọn răng nào</span>}
                    </div>
                 </div>

                 <div className="mt-4">
                    <label className="form-label-luxury">Ghi chú cho răng</label>
                    <textarea className="form-control-luxury" rows={2} placeholder="Vị trí mặt nhai, tình trạng răng..."></textarea>
                 </div>
              </div>
            </div>

            {/* Section 4: Prescription Quick Link */}
            <div className="card shadow-luxury-clean border-0 prescription-cta">
               <div className="card-body p-4 text-center">
                  <div className="pill-icon-box mb-3 mx-auto">
                    <Pill size={24} className="text-primary" />
                  </div>
                  <h6 className="fw-950 mb-2">Đơn thuốc</h6>
                  <p className="small text-muted mb-4">Mẫu đơn thuốc sẽ được tách riêng để dễ quản lý.</p>
                  <button className="btn-action-outline-primary w-100" onClick={() => navigate(`/dentist/treatments/${id || 'temp'}/prescriptions/new`)}>
                    <Plus size={18} />
                    Thêm đơn thuốc
                  </button>
               </div>
            </div>

            <div className="alert-luxury mt-4">
               <Info size={18} />
               <div>
                  <p className="mb-0 small fw-700">Lưu ý bảo mật</p>
                  <p className="mb-0 x-small text-muted">Hồ sơ sau khi lưu hoàn thành sẽ không thể sửa đổi các dịch vụ đã chỉ định.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .treatment-form { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .btn-back-luxury { border: none; background: white; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #475569; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: all 0.2s; }
        .btn-back-luxury:hover { transform: translateX(-5px); background: #f8fafc; }
        
        .btn-draft { border: 1.5px solid #e2e8f0; background: white; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 800; color: #64748b; transition: all 0.2s; }
        .btn-save-luxury { border: none; background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 0.75rem 2rem; border-radius: 1.25rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .btn-save-luxury:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3); }

        .form-label-luxury { font-size: 0.8125rem; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: block; }
        .form-control-luxury, .form-select-luxury { background: #f8fafc; border: 1.5px solid #f1f5f9; border-radius: 1.25rem; padding: 0.875rem 1.25rem; font-weight: 600; color: #1e293b; transition: all 0.3s; width: 100%; outline: none; }
        .form-control-luxury:focus, .form-select-luxury:focus { background: white; border-color: #2563eb; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.05); }

        .custom-autocomplete { position: relative; }
        .custom-autocomplete svg { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); }
        .custom-autocomplete input { padding-left: 3rem; }

        .btn-add-service { border: none; background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 0.8125rem; padding: 0.5rem 1.25rem; border-radius: 1rem; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-add-service:hover { background: #dbeafe; transform: scale(1.05); }

        .table-modern-simple th { padding: 1.25rem 1rem !important; border-bottom: 2px solid #f8fafc; font-size: 0.7rem; font-weight: 1000; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.1em; }
        .table-modern-simple td { padding: 1.25rem 1rem !important; border-bottom: 1px solid #f8fafc; }
        
        .qty-control { display: inline-flex; align-items: center; background: #f1f5f9; border-radius: 0.75rem; padding: 0.25rem; }
        .qty-control button { border: none; background: white; width: 1.75rem; height: 1.75rem; border-radius: 0.5rem; font-weight: 900; color: #64748b; }
        .qty-control span { padding: 0 0.75rem; font-weight: 900; font-size: 0.875rem; color: #1e293b; }

        .btn-trash { border: none; background: #fff1f2; color: #ef4444; width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; transition: all 0.2s; }
        .btn-trash:hover { transform: scale(1.1) rotate(10deg); }

        /* Tooth Chart Interactive */
        .tooth-chart-interactive { display: flex; flex-direction: column; gap: 1rem; align-items: center; }
        .teeh-row { display: flex; gap: 1rem; }
        .teeth-group { display: flex; gap: 4px; }
        .tooth-item { display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s; }
        .tooth-shape { width: 18px; height: 22px; background: #f1f5f9; border-radius: 4px; border: 1.5px solid #e2e8f0; }
        .tooth-number { font-size: 0.625rem; font-weight: 900; color: #94a3b8; margin-bottom: 2px; }
        .tooth-item:hover .tooth-shape { background: #eff6ff; border-color: #2563eb; }
        .tooth-item.selected .tooth-shape { background: #ef4444; border-color: #b91c1c; }
        .tooth-item.selected .tooth-number { color: #ef4444; }
        .chart-divider { width: 100%; height: 1.5px; background: #f1f5f9; }

        .tooth-tag { background: #1e293b; color: white; padding: 0.25rem 0.75rem; border-radius: 0.75rem; font-size: 0.75rem; font-weight: 900; display: flex; align-items: center; gap: 0.5rem; }
        .tooth-tag button { border: none; background: transparent; color: white; opacity: 0.6; font-size: 1rem; line-height: 1; padding-bottom: 2px; }
        
        .pill-icon-box { width: 3.5rem; height: 3.5rem; background: #eff6ff; border-radius: 1.25rem; display: flex; align-items: center; justify-content: center; }
        .btn-action-outline-primary { border: 1.5px solid #2563eb; background: transparent; color: #2563eb; padding: 0.75rem; border-radius: 1.125rem; font-weight: 800; font-size: 0.8125rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-action-outline-primary:hover { background: #eff6ff; }

        .alert-luxury { background: #fffbe2; border-radius: 1.5rem; padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start; color: #d97706; }
        .x-small { font-size: 0.7rem; }
      `}} />
    </AdminLayout>
  );
};

export default TreatmentFormPage;
