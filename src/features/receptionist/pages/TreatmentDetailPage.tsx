import React from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  ArrowLeft, 
  User, 
  Stethoscope, 
  Calendar, 
  Clock, 
  FileText, 
  ChevronRight,
  ClipboardCheck,
  Activity,
  Plus,
  DollarSign
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TreatmentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const treatment = {
    id: id || 'TRT-7821',
    patient: 'John Wick',
    doctor: 'Dr. Nguyen Van A',
    date: '04/05/2026',
    status: 'completed',
    diagnosis: 'Deep caries in tooth #46, hypersensitivity.',
    notes: 'Patient was advised to follow oral hygiene instructions. Root canal suggested if pain persists.',
    totalAmount: 4500000,
    hasInvoice: false
  };

  const services = [
    { name: 'Root Canal Treatment', qty: 1, price: 3500000 },
    { name: 'Composite Filling', qty: 1, price: 800000 },
    { name: 'X-Ray Panoramic', qty: 1, price: 200000 },
  ];

  return (
    <AdminLayout title="Treatment Details">
      <div className="treatment-details">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <button className="btn-back-minimal" onClick={() => navigate('/receptionist/patients')}>
            <ArrowLeft size={18} />
            <span>Profile Return</span>
          </button>
          
          {treatment.status === 'completed' && !treatment.hasInvoice && (
            <button className="btn-generate-glow" onClick={() => navigate('/receptionist/invoices')}>
              <FileText size={18} />
              <span>Create Official Invoice</span>
            </button>
          )}
        </div>

        <div className="row g-5">
          <div className="col-md-8">
            <div className="card shadow-luxury border-0 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-5">
                  <div className="d-flex align-items-center gap-4">
                    <div className="treatment-id-badge">
                      <ClipboardCheck size={28} />
                      <div className="badge-meta">
                        <label>CASE FILE</label>
                        <strong>{treatment.id}</strong>
                      </div>
                    </div>
                    <span className="status-pill-completed">Clinical Success</span>
                  </div>
                  <div className="date-display-premium">
                    <Calendar size={14} />
                    <span>Session: <strong>{treatment.date}</strong></span>
                  </div>
                </div>

                <div className="clinical-header-grid mb-5">
                  <div className="clinical-item">
                    <div className="icon-circle"><User size={18} /></div>
                    <div className="meta">
                      <label>Patient Entity</label>
                      <span>{treatment.patient}</span>
                    </div>
                  </div>
                  <div className="clinical-item">
                    <div className="icon-circle"><Stethoscope size={18} /></div>
                    <div className="meta">
                      <label>Dental Specialist</label>
                      <span>{treatment.doctor}</span>
                    </div>
                  </div>
                </div>

                <div className="diagnosis-box-premium mb-5">
                   <div className="diagnosis-label">
                     <Activity size={16} />
                     <span>DIAGNOSIS & CLINICAL OBSERVATIONS</span>
                   </div>
                   <div className="diagnosis-content">
                     <p className="headline">{treatment.diagnosis}</p>
                     <p className="subtext">{treatment.notes}</p>
                   </div>
                </div>

                <h5 className="section-title-premium mb-4">Procedures & Interventions</h5>
                <div className="table-responsive">
                  <table className="table premium-clinical-table align-middle">
                    <thead>
                      <tr>
                        <th>Medical Service</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((svc, i) => (
                        <tr key={i}>
                          <td className="proc-name">{svc.name}</td>
                          <td className="text-center proc-qty">{svc.qty}</td>
                          <td className="text-end proc-price">{svc.price.toLocaleString()}</td>
                          <td className="text-end proc-total">{(svc.qty * svc.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="billing-footer-glow mt-5">
                   <div className="label-area">
                     <DollarSign size={24} />
                     <span>TOTAL CLINICAL CHARGE</span>
                   </div>
                   <div className="value-area">
                     <span className="currency">VND</span>
                     <span className="amount">{treatment.totalAmount.toLocaleString()}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-luxury border-0 mb-4 sticky-top" style={{ top: '2rem' }}>
              <div className="card-body p-4">
                <h5 className="section-title-premium mb-4">Journey Roadmap</h5>
                <div className="roadmap-timeline">
                  <div className="roadmap-item active">
                    <div className="roadmap-marker"></div>
                    <div className="roadmap-content">
                      <span className="date">TODAY, 10:45 AM</span>
                      <p className="title">Procedure Completed</p>
                      <p className="desc text-muted">Awaiting financial clearance and invoice issuance.</p>
                    </div>
                  </div>
                  <div className="roadmap-item">
                    <div className="roadmap-marker"></div>
                    <div className="roadmap-content">
                      <span className="date">MAY 01, 2026</span>
                      <p className="title">Diagnostic Session</p>
                      <p className="desc text-muted">Initial consultation and panoramic imaging protocol.</p>
                    </div>
                  </div>
                </div>

                <div className="tooth-chart-card mt-5">
                   <div className="chart-header">
                     <Activity size={18} />
                     <span>TOOTH CHART VIZ</span>
                   </div>
                   <div className="chart-placeholder">
                      <div className="tooth-grid-mini">
                        {[...Array(16)].map((_, i) => (
                          <div key={i} className={`tooth-node ${i === 12 ? 'active' : ''}`}></div>
                        ))}
                      </div>
                      <span className="chart-note">ACTIVE SITE: TOOTH #46</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .treatment-details { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .btn-back-minimal { display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; border: 1.5px solid #eef2f6; padding: 0.5rem 1.25rem; border-radius: 1rem; color: #64748b; font-weight: 800; font-size: 0.8125rem; transition: all 0.3s; text-transform: uppercase; letter-spacing: 0.05em; }
        .btn-back-minimal:hover { background: white; color: var(--primary-color); transform: translateX(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

        .btn-generate-glow { background: linear-gradient(135deg, var(--primary-color), #1d4ed8); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2); transition: all 0.3s; }
        .btn-generate-glow:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.3); filter: brightness(1.1); }

        .shadow-luxury { border-radius: 2rem !important; box-shadow: 0 20px 50px rgba(0,0,0,0.03) !important; background: white; }

        .treatment-id-badge { display: flex; align-items: center; gap: 1.25rem; background: #f8fafc; padding: 0.75rem 1.25rem; border-radius: 1.25rem; border: 1.5px solid #eef2f6; color: var(--primary-color); }
        .badge-meta { display: flex; flex-direction: column; }
        .badge-meta label { font-size: 0.625rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.1em; }
        .badge-meta strong { font-size: 1.125rem; font-weight: 900; color: #1e293b; letter-spacing: -0.01em; }

        .status-pill-completed { background: #dcfce7; color: #166534; padding: 0.375rem 1rem; border-radius: 9999px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }

        .date-display-premium { background: white; border: 1.5px solid #f1f5f9; padding: 0.5rem 1rem; border-radius: 0.875rem; display: flex; align-items: center; gap: 0.625rem; color: #64748b; font-size: 0.8125rem; }
        .date-display-premium strong { color: #1e293b; }

        .clinical-header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .clinical-item { display: flex; align-items: center; gap: 1.25rem; background: #f8fafc; padding: 1.25rem; border-radius: 1.5rem; border: 1.5px solid #f1f5f9; }
        .icon-circle { width: 3rem; height: 3rem; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #94a3b8; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .clinical-item .meta label { font-size: 0.6875rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.125rem; display: block; }
        .clinical-item .meta span { font-size: 1rem; font-weight: 800; color: #334155; }

        .diagnosis-box-premium { background: #fdfdfd; border: 1.5px solid #f1f5f9; border-radius: 1.5rem; overflow: hidden; }
        .diagnosis-label { background: #f8fafc; padding: 0.75rem 1.5rem; display: flex; align-items: center; gap: 0.75rem; font-size: 0.6875rem; font-weight: 950; color: #94a3b8; border-bottom: 1.5px solid #f1f5f9; letter-spacing: 0.05em; }
        .diagnosis-content { padding: 1.5rem; }
        .diagnosis-content .headline { font-size: 1.125rem; font-weight: 800; color: #1e293b; margin-bottom: 0.5rem; line-height: 1.4; }
        .diagnosis-content .subtext { font-size: 0.875rem; color: #64748b; font-weight: 500; margin: 0; line-height: 1.6; }

        .section-title-premium { font-size: 0.8125rem; font-weight: 950; color: #1e293b; text-transform: uppercase; letter-spacing: 0.1em; border-left: 4px solid var(--primary-color); padding-left: 1rem; }

        .premium-clinical-table thead th { background: #f8fafc; color: #94a3b8; font-size: 0.6875rem; font-weight: 800; text-transform: uppercase; padding: 1rem !important; border-bottom: 2px solid #f1f5f9; }
        .premium-clinical-table td { padding: 1.25rem 1rem !important; border-bottom: 1px solid #f1f5f9; }
        .proc-name { font-weight: 800; color: #475569; }
        .proc-qty { font-weight: 700; color: #94a3b8; }
        .proc-price { font-weight: 700; color: #94a3b8; }
        .proc-total { font-weight: 950; color: #1e293b; }

        .billing-footer-glow { background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 1.5rem; padding: 2rem; display: flex; justify-content: space-between; align-items: center; color: white; box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
        .billing-footer-glow .label-area { display: flex; align-items: center; gap: 1rem; }
        .billing-footer-glow .label-area span { font-weight: 900; font-size: 1rem; letter-spacing: 0.05em; }
        .billing-footer-glow .value-area { display: flex; align-items: baseline; gap: 0.5rem; }
        .billing-footer-glow .value-area .currency { font-size: 0.875rem; font-weight: 700; opacity: 0.6; }
        .billing-footer-glow .value-area .amount { font-size: 2rem; font-weight: 950; letter-spacing: -0.02em; }

        .roadmap-timeline { position: relative; padding-left: 2rem; }
        .roadmap-item { position: relative; padding-bottom: 2.5rem; }
        .roadmap-item:last-child { padding-bottom: 0; }
        .roadmap-item:not(:last-child):after { content: ""; position: absolute; left: -1.5rem; top: 1.25rem; bottom: -0.5rem; width: 2px; background: #f1f5f9; }
        .roadmap-marker { position: absolute; left: -1.875rem; top: 0.25rem; width: 1rem; height: 1rem; border-radius: 50%; background: #e2e8f0; border: 3px solid white; box-shadow: 0 0 0 1px #e2e8f0; z-index: 1; }
        .roadmap-item.active .roadmap-marker { background: var(--primary-color); border: 4px solid white; box-shadow: 0 0 0 4px var(--primary-soft); }
        
        .roadmap-content .date { font-size: 0.6875rem; font-weight: 800; color: var(--primary-color); display: block; margin-bottom: 0.25rem; }
        .roadmap-content .title { font-weight: 800; color: #1e293b; margin-bottom: 0.125rem; font-size: 0.9375rem; }
        .roadmap-content .desc { font-size: 0.8125rem; line-height: 1.5; font-weight: 500; }

        .tooth-chart-card { background: #f8fafc; border-radius: 1.5rem; padding: 1.5rem; border: 1.5px solid #eef2f6; }
        .chart-header { display: flex; align-items: center; gap: 0.75rem; color: #94a3b8; font-size: 0.6875rem; font-weight: 950; margin-bottom: 1.25rem; }
        .chart-placeholder { text-align: center; }
        .tooth-grid-mini { display: grid; grid-template-columns: repeat(8, 1fr); gap: 0.5rem; margin-bottom: 1.25rem; }
        .tooth-node { aspect-ratio: 1; background: white; border-radius: 4px; border: 1px solid #e2e8f0; transition: all 0.3s; }
        .tooth-node.active { background: var(--primary-color); border-color: var(--primary-color); box-shadow: 0 0 10px rgba(37, 99, 235, 0.3); transform: scale(1.2); }
        .chart-note { font-size: 0.625rem; font-weight: 900; color: #64748b; letter-spacing: 0.05em; }

        .fw-950 { font-weight: 950; }
      `}} />
    </AdminLayout>
  );
};

export default TreatmentDetailPage;
