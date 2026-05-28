import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  Calendar as CalendarIcon, 
  List, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Check,
  X,
  Clock,
  User
} from 'lucide-react';

const AppointmentManagementPage = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const appointments = [
    { id: 1, patient: 'Alice Johnson', doctor: 'Dr. Nguyen Van A', chair: 'Chair 01', start: '09:00', end: '10:00', status: 'confirmed' },
    { id: 2, patient: 'Bob Smith', doctor: 'Dr. Tran Thi B', chair: 'Chair 02', start: '10:30', end: '11:15', status: 'pending' },
    { id: 3, patient: 'Charlie Brown', doctor: 'Dr. Nguyen Van A', chair: 'Chair 01', start: '11:30', end: '12:30', status: 'checked-in' },
    { id: 4, patient: 'David Wilson', doctor: 'Dr. Tran Thi B', chair: 'Chair 02', start: '14:00', end: '15:00', status: 'no-show' },
  ];

  return (
    <AdminLayout title="Appointments">
      <div className="appointment-mgmt">
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              <CalendarIcon size={18} />
              Calendar
            </button>
            <button 
              className={`toggle-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={18} />
              List
            </button>
          </div>

          <div className="search-box">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search by patient, doctor or ID..." />
          </div>

          <button className="btn-filter">
            <Filter size={18} className="me-2" />
            Filters
          </button>

          <button className="btn-book">
            <Plus size={20} className="me-2" />
            Book New
          </button>
        </div>

        {view === 'list' ? (
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="text-uppercase">Time</th>
                      <th className="text-uppercase">Patient</th>
                      <th className="text-uppercase">Doctor</th>
                      <th className="text-uppercase">Chair</th>
                      <th className="text-uppercase text-center">Status</th>
                      <th className="text-uppercase text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>
                          <div className="time-cell">
                            <span className="time-main">{appt.start}</span>
                            <span className="time-sub">{appt.end}</span>
                          </div>
                        </td>
                        <td>
                          <div className="patient-cell">
                            <div className="avatar-box">
                              <User size={18} />
                            </div>
                            <span className="patient-name">{appt.patient}</span>
                          </div>
                        </td>
                        <td>
                          <div className="fw-600 text-dark">{appt.doctor}</div>
                        </td>
                        <td>
                          <span className="chair-badge">{appt.chair}</span>
                        </td>
                        <td className="text-center">
                          <span className={`status-badge ${appt.status}`}>
                            {appt.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn-mini success" title="Confirm"><Check size={18} /></button>
                            <button className="btn-mini danger" title="Cancel"><X size={18} /></button>
                            <button className="btn-mini info"><MoreVertical size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="calendar-placeholder">
            <div className="calendar-icon-bg">
              <CalendarIcon size={64} />
            </div>
            <h3 className="fw-bold text-dark">Interactive Schedule View</h3>
            <p className="text-muted mx-auto" style={{ maxWidth: '400px' }}>
              Switch to the visual schedule to manage chair assignments and doctor availability in real-time.
            </p>
            <div className="mt-5 d-flex justify-content-center gap-3">
              <button className="btn btn-outline-primary px-5 py-2 rounded-pill fw-bold">Previous Week</button>
              <button className="btn btn-primary px-5 py-2 rounded-pill fw-bold shadow">Next Week</button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .appointment-mgmt { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .header-actions { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2rem; }
        
        .view-toggle { display: flex; background: #f1f5f9; padding: 0.375rem; border-radius: 1rem; border: 1px solid #e2e8f0; }
        .toggle-btn { border: none; background: transparent; padding: 0.625rem 1.5rem; border-radius: 0.75rem; font-size: 0.875rem; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 0.625rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .toggle-btn.active { background: white; color: var(--primary-color); box-shadow: 0 4px 12px rgba(0,0,0,0.08); transform: scale(1.02); }
        .toggle-btn:hover:not(.active) { color: var(--neutral-900); background: rgba(255,255,255,0.5); }
        
        .search-box { flex: 1; display: flex; align-items: center; gap: 0.875rem; background: white; border: 1px solid var(--neutral-200); border-radius: 1rem; padding: 0.625rem 1.25rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); transition: all 0.2s; }
        .search-box:focus-within { border-color: var(--primary-color); box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08); }
        .search-box input { border: none; outline: none; background: transparent; width: 100%; font-size: 0.9375rem; color: var(--neutral-900); }
        
        .btn-filter { background: white; border: 1px solid var(--neutral-200); padding: 0.625rem 1.25rem; border-radius: 1rem; font-weight: 600; font-size: 0.9375rem; transition: all 0.2s; display: flex; align-items: center; }
        .btn-filter:hover { background: var(--neutral-50); border-color: var(--neutral-300); }

        .btn-book { background: linear-gradient(135deg, var(--primary-color), #1d4ed8); color: white; padding: 0.625rem 1.5rem; border-radius: 1rem; font-weight: 700; font-size: 0.9375rem; border: none; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); display: flex; align-items: center; }
        .btn-book:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3); filter: brightness(1.05); }

        .card { border-radius: 1.5rem !important; border: 1px solid var(--neutral-100); overflow: hidden; }
        .table thead th { background: #f8fafc; padding: 1.25rem 1.5rem; font-size: 0.75rem; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; color: #64748b; }
        .table tbody tr { transition: background 0.2s; cursor: pointer; }
        .table tbody tr:hover { background: #f8fafc; }
        .table tbody td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }

        .time-cell { display: flex; flex-direction: column; gap: 0.125rem; }
        .time-main { font-weight: 800; color: var(--neutral-900); font-size: 1rem; }
        .time-sub { font-size: 0.8125rem; color: var(--neutral-500); font-weight: 500; }

        .patient-cell { display: flex; align-items: center; gap: 1rem; }
        .avatar-box { width: 2.75rem; height: 2.75rem; background: linear-gradient(135deg, #e0f2fe, #bae6fd); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: var(--primary-color); transition: all 0.3s; }
        tr:hover .avatar-box { transform: scale(1.1) rotate(-5deg); background: var(--primary-color); color: white; }
        .patient-name { font-weight: 800; color: var(--neutral-900); font-size: 1rem; }

        .chair-badge { background: #f1f5f9; color: #475569; padding: 0.375rem 0.875rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.8125rem; border: 1px solid #e2e8f0; }

        .status-badge { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; padding: 0.5rem 1rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.5rem; }
        .status-badge:before { content: ""; width: 0.5rem; height: 0.5rem; border-radius: 50%; }
        
        .status-badge.confirmed { background: #dbeafe; color: #1e40af; }
        .status-badge.confirmed:before { background: #2563eb; }
        
        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .status-badge.pending:before { background: #f59e0b; }
        
        .status-badge.checked-in { background: #dcfce7; color: #166534; }
        .status-badge.checked-in:before { background: #22c55e; }
        
        .status-badge.no-show { background: #fee2e2; color: #991b1b; }
        .status-badge.no-show:before { background: #ef4444; }

        .action-btns { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .btn-mini { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; border: 1.5px solid transparent; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: var(--neutral-50); color: var(--neutral-400); }
        .btn-mini:hover { transform: scale(1.1); background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .btn-mini.success:hover { color: var(--success-color); border-color: var(--success-color); background: #f0fdf4; }
        .btn-mini.danger:hover { color: var(--danger-color); border-color: var(--danger-color); background: #fef2f2; }
        .btn-mini.info:hover { color: var(--primary-color); border-color: var(--primary-color); background: #f0f9ff; }

        .calendar-placeholder { background: white; border-radius: 2rem; border: 1px solid var(--neutral-100); padding: 5rem 2rem; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.03); }
        .calendar-icon-bg { width: 8rem; height: 8rem; background: #f8fafc; border-radius: 2.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; color: #cbd5e1; position: relative; border: 1px solid #f1f5f9; }
        
        .fw-600 { font-weight: 600; }
      `}} />
    </AdminLayout>
  );
};

export default AppointmentManagementPage;
