import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Clock,
  DollarSign,
  AlertCircle,
  Save,
} from "lucide-react";

import { Button } from "@/src/shared/components/ui/Button";
import { Modal } from "@/src/shared/components/ui/Modal";

import { serviceService } from "@/src/services/serviceService";
import {
  ServiceDto,
  CreateServiceDto,
  UpdateServiceDto,
} from "@/src/types/service";

const ServiceManagementPage = () => {
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceDto | null>(
    null,
  );

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [form, setForm] = useState<CreateServiceDto>({
    name: "",
    description: "",
    price: 0,
    durationMinutes: 0,
    isActive: true,
  });

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await serviceService.getAll({
        page: 0,
        size: 100,
        keyword: search || undefined,
      });

      setServices(res.data.content || []);
    } catch (err) {
      console.error("Fetch services error:", err);
      setError("Không tải được danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: 0,
      durationMinutes: 0,
      isActive: true,
    });
  };

  const handleOpenCreate = () => {
    setSelectedService(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (service: ServiceDto) => {
    setSelectedService(service);

    setForm({
      name: service.name || "",
      description: service.description || "",
      price: service.price || 0,
      durationMinutes: service.durationMinutes || 0,
      isActive: service.isActive ?? true,
    });

    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    if (saving) return;

    setIsFormOpen(false);
    setSelectedService(null);
    resetForm();
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên dịch vụ.");
      return;
    }

    if (Number(form.price) < 0) {
      alert("Giá dịch vụ không được âm.");
      return;
    }

    try {
      setSaving(true);

      const payload: CreateServiceDto | UpdateServiceDto = {
        name: form.name.trim(),
        description: form.description?.trim() || undefined,
        price: Number(form.price) || 0,
        durationMinutes: Number(form.durationMinutes) || 0,
        isActive: form.isActive ?? true,
      };

      if (selectedService) {
        await serviceService.update(selectedService.id, payload);
      } else {
        await serviceService.create(payload as CreateServiceDto);
      }

      await fetchServices();

      setIsFormOpen(false);
      setSelectedService(null);
      resetForm();
    } catch (err) {
      console.error("Save service error:", err);
      alert("Lưu dịch vụ thất bại. Kiểm tra lại dữ liệu hoặc API.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn xóa dịch vụ này không?");
    if (!ok) return;

    try {
      await serviceService.delete(id);
      await fetchServices();
    } catch (err) {
      console.error("Delete service error:", err);
      alert("Xóa dịch vụ thất bại.");
    }
  };

  const handleToggleActive = async (service: ServiceDto) => {
    try {
      await serviceService.update(service.id, {
        isActive: !(service.isActive ?? true),
      });

      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id
            ? {
                ...item,
                isActive: !(service.isActive ?? true),
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Toggle service status error:", err);
      alert("Cập nhật trạng thái dịch vụ thất bại.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return services;

    return services.filter((service) => {
      return (
        service.name?.toLowerCase().includes(keyword) ||
        service.description?.toLowerCase().includes(keyword)
      );
    });
  }, [services, search]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <AdminLayout title="Services Catalog">
      <div className="service-management">
        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="header-actions">
          <div className="search-box">
            <Search size={18} className="search-icon" />

            <input
              type="text"
              placeholder="Search dental services..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="header-buttons">
            <Button onClick={fetchServices}>
              <Search size={18} />
              Search
            </Button>

            <Button onClick={handleOpenCreate}>
              <Plus size={18} />
              New Service
            </Button>
          </div>
        </div>

        <div className="service-table-card card shadow-sm">
          <table className="service-table">
            <thead>
              <tr>
                <th>Service Details</th>
                <th>Pricing & Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    Đang tải danh sách dịch vụ...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    Không tìm thấy dịch vụ nào.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const isActive = service.isActive ?? true;

                  return (
                    <tr key={service.id} className="service-item">
                      <td>
                        <div className="service-info">
                          <h4 className="service-name">{service.name}</h4>

                          <p className="service-desc">
                            {service.description || "Chưa có mô tả"}
                          </p>
                        </div>
                      </td>

                      <td>
                        <div className="price-duration">
                          <div className="metric">
                            <DollarSign size={14} />
                            <span>{formatCurrency(service.price)}</span>
                          </div>

                          <div className="metric text-muted">
                            <Clock size={12} />
                            <span>
                              {service.durationMinutes
                                ? `${service.durationMinutes} min`
                                : "Chưa cập nhật"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`status-toggle ${isActive ? "active" : "inactive"}`}
                          onClick={() => handleToggleActive(service)}
                        >
                          <div className="toggle-track">
                            <div className="toggle-thumb" />
                          </div>

                          <span className="status-label">
                            {isActive ? "Active" : "Disabled"}
                          </span>
                        </button>
                      </td>

                      <td>
                        <div className="action-row">
                          <button
                            className="row-btn edit"
                            onClick={() => handleOpenEdit(service)}
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>

                          <button
                            className="row-btn delete"
                            onClick={() => handleDeleteService(service.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          title={selectedService ? "Sửa dịch vụ" : "Thêm dịch vụ"}
          size="lg"
          footer={
            <>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCloseForm}
                disabled={saving}
              >
                Hủy
              </button>

              <button
                type="submit"
                form="service-form"
                className="save-btn"
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu dịch vụ"}
              </button>
            </>
          }
        >
          <form
            id="service-form"
            className="service-form"
            onSubmit={handleSubmitService}
          >
            <div className="form-group">
              <label>Tên dịch vụ</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="VD: Trám răng composite"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giá dịch vụ</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  placeholder="VD: 500000"
                />
              </div>

              <div className="form-group">
                <label>Thời lượng phút</label>
                <input
                  type="number"
                  min={0}
                  value={form.durationMinutes || 0}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      durationMinutes: Number(e.target.value),
                    }))
                  }
                  placeholder="VD: 45"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea
                value={form.description || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Mô tả ngắn về dịch vụ..."
              />
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.isActive ?? true}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
              />
              <span>Dịch vụ đang hoạt động</span>
            </label>
          </form>
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

        .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1.5rem; }
        .header-buttons { display: flex; gap: 0.75rem; align-items: center; }

        .search-box { 
          flex: 1; max-width: 28rem; position: relative; 
          background: white; border: 1px solid var(--neutral-200); 
          border-radius: 0.875rem; 
        }

        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--neutral-400); }

        .search-input { width: 100%; border: none; background: transparent; padding: 0.75rem 1rem 0.75rem 2.75rem; font-size: 0.875rem; outline: none; font-weight: 500; }
        
        .service-table-card { padding: 0; background: white; border-radius: 1.5rem; border: 1px solid var(--neutral-100); overflow: hidden; }
        .service-table { width: 100%; border-collapse: collapse; text-align: left; }
        .service-table th { padding: 1.25rem 2rem; background: var(--neutral-50); color: var(--neutral-500); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid var(--neutral-100); }
        .service-table td { padding: 1.5rem 2rem; border-bottom: 1px solid var(--neutral-50); }

        .empty-cell {
          padding: 3rem 2rem !important;
          text-align: center;
          color: var(--neutral-400);
          font-size: 0.875rem;
          font-weight: 700;
        }
        
        .service-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .service-name { font-size: 1rem; font-weight: 800; color: var(--neutral-900); }
        .service-desc { font-size: 0.8125rem; color: var(--neutral-500); font-weight: 500; }
        
        .price-duration { display: flex; flex-direction: column; gap: 0.375rem; }
        .metric { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; font-weight: 700; color: var(--neutral-900); }
        .metric.text-muted { font-size: 0.75rem; font-weight: 600; color: var(--neutral-400); }
        
        .status-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 0;
        }

        .toggle-track { width: 2.25rem; height: 1.25rem; background: var(--neutral-200); border-radius: 999px; position: relative; transition: 0.3s; }
        .toggle-thumb { width: 0.875rem; height: 0.875rem; background: white; border-radius: 50%; position: absolute; top: 0.1875rem; left: 0.1875rem; transition: 0.3s; }
        
        .status-toggle.active .toggle-track { background: var(--success-color); }
        .status-toggle.active .toggle-thumb { transform: translateX(1rem); }
        .status-label { font-size: 0.75rem; font-weight: 700; color: var(--neutral-500); min-width: 3.5rem; }
        .status-toggle.active .status-label { color: var(--success-color); }
        
        .action-row { display: flex; gap: 0.5rem; }
        .row-btn { width: 2.25rem; height: 2.25rem; border-radius: 0.75rem; border: none; background: var(--neutral-50); color: var(--neutral-400); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .row-btn:hover { background: var(--neutral-100); color: var(--neutral-900); }
        .row-btn.edit:hover { color: var(--primary-color); background: var(--primary-soft); }
        .row-btn.delete:hover { color: var(--danger-color); background: var(--danger-soft); }

        .service-form {
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          border: 1px solid var(--neutral-200);
          border-radius: 0.875rem;
          padding: 0.8rem 1rem;
          outline: none;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-800);
          background: white;
          resize: vertical;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--neutral-700);
        }

        .checkbox-row input {
          width: 1rem;
          height: 1rem;
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
          background: var(--primary-color);
          color: white;
        }

        .save-btn:hover {
          background: var(--primary-hover);
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

export default ServiceManagementPage;
