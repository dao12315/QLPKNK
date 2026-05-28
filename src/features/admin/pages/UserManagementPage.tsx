import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit2,
  Trash2,
  AlertCircle,
  Save,
} from "lucide-react";

import { Button } from "@/src/shared/components/ui/Button";
import { Input } from "@/src/shared/components/ui/Input";
import { Modal } from "@/src/shared/components/ui/Modal";

import { userService } from "@/src/services/userService";
import { UserDto, CreateUserDto } from "@/src/types/user";
import { UserRole } from "@/src/types/auth";

const USER_ROLE_OPTIONS: UserRole[] = [
  UserRole.ADMIN,
  UserRole.RECEPTIONIST,
  UserRole.DENTIST,
];

const UserManagementPage = () => {
  const [users, setUsers] = useState<UserDto[]>([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState<CreateUserDto>({
    name: "",
    email: "",
    password: "",
    role: UserRole.RECEPTIONIST,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await userService.getAll({
        page,
        size,
        sort: "name,asc",
        name: search || undefined,
        email: search || undefined,
        role: roleFilter === "all" ? undefined : (roleFilter as UserRole),
      });

      setUsers(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Không tải được danh sách người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: UserRole.RECEPTIONIST,
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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên người dùng.");
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

    try {
      setSaving(true);

      await userService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      await fetchUsers();

      setIsAddOpen(false);
      resetForm();
    } catch (err) {
      console.error("Create user error:", err);
      alert("Tạo tài khoản thất bại. Kiểm tra email có bị trùng không.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const ok = window.confirm("Bạn có chắc muốn xóa tài khoản này không?");
    if (!ok) return;

    try {
      await userService.delete(id);
      await fetchUsers();
    } catch (err) {
      console.error("Delete user error:", err);
      alert("Xóa tài khoản thất bại.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  const startIndex = totalElements === 0 ? 0 : page * size + 1;
  const endIndex = Math.min((page + 1) * size, totalElements);

  return (
    <AdminLayout title="User Management">
      <div className="user-management">
        {error && (
          <div className="error-box">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="toolbar card shadow-sm">
          <div className="search-box">
            <Input
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
              placeholder="Search by name or email..."
              icon={<Search size={18} />}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Role</label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(0);
                }}
                className="select-box"
              >
                <option value="all">All Roles</option>
                <option value={UserRole.ADMIN}>Admin</option>
                <option value={UserRole.RECEPTIONIST}>Receptionist</option>
                <option value={UserRole.DENTIST}>Dentist</option>
              </select>
            </div>

            <Button
              onClick={() => {
                setPage(0);
                fetchUsers();
              }}
            >
              <Search size={18} />
              Search
            </Button>

            <Button className="add-btn" onClick={handleOpenAdd}>
              <Plus size={18} />
              Add Account
            </Button>
          </div>
        </div>

        <div className="table-card card shadow-sm">
          <div className="table-responsive">
            <table className="user-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>User Information</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="empty-cell">
                      Đang tải danh sách người dùng...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-cell">
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u, i) => (
                    <tr key={u.id} className="table-row">
                      <td className="text-muted">{page * size + i + 1}</td>

                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar-mini">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                u.name,
                              )}&background=f3f4f6&color=6b7280`}
                              alt={u.name}
                            />
                          </div>

                          <div className="user-details">
                            <span className="user-name-bold">{u.name}</span>
                            <span className="user-email-text">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`role-badge role-${u.role.toLowerCase()}`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td>
                        <div className="action-btns">
                          <button className="icon-btn" title="Edit">
                            <Edit2 size={16} />
                          </button>

                          <button
                            className="icon-btn danger"
                            title="Delete"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <Trash2 size={16} />
                          </button>

                          <button className="icon-btn" title="More">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <p className="page-info">
              Showing {startIndex} to {endIndex} of {totalElements} users
            </p>

            <div className="page-btns">
              <button
                disabled={page <= 0}
                className="page-btn"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Prev
              </button>

              <button className="page-btn active">{page + 1}</button>

              <button
                disabled={page + 1 >= totalPages}
                className="page-btn"
                onClick={() =>
                  setPage((prev) => (prev + 1 >= totalPages ? prev : prev + 1))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isAddOpen}
          onClose={handleCloseAdd}
          title="Add Account"
          size="lg"
          footer={
            <>
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCloseAdd}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                form="add-user-form"
                className="save-btn"
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Account"}
              </button>
            </>
          }
        >
          <form
            id="add-user-form"
            onSubmit={handleCreateUser}
            className="user-form"
          >
            <div className="form-group">
              <label>Name</label>
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
                placeholder="VD: user@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
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
              <label>Role</label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    role: e.target.value as UserRole,
                  }))
                }
                className="form-select"
              >
                {USER_ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
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

        .toolbar { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 1.5rem; }
        @media (min-width: 1024px) { .toolbar { flex-direction: row; align-items: center; } }
        
        .search-box { flex: 1; }
        .filters { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .filter-group { display: flex; align-items: center; gap: 0.5rem; }
        .filter-group label { font-size: 0.75rem; font-weight: 700; color: var(--neutral-500); text-transform: uppercase; }
        
        .select-box,
        .form-select { 
          padding: 0.625rem 1rem; 
          border-radius: 0.75rem; 
          border: 1px solid var(--neutral-200); 
          background: var(--neutral-50); 
          font-size: 0.875rem; 
          outline: none; 
          font-weight: 500;
        }
        
        .table-card { padding: 0; overflow: hidden; }
        .table-responsive { overflow-x: auto; }
        .user-table { width: 100%; border-collapse: collapse; text-align: left; }
        .user-table th { padding: 1.25rem 1.5rem; background: var(--neutral-50); color: var(--neutral-500); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid var(--neutral-100); }
        .user-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--neutral-50); vertical-align: middle; }
        .table-row:hover { background: var(--neutral-50); }

        .empty-cell {
          padding: 3rem 1.5rem !important;
          text-align: center;
          color: var(--neutral-400);
          font-weight: 700;
          font-size: 0.875rem;
        }
        
        .user-info-cell { display: flex; align-items: center; gap: 1rem; }
        .user-avatar-mini { width: 2.5rem; height: 2.5rem; border-radius: 0.75rem; overflow: hidden; background: var(--neutral-100); }
        .user-avatar-mini img { width: 100%; height: 100%; object-fit: cover; }
        .user-details { display: flex; flex-direction: column; }
        .user-name-bold { font-weight: 700; color: var(--neutral-900); font-size: 0.9375rem; }
        .user-email-text { font-size: 0.75rem; color: var(--neutral-500); }
        
        .role-badge { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 800; letter-spacing: 0.025em; }
        .role-admin { background: #fee2e2; color: #ef4444; }
        .role-dentist { background: #dcfce7; color: #22c55e; }
        .role-receptionist { background: #dbeafe; color: #2563eb; }
        
        .text-muted { color: var(--neutral-400); }
        .action-btns { display: flex; gap: 0.5rem; }

        .icon-btn {
          padding: 0.5rem;
          border-radius: 0.5rem;
          color: var(--neutral-400);
          transition: 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover { background: var(--neutral-100); color: var(--neutral-900); }
        .icon-btn.danger:hover { background: #fee2e2; color: #ef4444; }
        
        .pagination { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: white; }
        .page-info { font-size: 0.8125rem; color: var(--neutral-500); font-weight: 500; }
        .page-btns { display: flex; gap: 0.25rem; }
        .page-btn { padding: 0.375rem 0.75rem; border-radius: 0.5rem; font-size: 0.8125rem; font-weight: 600; color: var(--neutral-600); transition: 0.2s; background: none; border: none; cursor: pointer; }
        .page-btn:hover:not(:disabled) { background: var(--neutral-100); color: var(--neutral-900); }
        .page-btn.active { background: var(--primary-color); color: white; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .user-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
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
        .form-group select {
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

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.08);
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

export default UserManagementPage;
