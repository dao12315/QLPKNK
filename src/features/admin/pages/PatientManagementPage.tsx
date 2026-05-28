import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Search,
  Download,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";
import { Modal } from "@/src/shared/components/ui/Modal";

import { patientService } from "@/src/services/patientService";
import { PatientDto } from "@/src/types/patient";

const PatientManagementPage = () => {
  const [patients, setPatients] = useState<PatientDto[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDto | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await patientService.getAll({
        page,
        size,
        sort: "name,asc",
        keyword: search || undefined,
      });

      setPatients(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Fetch patients error:", err);
      setError("Không tải được danh sách bệnh nhân.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (patient: PatientDto) => {
    try {
      setDetailLoading(true);
      setSelectedPatient(patient);

      const id = patient.patientId || patient.userId;
      const res = await patientService.getById(id);

      setSelectedPatient(res.data);
    } catch (err) {
      console.error("Fetch patient detail error:", err);
      setSelectedPatient(patient);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeletePatient = async (patient: PatientDto) => {
    const ok = window.confirm("Bạn có chắc muốn xóa bệnh nhân này không?");
    if (!ok) return;

    try {
      const id = patient.patientId || patient.userId;

      await patientService.delete(id);
      await fetchPatients();

      if (selectedPatient?.patientId === patient.patientId) {
        setSelectedPatient(null);
      }
    } catch (err) {
      console.error("Delete patient error:", err);
      alert("Xóa bệnh nhân thất bại.");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page]);

  const filteredPatients = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return patients;

    return patients.filter((patient) => {
      return (
        patient.name?.toLowerCase().includes(keyword) ||
        patient.email?.toLowerCase().includes(keyword) ||
        patient.phone?.toLowerCase().includes(keyword)
      );
    });
  }, [patients, search]);

  const getInitials = (name?: string) => {
    if (!name) return "?";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "Chưa cập nhật";
    }
  };

  const startIndex = totalElements === 0 ? 0 : page * size + 1;
  const endIndex = Math.min((page + 1) * size, totalElements);

  return (
    <AdminLayout title="Patient Management">
      <div className="patient-management">
        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="toolbar card shadow-sm">
          <div className="search-section">
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name, email or phone..."
              icon={<Search size={18} />}
            />
          </div>

          <div className="filter-actions">
            <Button
              onClick={() => {
                setPage(0);
                fetchPatients();
              }}
            >
              <Search size={18} />
              Search
            </Button>

            <Button variant="outline">
              <Download size={18} />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="table-card card shadow-sm">
          <div className="table-header">
            <h3 className="table-title">Full Patient List</h3>
            <span className="table-count text-muted">
              {totalElements} patients total
            </span>
          </div>

          <div className="table-responsive">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Contact Info</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="empty-cell">
                      Đang tải danh sách bệnh nhân...
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-cell">
                      Không tìm thấy bệnh nhân nào.
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((p, i) => (
                    <tr key={p.patientId || p.userId} className="table-row">
                      <td className="text-muted">{page * size + i + 1}</td>

                      <td>
                        <div className="pat-info">
                          <div className="pat-initials">
                            {getInitials(p.name)}
                          </div>
                          <span className="pat-name-text">{p.name}</span>
                        </div>
                      </td>

                      <td>
                        <span className="pat-email">{p.email}</span>
                      </td>

                      <td>
                        <span className="pat-phone">
                          {p.phone || "Chưa cập nhật"}
                        </span>
                      </td>

                      <td>
                        <span className={`gender-tag ${p.gender || "unknown"}`}>
                          {getGenderLabel(p.gender)}
                        </span>
                      </td>

                      <td className="text-sm font-medium">
                        {p.dob || "Chưa cập nhật"}
                      </td>

                      <td>
                        <div className="action-btns">
                          <button
                            className="view-btn"
                            onClick={() => handleViewDetail(p)}
                          >
                            <Eye size={16} />
                            Details
                          </button>

                          <button
                            className="delete-btn-inline"
                            onClick={() => handleDeletePatient(p)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="pagination-info">
              Showing {startIndex} to {endIndex} of {totalElements}
            </div>

            <div className="pagination-btns">
              <button
                className={`pag-btn ${page <= 0 ? "disabled" : ""}`}
                disabled={page <= 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                <ChevronLeft size={16} />
              </button>

              <button className="pag-btn active">{page + 1}</button>

              <button
                className={`pag-btn ${page + 1 >= totalPages ? "disabled" : ""}`}
                disabled={page + 1 >= totalPages}
                onClick={() =>
                  setPage((prev) => (prev + 1 >= totalPages ? prev : prev + 1))
                }
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title="Chi tiết bệnh nhân"
          size="lg"
          footer={
            <button
              type="button"
              className="close-modal-btn"
              onClick={() => setSelectedPatient(null)}
            >
              <X size={16} />
              Đóng
            </button>
          }
        >
          {detailLoading ? (
            <div className="detail-loading">Đang tải chi tiết...</div>
          ) : selectedPatient ? (
            <div className="patient-detail">
              <div className="detail-row">
                <span>Họ tên</span>
                <strong>{selectedPatient.name}</strong>
              </div>

              <div className="detail-row">
                <span>Email</span>
                <strong>{selectedPatient.email}</strong>
              </div>

              <div className="detail-row">
                <span>Số điện thoại</span>
                <strong>{selectedPatient.phone || "Chưa cập nhật"}</strong>
              </div>

              <div className="detail-row">
                <span>Giới tính</span>
                <strong>{getGenderLabel(selectedPatient.gender)}</strong>
              </div>

              <div className="detail-row">
                <span>Ngày sinh</span>
                <strong>{selectedPatient.dob || "Chưa cập nhật"}</strong>
              </div>

              <div className="detail-row">
                <span>Địa chỉ</span>
                <strong>{selectedPatient.address || "Chưa cập nhật"}</strong>
              </div>

              <div className="detail-block">
                <span>Tiền sử bệnh</span>
                <p>{selectedPatient.medicalHistory || "Chưa cập nhật"}</p>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
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

        .toolbar { padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
        @media (min-width: 1024px) { .toolbar { flex-direction: row; justify-content: space-between; align-items: center; } }
        
        .search-section { flex: 1; max-width: 32rem; }
        .filter-actions { display: flex; align-items: center; gap: 1rem; }
        
        .table-card { padding: 0; }
        .table-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--neutral-100); display: flex; align-items: center; gap: 1rem; }
        .table-title { font-size: 1.125rem; font-weight: 800; color: var(--neutral-900); }
        .table-count { font-size: 0.8125rem; font-weight: 500; }
        
        .table-responsive { overflow-x: auto; }
        .patient-table { width: 100%; border-collapse: collapse; text-align: left; }
        .patient-table th { padding: 1rem 1.5rem; background: var(--neutral-50); font-size: 0.75rem; font-weight: 700; color: var(--neutral-500); text-transform: uppercase; border-bottom: 1px solid var(--neutral-100); }
        .patient-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--neutral-50); vertical-align: middle; }

        .empty-cell {
          padding: 3rem 1.5rem !important;
          text-align: center;
          color: var(--neutral-400);
          font-weight: 700;
          font-size: 0.875rem;
        }
        
        .pat-info { display: flex; align-items: center; gap: 0.75rem; }
        .pat-initials { width: 2rem; height: 2rem; border-radius: 0.5rem; background: var(--primary-soft); color: var(--primary-color); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; }
        .pat-name-text { font-weight: 700; color: var(--neutral-900); }
        .pat-phone { font-size: 0.875rem; color: var(--neutral-600); font-family: var(--font-mono); }
        .pat-email { font-size: 0.875rem; color: var(--neutral-600); }
        
        .gender-tag { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 700; }
        .gender-tag.male { background: #eff6ff; color: #3b82f6; }
        .gender-tag.female { background: #fdf2f8; color: #ec4899; }
        .gender-tag.other { background: #f5f3ff; color: #8b5cf6; }
        .gender-tag.unknown { background: #f3f4f6; color: #6b7280; }

        .action-btns {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .view-btn { 
          display: flex; align-items: center; gap: 0.5rem; 
          padding: 0.5rem 0.75rem; border-radius: 0.625rem; 
          background: var(--neutral-50); color: var(--neutral-600); font-size: 0.75rem; font-weight: 700;
          transition: 0.2s; border: none; cursor: pointer;
        }

        .view-btn:hover { background: var(--primary-color); color: white; }

        .delete-btn-inline {
          width: 2.25rem;
          height: 2.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.625rem;
          border: none;
          background: #fef2f2;
          color: #ef4444;
          cursor: pointer;
          transition: 0.2s;
        }

        .delete-btn-inline:hover {
          background: #ef4444;
          color: white;
        }
        
        .table-footer { padding: 1.25rem 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; }
        @media (min-width: 640px) { .table-footer { flex-direction: row; justify-content: space-between; } }
        .pagination-info { font-size: 0.8125rem; color: var(--neutral-500); font-weight: 500; }
        .pagination-btns { display: flex; gap: 0.25rem; }

        .pag-btn { 
          width: 2.25rem; height: 2.25rem; display: flex; align-items: center; justify-content: center;
          border-radius: 0.625rem; font-size: 0.8125rem; font-weight: 700; color: var(--neutral-500);
          border: none; background: none; cursor: pointer; transition: 0.2s;
        }

        .pag-btn:hover:not(.disabled) { background: var(--neutral-100); color: var(--neutral-900); }
        .pag-btn.active { background: var(--primary-color); color: white; }
        .pag-btn.disabled { opacity: 0.3; cursor: not-allowed; }

        .patient-detail {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1rem;
          border-radius: 0.875rem;
          background: var(--neutral-50);
        }

        .detail-row span,
        .detail-block span {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--neutral-500);
          text-transform: uppercase;
        }

        .detail-row strong {
          font-size: 0.875rem;
          font-weight: 800;
          color: var(--neutral-900);
          text-align: right;
        }

        .detail-block {
          padding: 0.85rem 1rem;
          border-radius: 0.875rem;
          background: var(--neutral-50);
        }

        .detail-block p {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-700);
          line-height: 1.5;
        }

        .detail-loading {
          padding: 2rem;
          text-align: center;
          color: var(--neutral-400);
          font-size: 0.875rem;
          font-weight: 700;
        }

        .close-modal-btn {
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
          border: 1px solid var(--neutral-200);
          background: white;
          color: var(--neutral-600);
        }

        .close-modal-btn:hover {
          background: var(--neutral-50);
          color: var(--neutral-900);
        }
      `,
        }}
      />
    </AdminLayout>
  );
};

export default PatientManagementPage;
