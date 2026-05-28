import React from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Eye, 
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvoiceManagementPage = () => {
  const navigate = useNavigate();

  const invoices = [
    { id: 'INV-1024', patient: 'Michael Korrs', date: '05/05/2026', total: 4500000, paid: 4500000, status: 'paid' },
    { id: 'INV-1025', patient: 'Sarah Connor', date: '08/05/2026', total: 8200000, paid: 3000000, status: 'partial' },
    { id: 'INV-1026', patient: 'John Wick', date: '09/05/2026', total: 15400000, paid: 0, status: 'unpaid' },
    { id: 'INV-1027', patient: 'Ellen Ripley', date: '10/05/2026', total: 3500000, paid: 0, status: 'cancelled' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="badge-pill success"><CheckCircle2 size={14} /> Paid</span>;
      case 'partial': return <span className="badge-pill warning"><Clock size={14} /> Partial</span>;
      case 'unpaid': return <span className="badge-pill danger"><AlertCircle size={14} /> Unpaid</span>;
      case 'cancelled': return <span className="badge-pill muted"><XCircle size={14} /> Cancelled</span>;
      default: return null;
    }
  };

  return (
    <AdminLayout title="Invoices">
      <div className="invoice-mgmt">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex gap-3 flex-grow-1" style={{ maxWidth: '600px' }}>
            <div className="search-box-glow">
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Search by patient, ID or date..." />
            </div>
            <button className="btn-filter-glass">
              <Filter size={18} className="me-2" />
              Advanced
            </button>
          </div>
          <button className="btn-invoice-new">
            <Plus size={20} className="me-2" />
            New Invoice
          </button>
        </div>

        <div className="card shadow-soft border-0">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase">ID</th>
                  <th className="text-uppercase">Patient Name</th>
                  <th className="text-uppercase">Issued Date</th>
                  <th className="text-uppercase">Total</th>
                  <th className="text-uppercase">Paid</th>
                  <th className="text-uppercase">Debt</th>
                  <th className="text-uppercase text-center">Status</th>
                  <th className="text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td>
                      <span className="id-badge">{inv.id}</span>
                    </td>
                    <td>
                      <div className="patient-info">
                        <span className="patient-name-main">{inv.patient}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted fw-500">{inv.date}</span>
                    </td>
                    <td>
                      <div className="amount-main">{inv.total.toLocaleString()} <span className="currency">VND</span></div>
                    </td>
                    <td>
                      <div className="amount-paid">{inv.paid.toLocaleString()}</div>
                    </td>
                    <td>
                      <div className={`amount-debt ${inv.total - inv.paid > 0 ? 'has-debt' : ''}`}>
                        {(inv.total - inv.paid).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-center">{getStatusBadge(inv.status)}</td>
                    <td>
                      <div className="action-group">
                        <button className="btn-circle-action" title="View Detail"><Eye size={18} /></button>
                        <button 
                          className="btn-circle-action highlight" 
                          title="Record Payment"
                          onClick={() => navigate(`/receptionist/invoices/${inv.id}/payment`)}
                        >
                          <DollarSign size={18} />
                        </button>
                        <button className="btn-circle-action" title="Download PDF"><Download size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .invoice-mgmt { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .search-box-glow { flex: 1; display: flex; align-items: center; gap: 0.875rem; background: white; border: 1.5px solid #eef2f6; border-radius: 1.25rem; padding: 0.75rem 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: all 0.2s; }
        .search-box-glow:focus-within { border-color: var(--primary-color); box-shadow: 0 8px 25px rgba(37, 99, 235, 0.08); }
        .search-box-glow input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.9375rem; color: #1e293b; font-weight: 500; }
        
        .btn-filter-glass { background: #f8fafc; border: 1.5px solid #eef2f6; padding: 0.75rem 1.5rem; border-radius: 1.25rem; font-weight: 700; font-size: 0.9375rem; color: #64748b; transition: all 0.2s; display: flex; align-items: center; }
        .btn-filter-glass:hover { background: white; border-color: var(--primary-soft); color: var(--primary-color); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

        .btn-invoice-new { background: linear-gradient(135deg, var(--primary-color), #2563eb); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 1.25rem; font-weight: 800; font-size: 0.9375rem; transition: all 0.2s; box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15); display: flex; align-items: center; }
        .btn-invoice-new:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 15px 30px rgba(37, 99, 235, 0.25); filter: brightness(1.1); }

        .card.shadow-soft { border-radius: 2rem !important; box-shadow: 0 20px 50px rgba(0,0,0,0.03) !important; background: white; overflow: hidden; }
        .table thead th { background: #f8fafc; padding: 1.5rem; font-size: 0.75rem; letter-spacing: 0.1em; color: #94a3b8; border-bottom: 2px solid #f1f5f9; }
        .table tbody tr { transition: all 0.2s; }
        .table tbody tr:hover { background: #fdfdfd; }
        .table tbody td { padding: 1.5rem; border-bottom: 1px solid #f1f5f9; }

        .id-badge { background: #f0f7ff; color: var(--primary-color); padding: 0.375rem 0.75rem; border-radius: 0.75rem; font-family: var(--font-mono); font-weight: 800; font-size: 0.8125rem; border: 1.5px solid #dbeafe; }
        .patient-name-main { font-weight: 800; color: #0f172a; font-size: 1rem; }
        
        .amount-main { font-weight: 800; color: #1e293b; font-size: 1.0625rem; }
        .currency { font-size: 0.625rem; text-transform: uppercase; color: #94a3b8; margin-left: 0.25rem; }
        .amount-paid { font-weight: 700; color: var(--success-color); font-size: 0.9375rem; }
        .amount-debt { font-weight: 700; color: #94a3b8; font-size: 0.9375rem; }
        .amount-debt.has-debt { color: var(--danger-color); }

        .badge-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
        .badge-pill.success { background: #dcfce7; color: #166534; }
        .badge-pill.warning { background: #fef3c7; color: #92400e; }
        .badge-pill.danger { background: #fee2e2; color: #991b1b; }
        .badge-pill.muted { background: #f1f5f9; color: #64748b; }

        .action-group { display: flex; gap: 0.625rem; justify-content: flex-end; }
        .btn-circle-action { width: 2.75rem; height: 2.75rem; border-radius: 1rem; border: 1.5px solid transparent; background: #f8fafc; color: #94a3b8; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-circle-action:hover { transform: scale(1.1); background: white; box-shadow: 0 10px 20px rgba(0,0,0,0.05); color: #1e293b; border-color: #e2e8f0; }
        .btn-circle-action.highlight { background: #f0fdf4; color: var(--success-color); }
        .btn-circle-action.highlight:hover { background: var(--success-color); color: white; border-color: transparent; }

        .fw-500 { font-weight: 500; }
      `}} />
    </AdminLayout>
  );
};

export default InvoiceManagementPage;
