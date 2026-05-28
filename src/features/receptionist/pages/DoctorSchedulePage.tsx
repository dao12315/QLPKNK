import React, { useState } from 'react';
import AdminLayout from '../../admin/layouts/AdminLayout';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Clock, 
  User,
  Info
} from 'lucide-react';

const DoctorSchedulePage = () => {
  const [weekOffset, setWeekOffset] = useState(0);

  const doctors = [
    { id: 1, name: 'Dr. Nguyen Van A', specialty: 'General Dentistry', color: '#2563eb' },
    { id: 2, name: 'Dr. Tran Thi B', specialty: 'Orthodontics', color: '#7c3aed' },
    { id: 3, name: 'Dr. Le Van C', specialty: 'Oral Surgery', color: '#db2777' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const schedules = [
    { doctorId: 1, day: 0, shift: '08:00 - 12:00', slots: 8, booked: 5 },
    { doctorId: 1, day: 1, shift: '08:00 - 12:00', slots: 8, booked: 8 },
    { doctorId: 1, day: 2, shift: '13:30 - 17:30', slots: 8, booked: 2 },
    { doctorId: 2, day: 0, shift: '13:30 - 17:30', slots: 8, booked: 4 },
    { doctorId: 2, day: 1, shift: '08:00 - 12:00', slots: 8, booked: 0 },
  ];

  return (
    <AdminLayout title="Doctor Schedules">
      <div className="doctor-schedules">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div className="d-flex align-items-center gap-4">
            <div className="modern-week-picker">
              <button className="nav-btn-circle" onClick={() => setWeekOffset(v => v-1)}><ChevronLeft size={20} /></button>
              <div className="date-range">
                <span className="label">Current Week</span>
                <span className="dates">May 11 - May 17, 2026</span>
              </div>
              <button className="nav-btn-circle" onClick={() => setWeekOffset(v => v+1)}><ChevronRight size={20} /></button>
            </div>
            <button className="btn-today-pill">Today</button>
          </div>

          <div className="d-flex gap-3">
            <div className="search-box-glow">
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Find a doctor..." />
            </div>
            <div className="filter-dropdown-wrapper">
              <Filter size={16} className="filter-icon" />
              <select className="premium-select">
                <option>All Specializations</option>
                <option>General Dentistry</option>
                <option>Orthodontics</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card shadow-luxury border-0">
          <div className="table-responsive">
            <table className="table schedule-modern-table mb-0">
              <thead>
                <tr>
                  <th className="doctor-header-col">Doctor</th>
                  {days.map((day, i) => (
                    <th key={i} className="text-center day-header-cell">
                      <div className="day-info">
                        <span className="day-name">{day.substring(0, 3)}</span>
                        <span className="day-number">{11 + i}</span>
                        <span className="day-month">MAY</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctors.map(doc => (
                  <tr key={doc.id}>
                    <td className="doctor-info-cell">
                      <div className="doctor-profile-mini">
                        <div className="doctor-avatar-glow" style={{ '--glow-color': doc.color } as React.CSSProperties}>
                          <User size={20} />
                        </div>
                        <div className="doctor-meta">
                          <span className="doctor-name">{doc.name}</span>
                          <span className="doctor-spec">{doc.specialty}</span>
                        </div>
                      </div>
                    </td>
                    {days.map((_, dayIdx) => {
                      const shift = schedules.find(s => s.doctorId === doc.id && s.day === dayIdx);
                      return (
                        <td key={dayIdx} className="slot-cell">
                          {shift ? (
                            <div className="shift-pill-card" style={{ '--doc-color': doc.color } as React.CSSProperties}>
                              <div className="shift-header">
                                <Clock size={12} />
                                <span>{shift.shift}</span>
                              </div>
                              <div className="shift-progress-area">
                                <div className="mini-progress-track">
                                  <div 
                                    className={`mini-progress-fill ${shift.booked === shift.slots ? 'full' : ''}`} 
                                    style={{ width: `${(shift.booked / shift.slots) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="slot-count">
                                  <span>{shift.booked}/{shift.slots}</span>
                                  {shift.booked === shift.slots && <span className="full-badge">FULL</span>}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="empty-slot-indicator"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="instruction-footer-card">
           <div className="icon-wrapper"><Info size={24} /></div>
           <div className="content">
             <h5>Scheduling Assistance</h5>
             <p>Select a slot to view detailed appointments or manage emergency gaps. Real-time availability is synced across all reception terminals.</p>
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .doctor-schedules { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .modern-week-picker { display: flex; align-items: center; gap: 1.5rem; background: white; padding: 0.5rem 0.75rem; border-radius: 1.5rem; border: 1.5px solid #eef2f6; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .nav-btn-circle { width: 2.75rem; height: 2.75rem; border: none; background: #f8fafc; color: #94a3b8; border-radius: 1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .nav-btn-circle:hover { background: white; color: var(--primary-color); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .date-range { display: flex; flex-direction: column; align-items: center; min-width: 180px; }
        .date-range .label { font-size: 0.625rem; font-weight: 800; color: #94a3b8; text-uppercase: uppercase; letter-spacing: 0.1em; }
        .date-range .dates { font-size: 1rem; font-weight: 800; color: #1e293b; }

        .btn-today-pill { background: white; border: 1.5px solid #eef2f6; padding: 0.5rem 1.5rem; border-radius: 1rem; font-weight: 800; font-size: 0.875rem; color: var(--primary-color); transition: all 0.2s; }
        .btn-today-pill:hover { background: var(--primary-soft); border-color: var(--primary-soft); color: var(--primary-color); }

        .search-box-glow { display: flex; align-items: center; gap: 0.875rem; background: white; border: 1.5px solid #eef2f6; border-radius: 1.25rem; padding: 0.625rem 1.25rem; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .search-box-glow input { border: none; outline: none; background: transparent; font-size: 0.9375rem; width: 180px; font-weight: 600; color: #1e293b; }

        .filter-dropdown-wrapper { position: relative; display: flex; align-items: center; }
        .filter-icon { position: absolute; left: 1rem; color: #94a3b8; pointer-events: none; }
        .premium-select { background: white; border: 1.5px solid #eef2f6; padding: 0.625rem 1.25rem 0.625rem 2.5rem; border-radius: 1.25rem; font-weight: 700; font-size: 0.875rem; color: #475569; outline: none; transition: all 0.2s; cursor: pointer; appearance: none; }
        .premium-select:hover { border-color: #cbd5e1; background: #f8fafc; }

        .shadow-luxury { border-radius: 2.5rem !important; box-shadow: 0 20px 60px rgba(0,0,0,0.04) !important; background: white; overflow: hidden; }
        .schedule-modern-table { border-collapse: separate; border-spacing: 0; table-layout: fixed; }
        
        .doctor-header-col { width: 320px; background: #f8fafc; padding: 2rem !important; font-size: 0.75rem; font-weight: 800; color: #94a3b8; border-bottom: 2px solid #eef2f6; }
        .day-header-cell { padding: 1.5rem !important; border-bottom: 2px solid #eef2f6; background: #f8fafc; }
        .day-info { display: flex; flex-direction: column; align-items: center; gap: 0.125rem; }
        .day-name { font-size: 0.6875rem; font-weight: 800; color: #94a3b8; }
        .day-number { font-size: 1.5rem; font-weight: 950; color: #1e293b; line-height: 1; margin: 0.125rem 0; }
        .day-month { font-size: 0.625rem; font-weight: 900; color: var(--primary-color); letter-spacing: 0.1em; }

        .doctor-info-cell { background: white; border-bottom: 1.5px solid #f1f5f9; padding: 1.5rem 2rem !important; }
        .doctor-profile-mini { display: flex; align-items: center; gap: 1.25rem; }
        .doctor-avatar-glow { width: 3.5rem; height: 3.5rem; border-radius: 1.25rem; background: white; display: flex; align-items: center; justify-content: center; color: var(--doc-color); box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; overflow: hidden; color: var(--glow-color); }
        .doctor-avatar-glow:after { content: ""; position: absolute; inset: 0; background: var(--glow-color); opacity: 0.08; }
        
        .doctor-meta { display: flex; flex-direction: column; }
        .doctor-name { font-size: 1.0625rem; font-weight: 800; color: #0f172a; }
        .doctor-spec { font-size: 0.8125rem; font-weight: 600; color: #64748b; }

        .slot-cell { position: relative; border-bottom: 1.5px solid #f1f5f9; border-left: 1.5px solid #f1f5f9; padding: 0.75rem !important; background: #fdfdfd; transition: all 0.2s; }
        .slot-cell:hover { background: #f8fafc; }
        
        .shift-pill-card { background: white; border-radius: 1.25rem; padding: 1rem; border: 1.5px solid #f1f5f9; border-left: 4px solid var(--doc-color); box-shadow: 0 10px 20px rgba(0,0,0,0.03); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .shift-pill-card:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(0,0,0,0.06); }
        
        .shift-header { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 800; color: #475569; margin-bottom: 0.75rem; letter-spacing: -0.01em; }
        .shift-progress-area { display: flex; flex-direction: column; gap: 0.5rem; }
        .mini-progress-track { height: 6px; background: #f1f5f9; border-radius: 9999px; overflow: hidden; }
        .mini-progress-fill { height: 100%; background: var(--primary-color); border-radius: 9999px; transition: width 0.5s ease; }
        .mini-progress-fill.full { background: #ef4444; }

        .slot-count { display: flex; justify-content: space-between; align-items: center; font-size: 0.6875rem; font-weight: 800; color: #94a3b8; }
        .full-badge { color: #ef4444; background: #fee2e2; padding: 0.125rem 0.5rem; border-radius: 0.5rem; font-size: 0.625rem; }

        .empty-slot-indicator { height: 80px; display: flex; align-items: center; justify-content: center; opacity: 0.5; background-image: radial-gradient(#e2e8f0 1px, transparent 1px); background-size: 20px 20px; }

        .instruction-footer-card { margin-top: 3rem; background: linear-gradient(135deg, #1e293b, #0f172a); border-radius: 2rem; padding: 2.5rem; display: flex; align-items: center; gap: 2rem; color: white; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .icon-wrapper { width: 4.5rem; height: 4.5rem; background: rgba(255,255,255,0.1); border-radius: 1.5rem; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); }
        .instruction-footer-card .content h5 { font-weight: 900; font-size: 1.25rem; margin-bottom: 0.5rem; }
        .instruction-footer-card .content p { margin: 0; opacity: 0.7; font-weight: 500; font-size: 0.9375rem; line-height: 1.6; }

        .fw-950 { font-weight: 950; }
      `}} />
    </AdminLayout>
  );
};

export default DoctorSchedulePage;
