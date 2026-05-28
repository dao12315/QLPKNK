import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Search,
  Plus,
  Calendar,
  Phone,
  Edit2,
  AlertCircle,
  Trash2,
  X,
  Clock,
  Save,
} from "lucide-react";

import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";
import { Modal } from "@/src/shared/components/ui/Modal";

import { doctorService } from "@/src/services/doctorService";
import { scheduleService } from "@/src/services/scheduleService";

import {
  DoctorDto,
  DoctorScheduleDto,
  CreateDoctorDto,
  DAY_OF_WEEK_LABELS,
} from "@/src/types/doctor";

const DoctorManagementPage = () => {
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [schedules, setSchedules] = useState<DoctorScheduleDto[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorDto | null>(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState<CreateDoctorDto>({
    name: "",
    email: "",
    password: "",
    fullName: "",
    specialization: "",
    experienceYears: 0,
    phone: "",
  });

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await doctorService.getAll({
        page: 0,
        size: 100,
        keyword: search || undefined,
      });

      setDoctors(res.data.content || []);
    } catch (err) {
      console.error("Fetch doctors error:", err);
      setError("Không tải được danh sách bác sĩ.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorSchedules = async (doctor: DoctorDto) => {
    try {
      setSelectedDoctor(doctor);
      setScheduleLoading(true);
      setSchedules([]);

      const res = await scheduleService.getByDoctor(doctor.id);
      setSchedules(res.data || []);
    } catch (err) {
      console.error("Fetch doctor schedules error:", err);
      setSchedules([]);
    } finally {
      setScheduleLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      fullName: "",
      specialization: "",
      experienceYears: 0,
      phone: "",
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddOpen(true);
  };

  const handleCloseAdd = () => {
    if (saving) return;
    setIsAddOpen(false);
    resetForm();
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên tài khoản.");
      return;
    }

    if (!form.email.trim()) {
      alert("Vui lòng nhập email.");
      return;
    }

    if (!form.password.trim()) {
      alert("Vui lòng nhập mật khẩu.");
      return;
    }

    if (form.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (!form.fullName.trim()) {
      alert("Vui lòng nhập họ tên bác sĩ.");
      return;
    }

    if (!form.specialization.trim()) {
      alert("Vui lòng nhập chuyên khoa.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }

    try {
      setSaving(true);

      await doctorService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        specialization: form.specialization.trim(),
        experienceYears: Number(form.experienceYears) || 0,
        phone: form.phone.trim(),
      });

      await fetchDoctors();

      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      console.error("Create doctor error:", err);
      alert(
        "Tạo bác sĩ thất bại. Kiểm tra email có bị trùng hoặc dữ liệu chưa đúng.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn xóa bác sĩ này không?");
    if (!ok) return;

    try {
      await doctorService.delete(id);

      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));

      if (selectedDoctor?.id === id) {
        setSelectedDoctor(null);
        setSchedules([]);
      }
    } catch (err) {
      console.error("Delete doctor error:", err);
      alert("Xóa bác sĩ thất bại.");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return doctors;

    return doctors.filter((doctor) => {
      const fullName = doctor.fullName || "";
      const specialization = doctor.specialization || "";
      const phone = doctor.phone || "";

      return (
        fullName.toLowerCase().includes(keyword) ||
        specialization.toLowerCase().includes(keyword) ||
        phone.toLowerCase().includes(keyword)
      );
    });
  }, [doctors, search]);

  const formatScheduleText = (doctorId: string) => {
    if (selectedDoctor?.id !== doctorId || schedules.length === 0) {
      return "Bấm Schedule để xem lịch làm việc";
    }

    return schedules
      .filter((schedule) => schedule.isActive !== false)
      .map((schedule) => {
        const day =
          DAY_OF_WEEK_LABELS[schedule.dayOfWeek] || `Thứ ${schedule.dayOfWeek}`;

        return `${day} (${schedule.startTime} - ${schedule.endTime})`;
      })
      .join(", ");
  };

  return (
    <AdminLayout title="Doctors Directory">
      <div className="doctor-management">
        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="top-actions">
          <div className="search-bar">
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search doctors..."
              icon={<Search size={18} />}
            />
          </div>

          <div className="top-buttons">
            <Button onClick={fetchDoctors}>
              <Search size={18} />
              Search
            </Button>

            <Button onClick={handleOpenAdd}>
              <Plus size={18} />
              Add Doctor
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Đang tải danh sách bác sĩ...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="empty-state">Không tìm thấy bác sĩ nào.</div>
        ) : (
          <div className="doctor-grid">
            {filteredDoctors.map((doc) => {
              const doctorName = doc.fullName || "Unknown Doctor";
              const specialization =
                doc.specialization || "Chưa có chuyên khoa";
              const experienceYears = doc.experienceYears ?? 0;
              const phone = doc.phone || "Chưa có số điện thoại";

              return (
                <div key={doc.id} className="doctor-card card shadow-sm">
                  <div className="card-top">
                    <div className="doc-avatar">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          doctorName,
                        )}&background=f0f9ff&color=0369a1`}
                        alt={doctorName}
                      />
                      <span className="status-dot active"></span>
                    </div>

                    <div className="doc-header">
                      <h3 className="doc-name">{doctorName}</h3>
                      <span className="doc-spec">{specialization}</span>
                    </div>
                  </div>

                  <div className="doc-stats">
                    <div className="doc-stat">
                      <span className="stat-val">{experienceYears}y</span>
                      <span className="stat-label">Exp</span>
                    </div>

                    <div className="doc-stat border-l">
                      <span className="stat-val">--</span>
                      <span className="stat-label">Rating</span>
                    </div>

                    <div className="doc-stat border-l">
                      <span className="stat-val">--</span>
                      <span className="stat-label">Cases</span>
                    </div>
                  </div>

                  <div className="doc-info-list">
                    <div className="info-item">
                      <Phone size={14} />
                      <span>{phone}</span>
                    </div>

                    <div className="info-item">
                      <Calendar size={14} />
                      <span>{formatScheduleText(doc.id)}</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className="action-btn-secondary"
                      onClick={() => fetchDoctorSchedules(doc)}
                    >
                      <Calendar size={16} />
                      Schedule
                    </button>

                    <button className="action-btn-primary">
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteDoctor(doc.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {selectedDoctor && (
          <div className="schedule-panel">
            <div className="schedule-panel-header">
              <div>
                <h3>Lịch làm việc: {selectedDoctor.fullName}</h3>
                <p>Danh sách ca làm việc theo bác sĩ</p>
              </div>

              <button
                className="close-btn"
                onClick={() => {
                  setSelectedDoctor(null);
                  setSchedules([]);
                }}
              >
                <X size={18} />
              </button>
            </div>

            {scheduleLoading ? (
              <div className="empty-state small">Đang tải lịch làm việc...</div>
            ) : schedules.length === 0 ? (
              <div className="empty-state small">
                Bác sĩ này chưa có lịch làm việc.
              </div>
            ) : (
              <div className="schedule-list">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="schedule-item">
                    <div className="schedule-icon">
                      <Clock size={16} />
                    </div>

                    <div>
                      <p className="schedule-day">
                        {DAY_OF_WEEK_LABELS[schedule.dayOfWeek] ||
                          `Thứ ${schedule.dayOfWeek}`}
                      </p>
                      <p className="schedule-time">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>

                    <span
                      className={`schedule-status ${
                        schedule.isActive ? "active" : "inactive"
                      }`}
                    >
                      {schedule.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Modal
          isOpen={isAddOpen}
          onClose={handleCloseAdd}
          title="Thêm bác sĩ"
          size="lg"
          footer={
            <>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCloseAdd}
                disabled={saving}
              >
                Hủy
              </button>

              <button
                type="submit"
                form="add-doctor-form"
                className="save-btn"
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu bác sĩ"}
              </button>
            </>
          }
        >
          <form
            id="add-doctor-form"
            onSubmit={handleCreateDoctor}
            className="doctor-form"
          >
            <div className="form-row">
              <div className="form-group">
                <label>Tên tài khoản</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="VD: Nguyen Van A"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="VD: doctor@gmail.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div className="form-group">
              <label>Họ tên bác sĩ</label>
              <input
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                placeholder="VD: Dr. Nguyễn Văn A"
              />
            </div>

            <div className="form-group">
              <label>Chuyên khoa</label>
              <input
                value={form.specialization}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    specialization: e.target.value,
                  }))
                }
                placeholder="VD: General Dentistry"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số năm kinh nghiệm</label>
                <input
                  type="number"
                  min={0}
                  value={form.experienceYears}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      experienceYears: Number(e.target.value),
                    }))
                  }
                  placeholder="VD: 5"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="VD: 0912345678"
                />
              </div>
            </div>
          </form>
        </Modal>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .top-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
        .search-bar { flex: 1; max-width: 24rem; }
        .top-buttons { display: flex; gap: 0.75rem; align-items: center; }

        .error-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #dc2626;
          font-size: 0.875rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .empty-state {
          padding: 3rem;
          background: white;
          border: 1px solid var(--neutral-100);
          border-radius: 1.5rem;
          text-align: center;
          color: var(--neutral-400);
          font-size: 0.875rem;
          font-weight: 700;
        }

        .empty-state.small {
          padding: 1.5rem;
        }
        
        .doctor-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.5rem; }
        @media (min-width: 768px) { .doctor-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1280px) { .doctor-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .doctor-card { padding: 1.5rem; transition: transform 0.2s, box-shadow 0.2s; position: relative; }
        .doctor-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        
        .card-top { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.5rem; }
        .doc-avatar { width: 4rem; height: 4rem; border-radius: 1rem; overflow: hidden; position: relative; flex-shrink: 0; }
        .doc-avatar img { width: 100%; height: 100%; object-fit: cover; }
        
        .status-dot { position: absolute; bottom: 0; right: 0; width: 0.75rem; height: 0.75rem; border: 2px solid white; border-radius: 50%; }
        .status-dot.active { background: var(--success-color); }
        .status-dot.inactive { background: var(--neutral-400); }
        
        .doc-name { font-size: 1.125rem; font-weight: 800; color: var(--neutral-900); }
        .doc-spec { font-size: 0.8125rem; font-weight: 600; color: var(--primary-color); display: block; margin-top: 0.125rem; }
        
        .doc-stats { display: grid; grid-template-columns: repeat(3, 1fr); background: var(--neutral-50); border-radius: 0.75rem; padding: 0.75rem 0; margin-bottom: 1.5rem; }
        .doc-stat { text-align: center; display: flex; flex-direction: column; }
        .stat-val { font-size: 0.9375rem; font-weight: 800; color: var(--neutral-900); }
        .stat-label { font-size: 0.625rem; font-weight: 700; color: var(--neutral-400); text-transform: uppercase; }
        .border-l { border-left: 1px solid var(--neutral-200); }
        
        .doc-info-list { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
        .info-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8125rem; color: var(--neutral-600); font-weight: 500; line-height: 1.4; }
        
        .card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .action-btn-primary, .action-btn-secondary { 
          display: flex; align-items: center; justify-content: center; gap: 0.5rem; 
          padding: 0.625rem; border-radius: 0.75rem; font-size: 0.75rem; font-weight: 700; 
          transition: 0.2s; cursor: pointer;
        }
        
        .action-btn-primary { background: var(--primary-color); color: white; border: none; }
        .action-btn-primary:hover { background: var(--primary-hover); }
        
        .action-btn-secondary { background: white; border: 1px solid var(--neutral-200); color: var(--neutral-600); }
        .action-btn-secondary:hover { background: var(--neutral-50); color: var(--neutral-900); }

        .delete-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          border-radius: 0.75rem;
          border: 1px solid var(--neutral-200);
          background: white;
          color: var(--neutral-400);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .delete-btn:hover {
          background: #fef2f2;
          color: #ef4444;
          border-color: #fecaca;
        }

        .schedule-panel {
          margin-top: 2rem;
          background: white;
          border: 1px solid var(--neutral-100);
          border-radius: 1.5rem;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .schedule-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .schedule-panel-header h3 {
          font-size: 1rem;
          font-weight: 800;
          color: var(--neutral-900);
        }

        .schedule-panel-header p {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neutral-400);
          margin-top: 0.25rem;
        }

        .close-btn {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 0.75rem;
          border: 1px solid var(--neutral-200);
          background: white;
          color: var(--neutral-500);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .close-btn:hover {
          background: var(--neutral-50);
          color: var(--neutral-900);
        }

        .schedule-list {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .schedule-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .schedule-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid var(--neutral-100);
          background: var(--neutral-50);
        }

        .schedule-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.75rem;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          flex-shrink: 0;
        }

        .schedule-day {
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--neutral-900);
        }

        .schedule-time {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--neutral-500);
          margin-top: 0.125rem;
        }

        .schedule-status {
          margin-left: auto;
          font-size: 0.625rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
        }

        .schedule-status.active {
          background: #ecfdf5;
          color: #059669;
        }

        .schedule-status.inactive {
          background: #f1f5f9;
          color: #64748b;
        }

        .doctor-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--neutral-700);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .form-group input {
          width: 100%;
          border: 1px solid var(--neutral-200);
          border-radius: 0.875rem;
          padding: 0.8rem 1rem;
          outline: none;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-800);
          background: white;
        }

        .form-group input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }

        .form-group small {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--neutral-400);
        }

        .cancel-btn,
        .save-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 0.875rem;
          padding: 0.75rem 1rem;
          font-size: 0.8125rem;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .cancel-btn {
          border: 1px solid var(--neutral-200);
          background: white;
          color: var(--neutral-600);
        }

        .cancel-btn:hover {
          background: var(--neutral-50);
          color: var(--neutral-900);
        }

        .save-btn {
          border: none;
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 8px 18px rgba(37, 99, 235, 0.25);
        }

        .save-btn:hover {
          background: #1d4ed8;
        }

        .save-btn:active {
          background: #1e40af;
        }

        .save-btn:disabled,
        .cancel-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `,
        }}
      />
    </AdminLayout>
  );
};

export default DoctorManagementPage;
