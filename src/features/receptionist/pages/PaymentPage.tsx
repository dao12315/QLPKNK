import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  ArrowLeft, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  DollarSign,
  Hash,
  User,
  Calendar
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [method, setMethod] = useState('cash');

  const invoice = {
    id: id || 'INV-1025',
    patient: 'Sarah Connor',
    total: 8200000,
    paid: 3000000,
    remaining: 5200000
  };

  const paymentHistory = [
    { date: '08/05/2026', amount: 3000000, method: 'cash', note: 'Initial deposit' }
  ];

  const payPercent = (invoice.paid / invoice.total) * 100;

  return (
    <AdminLayout title="Process Payment">
      <div className="payment-page">
        <button className="btn-back-glow mb-5" onClick={() => navigate('/receptionist/invoices')}>
          <ArrowLeft size={18} />
          <span>Exit Payment</span>
        </button>

        <div className="row g-5">
          <div className="col-md-7">
            <div className="card shadow-luxury border-0 mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <h4 className="fw-900 text-dark mb-0">Invoice Summary</h4>
                  <div className="text-end">
                    <span className="small fw-700 text-muted d-block text-uppercase">Payment Status</span>
                    <span className="badge-status-glow">{payPercent === 100 ? 'Fully Paid' : 'Partially Paid'}</span>
                  </div>
                </div>

                <div className="progress-minimal mb-5">
                  <div className="d-flex justify-content-between mb-3 align-items-center">
                    <span className="fw-800 text-dark" style={{ fontSize: '0.875rem' }}>Collection Progress</span>
                    <span className="percent-indicator">{payPercent.toFixed(1)}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${payPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="invoice-info-grid">
                  <div className="info-item-box">
                    <div className="info-icon"><Hash size={20} /></div>
                    <div className="info-details">
                      <label>Invoice Number</label>
                      <strong>{invoice.id}</strong>
                    </div>
                  </div>
                  <div className="info-item-box">
                    <div className="info-icon"><User size={20} /></div>
                    <div className="info-details">
                      <label>Patient Name</label>
                      <strong>{invoice.patient}</strong>
                    </div>
                  </div>
                  <div className="info-item-box highlight">
                    <div className="info-icon"><DollarSign size={20} /></div>
                    <div className="info-details">
                      <label>Total Bill</label>
                      <strong>{invoice.total.toLocaleString()} VND</strong>
                    </div>
                  </div>
                  <div className="info-item-box success">
                    <div className="info-icon"><CheckCircle2 size={20} /></div>
                    <div className="info-details">
                      <label>Amount Collected</label>
                      <strong>{invoice.paid.toLocaleString()} VND</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-luxury border-0">
              <div className="card-body p-4">
                <h5 className="fw-900 text-dark mb-4">Transaction History</h5>
                <div className="modern-timeline">
                  {paymentHistory.map((item, i) => (
                    <div key={i} className="timeline-segment">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="timeline-date">{item.date}</div>
                            <div className="timeline-title">Payment Received via {item.method}</div>
                            <div className="timeline-note">{item.note}</div>
                          </div>
                          <div className="timeline-price">+{item.amount.toLocaleString()} VND</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card shadow-luxury border-0 checkout-card">
              <div className="card-body p-4">
                <div className="debt-indicator mb-5">
                  <div className="debt-glow"></div>
                  <span className="debt-label">Total Debt Remaining</span>
                  <span className="debt-value">{invoice.remaining.toLocaleString()} <small>VND</small></span>
                </div>

                <div className="payment-form-group mb-5">
                  <label className="input-label-premium">COLLECT AMOUNT</label>
                  <div className="premium-input-wrapper">
                    <span className="currency-prefix">VND</span>
                    <input 
                      type="number" 
                      className="premium-input" 
                      defaultValue={invoice.remaining}
                      max={invoice.remaining}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="input-label-premium">SELECT METHOD</label>
                  <div className="premium-method-selector">
                    <button 
                      className={`premium-method-btn ${method === 'cash' ? 'active cash' : ''}`}
                      onClick={() => setMethod('cash')}
                    >
                      <div className="method-icon-box"><Banknote size={24} /></div>
                      <span>Cash</span>
                    </button>
                    <button 
                      className={`premium-method-btn ${method === 'banking' ? 'active banking' : ''}`}
                      onClick={() => setMethod('banking')}
                    >
                      <div className="method-icon-box"><CreditCard size={24} /></div>
                      <span>Banking</span>
                    </button>
                    <button 
                      className={`premium-method-btn ${method === 'momo' ? 'active momo' : ''}`}
                      onClick={() => setMethod('momo')}
                    >
                      <div className="method-icon-box"><Smartphone size={24} /></div>
                      <span>MoMo</span>
                    </button>
                  </div>
                </div>

                { (method === 'banking' || method === 'momo') && (
                  <div className="qr-checkout-area mb-5">
                    <div className="qr-wrapper shadow-soft">
                      <div className="qr-frame">
                        <div className="qr-scan-line"></div>
                        <div className="qr-mock-content">SCAN TO PAY</div>
                      </div>
                    </div>
                    <p className="qr-instruction">Instantly confirms upon successful scan</p>
                  </div>
                )}

                <button className="btn-confirm-payment">
                  Process Transaction
                </button>
                
                <div className="secure-footer mt-4">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Secure Financial Transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .payment-page { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .btn-back-glow { display: flex; align-items: center; gap: 0.75rem; background: #f8fafc; border: 1.5px solid #eef2f6; padding: 0.625rem 1.25rem; border-radius: 1rem; color: #64748b; font-weight: 700; transition: all 0.3s ease; }
        .btn-back-glow:hover { background: white; color: var(--danger-color); border-color: #fee2e2; transform: translateX(-5px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05); }

        .shadow-luxury { box-shadow: 0 20px 50px rgba(0,0,0,0.03) !important; border-radius: 2rem !important; }
        
        .badge-status-glow { background: #dcfce7; color: #166534; padding: 0.375rem 1rem; border-radius: 9999px; font-weight: 800; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; display: inline-block; }

        .progress-minimal { position: relative; }
        .percent-indicator { font-weight: 900; color: var(--primary-color); font-size: 1.25rem; letter-spacing: -0.02em; }
        .progress-track { width: 100%; height: 12px; background: #f1f5f9; border-radius: 9999px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary-color), #60a5fa); border-radius: 9999px; transition: width 1s ease-in-out; }

        .invoice-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .info-item-box { background: #f8fafc; padding: 1.25rem; border-radius: 1.5rem; display: flex; align-items: center; gap: 1.25rem; border: 1.5px solid #f1f5f9; transition: all 0.3s; }
        .info-item-box:hover { transform: translateY(-3px); border-color: #e2e8f0; background: white; box-shadow: 0 10px 25px rgba(0,0,0,0.02); }
        .info-item-box.highlight { background: #f0f9ff; border-color: #e0f2fe; }
        .info-item-box.success { background: #f0fdf4; border-color: #dcfce7; }
        
        .info-icon { width: 3.25rem; height: 3.25rem; background: white; border-radius: 1.125rem; display: flex; align-items: center; justify-content: center; color: #94a3b8; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .info-item-box.highlight .info-icon { color: var(--primary-color); }
        .info-item-box.success .info-icon { color: var(--success-color); }
        
        .info-details { display: flex; flex-direction: column; }
        .info-details label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.125rem; }
        .info-details strong { font-size: 1rem; color: #1e293b; font-weight: 800; }

        .modern-timeline { padding-left: 1rem; }
        .timeline-segment { position: relative; padding-left: 2.5rem; padding-bottom: 2.5rem; }
        .timeline-segment:last-child { padding-bottom: 0; }
        .timeline-segment:not(:last-child):after { content: ""; position: absolute; left: 0.375rem; top: 1.5rem; bottom: -1rem; width: 2px; background: #f1f5f9; }
        .timeline-marker { position: absolute; left: 0; top: 0.25rem; width: 0.75rem; height: 0.75rem; background: var(--primary-color); border-radius: 50%; box-shadow: 0 0 0 4px #dbeafe; z-index: 1; }
        .timeline-date { font-weight: 800; color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.25rem; }
        .timeline-title { font-weight: 700; color: #1e293b; font-size: 0.9375rem; margin-bottom: 0.125rem; }
        .timeline-note { font-size: 0.8125rem; color: #64748b; font-weight: 500; }
        .timeline-price { font-weight: 900; color: var(--success-color); font-size: 1.0625rem; }

        .checkout-card { border: 2.5px solid #f8fafc; position: sticky; top: 2rem; }
        .debt-indicator { background: linear-gradient(135deg, #ef4444, #b91c1c); padding: 2.5rem 1.5rem; border-radius: 1.75rem; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; text-align: center; box-shadow: 0 20px 40px rgba(239, 68, 68, 0.2); }
        .debt-glow { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%); animation: rotate 10s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .debt-label { font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; position: relative; opacity: 0.8; }
        .debt-value { font-size: 2.25rem; font-weight: 950; position: relative; letter-spacing: -0.02em; }
        .debt-value small { font-size: 0.875rem; font-weight: 700; margin-left: 0.5rem; opacity: 0.7; }

        .input-label-premium { font-weight: 800; color: #64748b; font-size: 0.75rem; letter-spacing: 0.1em; margin-bottom: 0.75rem; display: block; }
        .premium-input-wrapper { position: relative; }
        .currency-prefix { position: absolute; left: 1.5rem; top: 50%; transform: translateY(-50%); font-weight: 900; font-size: 0.875rem; color: #cbd5e1; }
        .premium-input { width: 100%; border: 2px solid #f1f5f9; background: #f8fafc; padding: 1.25rem 1.5rem 1.25rem 4.5rem; border-radius: 1.5rem; font-size: 1.5rem; font-weight: 900; color: var(--primary-color); text-align: right; transition: all 0.3s; }
        .premium-input:focus { outline: none; border-color: var(--primary-color); background: white; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.08); }

        .premium-method-selector { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .premium-method-btn { background: white; border: 2px solid #f1f5f9; border-radius: 1.5rem; padding: 1.25rem 0.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .premium-method-btn span { font-weight: 800; font-size: 0.8125rem; color: #94a3b8; }
        .method-icon-box { width: 3.5rem; height: 3.5rem; border-radius: 1.25rem; background: #f8fafc; color: #cbd5e1; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        
        .premium-method-btn:hover { border-color: #e2e8f0; transform: translateY(-2px); }
        .premium-method-btn.active { transform: scale(1.05); box-shadow: 0 15px 35px rgba(0,0,0,0.05); border-color: var(--primary-color); }
        .premium-method-btn.active span { color: #1e293b; }
        .premium-method-btn.active.cash .method-icon-box { background: #dcfce7; color: #22c55e; }
        .premium-method-btn.active.banking .method-icon-box { background: #dbeafe; color: #2563eb; }
        .premium-method-btn.active.momo .method-icon-box { background: #fdf2f8; color: #db2777; }

        .btn-confirm-payment { width: 100%; border: none; background: linear-gradient(135deg, #1e293b, #0f172a); color: white; padding: 1.25rem; border-radius: 1.5rem; font-weight: 900; font-size: 1.125rem; transition: all 0.3s; box-shadow: 0 15px 35px rgba(0,0,0,0.15); }
        .btn-confirm-payment:hover { transform: translateY(-3px); box-shadow: 0 20px 45px rgba(0,0,0,0.25); filter: brightness(1.2); }

        .secure-footer { display: flex; align-items: center; justify-content: center; gap: 0.625rem; color: #94a3b8; font-weight: 700; font-size: 0.8125rem; }
        
        .qr-checkout-area { text-align: center; }
        .qr-wrapper { background: white; border-radius: 2rem; padding: 1.5rem; display: inline-block; border: 2px dashed #f1f5f9; }
        .qr-frame { width: 10rem; height: 10rem; background: #f8fafc; border-radius: 1.5rem; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .qr-mock-content { font-weight: 900; color: #cbd5e1; font-size: 0.875rem; letter-spacing: 0.1em; }
        .qr-scan-line { height: 2px; width: 100%; background: rgba(37, 99, 235, 0.4); position: absolute; top: 0; animation: scan 2s linear infinite; box-shadow: 0 0 10px rgba(37, 99, 235, 1); }
        @keyframes scan { from { top: 0; } to { top: 100%; } }
        .qr-instruction { font-size: 0.75rem; color: #94a3b8; margin-top: 1rem; font-weight: 600; }

        .fw-800 { font-weight: 800; }
        .fw-900 { font-weight: 900; }
        .fw-950 { font-weight: 950; }
      `}} />
    </AdminLayout>
  );
};

export default PaymentPage;
