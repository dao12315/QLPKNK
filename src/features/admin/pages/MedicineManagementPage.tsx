import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Search,
  Plus,
  AlertCircle,
  Package,
  TrendingDown,
  ClipboardList,
  Save,
  Edit3,
  Trash2,
} from "lucide-react";

import { Button } from "@/src/shared/components/ui/Button";
import { Modal } from "@/src/shared/components/ui/Modal";

import { medicineService } from "@/src/services/medicineService";
import {
  MedicineDto,
  CreateMedicineDto,
  UpdateMedicineDto,
  AdjustStockDto,
} from "@/src/types/medicine";
import { useUIStore } from "@/src/app/store/uiStore";
import "@/src/features/admin/styles/MedicineManagementPage.css";

type ModalMode = "create" | "edit" | "stock";

const ITEMS_PER_PAGE = 6;

const MedicineManagementPage = () => {
  const addAlert = useUIStore((state) => state.addAlert);

  const [medicines, setMedicines] = useState<MedicineDto[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDto | null>(
    null,
  );

  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");

  const [form, setForm] = useState<CreateMedicineDto>({
    name: "",
    unit: "",
    price: 0,
    stock: 0,
    batchNumber: "",
    expiryDate: "",
    description: "",
  });

  const [stockForm, setStockForm] = useState<AdjustStockDto>({
    delta: 0,
    reason: "",
  });

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const [medicineRes, lowStockRes, expiringSoonRes] =
        await Promise.allSettled([
          medicineService.getAll({
            page: 0,
            size: 100,
            keyword: search || undefined,
          }),
          medicineService.getLowStock(),
          medicineService.getExpiringSoon(),
        ]);

      if (medicineRes.status === "fulfilled") {
        setMedicines(medicineRes.value.data.content || []);
      } else {
        setError("Không tải được danh sách thuốc.");
        addAlert("Không tải được danh sách thuốc.", "error");
      }

      if (lowStockRes.status === "fulfilled") {
        setLowStockCount(lowStockRes.value.data.length || 0);
      }

      if (expiringSoonRes.status === "fulfilled") {
        setExpiringSoonCount(expiringSoonRes.value.data.length || 0);
      }
    } catch (err) {
      console.error("Fetch medicines error:", err);
      setError("Không tải được danh sách thuốc.");
      addAlert("Không tải được danh sách thuốc.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      unit: "",
      price: 0,
      stock: 0,
      batchNumber: "",
      expiryDate: "",
      description: "",
    });
  };

  const resetStockForm = () => {
    setStockForm({ delta: 0, reason: "" });
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedMedicine(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (medicine: MedicineDto) => {
    setModalMode("edit");
    setSelectedMedicine(medicine);
    setForm({
      name: medicine.name || "",
      unit: medicine.unit || "",
      price: medicine.price || 0,
      stock: medicine.stock || 0,
      batchNumber: medicine.batchNumber || "",
      expiryDate: medicine.expiryDate || "",
      description: medicine.description || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenStock = (medicine: MedicineDto) => {
    setModalMode("stock");
    setSelectedMedicine(medicine);
    resetStockForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setSelectedMedicine(null);
    resetForm();
    resetStockForm();
  };

  const handleSubmitMedicine = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      addAlert("Vui lòng nhập tên thuốc.", "warning");
      return;
    }

    if (!form.unit.trim()) {
      addAlert("Vui lòng nhập đơn vị thuốc.", "warning");
      return;
    }

    if (Number(form.price) < 0) {
      addAlert("Giá thuốc không được âm.", "warning");
      return;
    }

    if (modalMode === "create" && Number(form.stock) < 0) {
      addAlert("Tồn kho không được âm.", "warning");
      return;
    }

    try {
      setSaving(true);

      if (modalMode === "edit" && selectedMedicine) {
        const payload: UpdateMedicineDto = {
          name: form.name.trim(),
          unit: form.unit.trim(),
          price: Number(form.price) || 0,
          batchNumber: form.batchNumber?.trim() || undefined,
          expiryDate: form.expiryDate || undefined,
          description: form.description?.trim() || undefined,
        };

        await medicineService.update(selectedMedicine.id, payload);
        addAlert("Cập nhật thuốc thành công.", "success");
      } else {
        const payload: CreateMedicineDto = {
          name: form.name.trim(),
          unit: form.unit.trim(),
          price: Number(form.price) || 0,
          stock: Number(form.stock) || 0,
          batchNumber: form.batchNumber?.trim() || undefined,
          expiryDate: form.expiryDate || undefined,
          description: form.description?.trim() || undefined,
        };

        await medicineService.create(payload);
        addAlert("Thêm thuốc thành công.", "success");
        setSearch("");
        setCurrentPage(1);
      }

      await fetchMedicines();
      handleCloseModal();
    } catch (err) {
      console.error("Save medicine error:", err);
      addAlert("Lưu thuốc thất bại. Kiểm tra lại dữ liệu hoặc API.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitStock = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMedicine) return;

    const delta = Number(stockForm.delta);

    if (isNaN(delta) || delta === 0) {
      addAlert(
        "Delta phải khác 0. Số dương là nhập kho, số âm là xuất kho.",
        "warning",
      );
      return;
    }

    try {
      setSaving(true);

      await medicineService.adjustStock(selectedMedicine.id, {
        delta,
        reason: stockForm.reason?.trim() || undefined,
      });

      addAlert("Cập nhật tồn kho thành công.", "success");
      await fetchMedicines();
      handleCloseModal();
    } catch (err) {
      console.error("Adjust stock error:", err);
      addAlert("Cập nhật tồn kho thất bại.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn xóa thuốc này không?");
    if (!ok) return;

    try {
      await medicineService.delete(id);
      addAlert("Xóa thuốc thành công.", "success");

      await fetchMedicines();

      const newTotalItems = Math.max(0, filteredMedicines.length - 1);
      const newTotalPages = Math.max(
        1,
        Math.ceil(newTotalItems / ITEMS_PER_PAGE),
      );

      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error("Delete medicine error:", err);
      addAlert("Xóa thuốc thất bại.", "error");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const filteredMedicines = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return medicines;

    return medicines.filter(
      (medicine) =>
        medicine.name?.toLowerCase().includes(keyword) ||
        medicine.unit?.toLowerCase().includes(keyword) ||
        medicine.batchNumber?.toLowerCase().includes(keyword),
    );
  }, [medicines, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE),
  );

  const paginatedMedicines = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMedicines.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMedicines, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const isLowStock = (medicine: MedicineDto) =>
    medicine.lowStock || medicine.stock < 10;

  const isExpiringSoon = (medicine: MedicineDto) => {
    if (medicine.expired) return true;
    if (!medicine.expiryDate) return false;

    const diffDays =
      (new Date(medicine.expiryDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);

    return diffDays <= 30;
  };

  const getModalTitle = () => {
    if (modalMode === "stock") return "Cập nhật tồn kho";
    if (modalMode === "edit") return "Sửa thuốc";
    return "Thêm thuốc";
  };

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  };

  return (
    <AdminLayout title="Pharmacy Inventory">
      <div className="medicine-management">
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
              placeholder="Search medicines by name or batch..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="header-buttons">
            <Button onClick={fetchMedicines}>
              <Search size={18} />
              Search
            </Button>

            <Button onClick={handleOpenCreate}>
              <Plus size={18} />
              Add Medicine
            </Button>
          </div>
        </div>

        <div className="inventory-stats">
          <div className="mini-stat card border-orange">
            <TrendingDown className="icon-orange" size={20} />
            <div className="mini-stat-info">
              <span className="mini-val">
                {String(lowStockCount).padStart(2, "0")}
              </span>
              <span className="mini-label">Low Stock Items</span>
            </div>
          </div>

          <div className="mini-stat card border-red">
            <AlertCircle className="icon-red" size={20} />
            <div className="mini-stat-info">
              <span className="mini-val">
                {String(expiringSoonCount).padStart(2, "0")}
              </span>
              <span className="mini-label">Expiring Soon</span>
            </div>
          </div>
        </div>

        <div className="table-card card shadow-sm">
          <div className="table-header">
            <div className="table-title-icon">
              <ClipboardList size={18} />
            </div>
            <div>
              <h3 className="card-title">Medication Stock List</h3>
              <p className="card-subtitle">
                Manage stock quantity, price, batch and expiry information
              </p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="med-table">
              <thead>
                <tr>
                  <th>
                    <span>Medicine Name</span>
                  </th>
                  <th>
                    <span>Inventory</span>
                  </th>
                  <th>
                    <span>Price</span>
                  </th>
                  <th>
                    <span>Batch / Expiry</span>
                  </th>
                  <th>
                    <span>Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="empty-cell">
                      Đang tải danh sách thuốc...
                    </td>
                  </tr>
                ) : filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-cell">
                      Không tìm thấy thuốc nào.
                    </td>
                  </tr>
                ) : (
                  paginatedMedicines.map((medicine) => {
                    const lowStock = isLowStock(medicine);
                    const expiringSoon = isExpiringSoon(medicine);

                    return (
                      <tr key={medicine.id} className="med-row">
                        <td>
                          <div className="med-info">
                            <div className="med-icon">
                              <Package size={16} />
                            </div>
                            <div className="med-details">
                              <span className="med-name">{medicine.name}</span>
                              <span className="med-unit">{medicine.unit}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="stock-info">
                            <div className="stock-line">
                              <span
                                className={`stock-val ${
                                  lowStock ? "text-orange" : ""
                                }`}
                              >
                                {medicine.stock}
                              </span>
                              <span className="stock-unit">units</span>
                            </div>
                            <div className="stock-bar">
                              <div
                                className={`stock-fill ${
                                  lowStock ? "bg-orange" : "bg-primary"
                                }`}
                                style={{
                                  width:
                                    Math.min(
                                      100,
                                      (Number(medicine.stock) / 500) * 100,
                                    ) + "%",
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="med-price">
                            {formatCurrency(medicine.price)}
                          </span>
                        </td>

                        <td>
                          <div className="batch-info">
                            <span className="batch-code">
                              {medicine.batchNumber || "N/A"}
                            </span>
                            <span
                              className={`expiry-date ${
                                expiringSoon ? "text-red" : ""
                              }`}
                            >
                              {medicine.expiryDate || "Chưa cập nhật"}
                            </span>
                          </div>
                        </td>

                        <td>
                          <div className="actions-box">
                            <button
                              type="button"
                              className="stock-action-btn"
                              onClick={() => handleOpenStock(medicine)}
                              title="Cập nhật tồn kho"
                            >
                              <Package size={15} />
                              <span>Stock</span>
                            </button>

                            <div className="icon-actions">
                              <button
                                className="icon-btn edit"
                                onClick={() => handleOpenEdit(medicine)}
                                title="Sửa thuốc"
                                type="button"
                              >
                                <Edit3 size={16} />
                              </button>

                              <button
                                className="icon-btn delete"
                                onClick={() =>
                                  handleDeleteMedicine(medicine.id)
                                }
                                title="Xóa thuốc"
                                type="button"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && filteredMedicines.length > 0 && (
            <div className="pagination-bar">
              <div className="pagination-info">
                Hiển thị{" "}
                <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> -{" "}
                <strong>
                  {Math.min(
                    currentPage * ITEMS_PER_PAGE,
                    filteredMedicines.length,
                  )}
                </strong>{" "}
                / <strong>{filteredMedicines.length}</strong> thuốc
              </div>

              <div className="pagination-actions">
                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  Trước
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`page-number ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={getModalTitle()}
          size="lg"
          footer={
            <div className="modal-footer-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCloseModal}
                disabled={saving}
              >
                Hủy
              </button>

              <button
                type="submit"
                form={modalMode === "stock" ? "stock-form" : "medicine-form"}
                className="save-btn"
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          }
        >
          {modalMode === "stock" ? (
            <form
              id="stock-form"
              className="medicine-form"
              onSubmit={handleSubmitStock}
            >
              <div className="form-group">
                <label>Thuốc</label>
                <input value={selectedMedicine?.name || ""} disabled />
              </div>

              <div className="form-group">
                <label>Tồn kho hiện tại</label>
                <input value={selectedMedicine?.stock ?? 0} disabled />
              </div>

              <div className="form-group">
                <label>Delta tồn kho</label>
                <input
                  type="number"
                  value={stockForm.delta}
                  onChange={(e) =>
                    setStockForm((prev) => ({
                      ...prev,
                      delta: Number(e.target.value),
                    }))
                  }
                  placeholder="VD: 50 hoặc -10"
                />
                <small>Số dương = nhập kho, số âm = xuất kho.</small>
              </div>

              <div className="form-group">
                <label>Lý do</label>
                <textarea
                  rows={3}
                  value={stockForm.reason || ""}
                  onChange={(e) =>
                    setStockForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="VD: Nhập lô hàng mới / cấp thuốc cho bệnh nhân"
                />
              </div>
            </form>
          ) : (
            <form
              id="medicine-form"
              className="medicine-form"
              onSubmit={handleSubmitMedicine}
            >
              <div className="form-group">
                <label>Tên thuốc</label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="VD: Ibuprofen 400mg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Đơn vị</label>
                  <input
                    value={form.unit}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, unit: e.target.value }))
                    }
                    placeholder="VD: viên, chai, hộp"
                  />
                </div>

                <div className="form-group">
                  <label>Giá</label>
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
                    placeholder="VD: 5000"
                  />
                </div>
              </div>

              <div className="form-row">
                {modalMode === "create" ? (
                  <div className="form-group">
                    <label>Tồn kho ban đầu</label>
                    <input
                      type="number"
                      min={0}
                      value={form.stock}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          stock: Number(e.target.value),
                        }))
                      }
                      placeholder="VD: 100"
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Tồn kho hiện tại</label>
                    <input
                      type="number"
                      value={form.stock}
                      disabled
                      title="Dùng nút Stock để điều chỉnh tồn kho"
                    />
                    <small>Dùng nút "Stock" để điều chỉnh số lượng.</small>
                  </div>
                )}

                <div className="form-group">
                  <label>Số lô</label>
                  <input
                    value={form.batchNumber || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        batchNumber: e.target.value,
                      }))
                    }
                    placeholder="VD: BATCH-2026-001"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Ngày hết hạn</label>
                <input
                  type="date"
                  value={form.expiryDate || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, expiryDate: e.target.value }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  rows={3}
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Ghi chú thêm về thuốc..."
                />
              </div>
            </form>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default MedicineManagementPage;
