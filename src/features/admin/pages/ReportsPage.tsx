import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  Calendar as CalendarIcon,
  FileText,
  Download,
  TrendingUp,
  ExternalLink,
  TrendingDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import {
  reportService,
  RevenueEntry,
  RevenueSummary,
} from "@/src/services/reportService";
import { invoiceService } from "@/src/services/invoiceService";
import { doctorService } from "@/src/services/doctorService";
import { serviceService } from "@/src/services/serviceService";

import { InvoiceDto } from "@/src/types/invoice";
import { DoctorDto } from "@/src/types/doctor";
import { ServiceDto } from "@/src/types/service";
import "../styles/ReportsPage.css";

type PeriodType = "day" | "month" | "year";

interface ChartItem {
  day: string;
  revenue: number;
  invoiceCount: number;
  paidCount: number;
}

interface DoctorRevenueItem {
  id: string;
  name: string;
  revenue: number;
  appointments: number;
}

interface ServiceRevenueItem {
  id: string;
  name: string;
  revenue: number;
  count: number;
}

const ReportsPage = () => {
  const [period, setPeriod] = useState<PeriodType>("month");

  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(
    null,
  );
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [doctors, setDoctors] = useState<DoctorDto[]>([]);
  const [services, setServices] = useState<ServiceDto[]>([]);

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (value?: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  const formatCompactMoney = (value?: number) => {
    const amount = Number(value || 0);

    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)}B`;
    }

    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    }

    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)}K`;
    }

    return amount.toString();
  };

  const getDefaultDateRange = (groupBy: PeriodType) => {
    const now = new Date();

    const to = new Date(now);
    const from = new Date(now);

    if (groupBy === "day") {
      from.setDate(now.getDate() - 6);
    }

    if (groupBy === "month") {
      from.setMonth(now.getMonth() - 11);
      from.setDate(1);
    }

    if (groupBy === "year") {
      from.setFullYear(now.getFullYear() - 4);
      from.setMonth(0);
      from.setDate(1);
    }

    const toStartOfDayInstant = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    };

    const toEndOfDayInstant = (date: Date) => {
      const d = new Date(date);
      d.setHours(23, 59, 59, 999);
      return d.toISOString();
    };

    return {
      from: toStartOfDayInstant(from),
      to: toEndOfDayInstant(to),
    };
  };

  const formatPeriodLabel = (periodValue: string) => {
    if (!periodValue) return "";

    const date = new Date(periodValue);

    if (Number.isNaN(date.getTime())) {
      return periodValue;
    }

    if (period === "day") {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }

    if (period === "month") {
      return date.toLocaleDateString("vi-VN", {
        month: "2-digit",
        year: "numeric",
      });
    }

    return date.getFullYear().toString();
  };

  const getInvoiceTotal = (invoice: InvoiceDto) => {
    const item = invoice as any;

    return Number(
      item.total ||
        item.totalAmount ||
        item.amount ||
        item.grandTotal ||
        item.finalAmount ||
        0,
    );
  };

  const getInvoiceStatus = (invoice: InvoiceDto) => {
    const item = invoice as any;

    return String(item.status || item.paymentStatus || "").toLowerCase();
  };

  const isPaidInvoice = (invoice: InvoiceDto) => {
    const status = getInvoiceStatus(invoice);

    return (
      status === "paid" ||
      status === "completed" ||
      status === "success" ||
      status === "successfully_paid"
    );
  };

  const getInvoiceDate = (invoice: InvoiceDto) => {
    const item = invoice as any;

    return (
      item.createdAt ||
      item.invoiceDate ||
      item.paidAt ||
      item.updatedAt ||
      item.date ||
      ""
    );
  };

  const getPatientName = (invoice: InvoiceDto) => {
    const item = invoice as any;

    return (
      item.patientName || item.patient?.name || item.patient?.fullName || "N/A"
    );
  };

  const getDoctorId = (invoice: InvoiceDto) => {
    const item = invoice as any;

    return item.doctorId || item.doctor?.id || "";
  };

  const getDoctorName = (invoice: InvoiceDto) => {
    const item = invoice as any;

    return (
      item.doctorName || item.doctor?.fullName || item.doctor?.name || "N/A"
    );
  };

  const getInvoiceServicesText = (invoice: InvoiceDto) => {
    const item = invoice as any;

    const serviceItems =
      item.serviceItems ||
      item.items ||
      item.invoiceItems ||
      item.services ||
      [];

    if (Array.isArray(serviceItems) && serviceItems.length > 0) {
      return serviceItems
        .map((svc: any) => svc.serviceName || svc.name || svc.service?.name)
        .filter(Boolean)
        .join(", ");
    }

    return item.serviceName || "N/A";
  };

  const getInvoiceServiceItems = (invoice: InvoiceDto) => {
    const item = invoice as any;

    return (
      item.serviceItems ||
      item.items ||
      item.invoiceItems ||
      item.services ||
      []
    );
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const dateRange = getDefaultDateRange(period);

      const [revenueRes, invoiceRes, doctorRes, serviceRes] =
        await Promise.allSettled([
          reportService.getRevenue({
            from: dateRange.from,
            to: dateRange.to,
            groupBy: period,
          }),
          invoiceService.getAll({
            page: 0,
            size: 100,
          } as any),
          doctorService.getAll({
            page: 0,
            size: 100,
          }),
          serviceService.getAll({
            page: 0,
            size: 100,
          } as any),
        ]);

      if (revenueRes.status === "fulfilled") {
        setRevenueSummary(revenueRes.value.data);
      } else {
        setError("Không tải được báo cáo doanh thu.");
      }

      if (invoiceRes.status === "fulfilled") {
        setInvoices(invoiceRes.value.data.content || []);
      }

      if (doctorRes.status === "fulfilled") {
        setDoctors(doctorRes.value.data.content || []);
      }

      if (serviceRes.status === "fulfilled") {
        setServices(serviceRes.value.data.content || []);
      }
    } catch (err) {
      console.error("Fetch reports error:", err);
      setError("Không tải được dữ liệu báo cáo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [period]);

  const chartData: ChartItem[] = useMemo(() => {
    return (revenueSummary?.breakdown || []).map((item: RevenueEntry) => ({
      day: formatPeriodLabel(item.period),
      revenue: Number(item.revenue || 0),
      invoiceCount: Number(item.invoiceCount || 0),
      paidCount: Number(item.paidCount || 0),
    }));
  }, [revenueSummary, period]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const item = invoice as any;

      const matchDoctor = selectedDoctorId
        ? getDoctorId(invoice) === selectedDoctorId
        : true;

      if (!matchDoctor) return false;

      if (!selectedServiceId) return true;

      const serviceItems = getInvoiceServiceItems(invoice);

      if (!Array.isArray(serviceItems)) return true;

      return serviceItems.some((svc: any) => {
        return (
          svc.serviceId === selectedServiceId ||
          svc.service?.id === selectedServiceId ||
          svc.id === selectedServiceId ||
          item.serviceId === selectedServiceId
        );
      });
    });
  }, [invoices, selectedDoctorId, selectedServiceId]);

  const paidInvoiceCount = useMemo(() => {
    return filteredInvoices.filter(isPaidInvoice).length;
  }, [filteredInvoices]);

  const unpaidInvoiceCount = useMemo(() => {
    return Math.max(
      0,
      Number(revenueSummary?.totalInvoices || 0) -
        Number(paidInvoiceCount || 0),
    );
  }, [revenueSummary, paidInvoiceCount]);

  const totalDebt = useMemo(() => {
    return Number(revenueSummary?.totalUnpaid || 0);
  }, [revenueSummary]);

  const doctorRevenue = useMemo<DoctorRevenueItem[]>(() => {
    const map = new Map<string, DoctorRevenueItem>();

    filteredInvoices.forEach((invoice) => {
      const doctorId = getDoctorId(invoice) || getDoctorName(invoice);
      const doctorName = getDoctorName(invoice);
      const revenue = getInvoiceTotal(invoice);

      if (!map.has(doctorId)) {
        map.set(doctorId, {
          id: doctorId,
          name: doctorName,
          revenue: 0,
          appointments: 0,
        });
      }

      const current = map.get(doctorId)!;

      current.revenue += revenue;
      current.appointments += 1;
    });

    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredInvoices]);

  const serviceRevenue = useMemo<ServiceRevenueItem[]>(() => {
    const map = new Map<string, ServiceRevenueItem>();

    filteredInvoices.forEach((invoice) => {
      const serviceItems = getInvoiceServiceItems(invoice);

      if (Array.isArray(serviceItems) && serviceItems.length > 0) {
        serviceItems.forEach((svc: any) => {
          const id =
            svc.serviceId || svc.service?.id || svc.id || svc.serviceName;
          const name =
            svc.serviceName ||
            svc.name ||
            svc.service?.name ||
            "Unknown Service";

          const quantity = Number(svc.quantity || 1);
          const unitPrice = Number(svc.unitPrice || svc.price || 0);
          const total = Number(svc.total || unitPrice * quantity || 0);

          if (!map.has(id)) {
            map.set(id, {
              id,
              name,
              revenue: 0,
              count: 0,
            });
          }

          const current = map.get(id)!;

          current.revenue += total;
          current.count += quantity;
        });

        return;
      }

      const text = getInvoiceServicesText(invoice);

      if (!map.has(text)) {
        map.set(text, {
          id: text,
          name: text,
          revenue: 0,
          count: 0,
        });
      }

      const current = map.get(text)!;

      current.revenue += getInvoiceTotal(invoice);
      current.count += 1;
    });

    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredInvoices]);

  const handleExportExcel = () => {
    const rows = filteredInvoices.map((invoice) => ({
      Date: getInvoiceDate(invoice),
      Patient: getPatientName(invoice),
      Doctor: getDoctorName(invoice),
      Services: getInvoiceServicesText(invoice),
      Total: getInvoiceTotal(invoice),
      Status: getInvoiceStatus(invoice),
    }));

    const header = Object.keys(
      rows[0] || {
        Date: "",
        Patient: "",
        Doctor: "",
        Services: "",
        Total: "",
        Status: "",
      },
    );

    const csv = [
      header.join(","),
      ...rows.map((row: any) =>
        header
          .map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `financial-report-${period}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <AdminLayout title="Financial Reports">
      <div className="reports-container">
        {error && (
          <div className="alert-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="reports-filters card shadow-sm mb-4">
          <div className="filter-group">
            <label>Report Period</label>

            <div className="period-tabs">
              <button
                className={`period-tab ${period === "day" ? "active" : ""}`}
                onClick={() => setPeriod("day")}
                type="button"
              >
                Day
              </button>

              <button
                className={`period-tab ${period === "month" ? "active" : ""}`}
                onClick={() => setPeriod("month")}
                type="button"
              >
                Month
              </button>

              <button
                className={`period-tab ${period === "year" ? "active" : ""}`}
                onClick={() => setPeriod("year")}
                type="button"
              >
                Year
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>Doctor</label>

            <select
              className="form-select"
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {(doctor as any).fullName || (doctor as any).name || "N/A"}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Service</label>

            <select
              className="form-select"
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {(service as any).name ||
                    (service as any).serviceName ||
                    "N/A"}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-actions">
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={fetchReports}
              disabled={loading}
              type="button"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={handleExportPdf}
              type="button"
            >
              <Download size={18} />
              Export PDF
            </button>

            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={handleExportExcel}
              type="button"
            >
              <Download size={18} />
              Export Excel
            </button>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="stat-card revenue">
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>

              <div className="stat-content">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">
                  {formatCompactMoney(revenueSummary?.totalRevenue)}
                  <span className="currency"> VND</span>
                </p>
                <p className="stat-trend positive">
                  Revenue from paid invoices
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card paid">
              <div className="stat-icon">
                <FileText size={24} />
              </div>

              <div className="stat-content">
                <p className="stat-label">Paid Invoices</p>
                <p className="stat-value">{paidInvoiceCount}</p>
                <p className="stat-trend positive">
                  {revenueSummary?.totalInvoices
                    ? `${Math.round(
                        (paidInvoiceCount /
                          Number(revenueSummary.totalInvoices || 1)) *
                          100,
                      )}% success rate`
                    : "No invoice data"}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card unpaid">
              <div className="stat-icon">
                <CalendarIcon size={24} />
              </div>

              <div className="stat-content">
                <p className="stat-label">Unpaid Invoices</p>
                <p className="stat-value">{unpaidInvoiceCount}</p>
                <p className="stat-trend negative">Pending payment</p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="stat-card debt">
              <div className="stat-icon">
                <TrendingDown size={24} />
              </div>

              <div className="stat-content">
                <p className="stat-label">Total Debt</p>
                <p className="stat-value">
                  {formatCompactMoney(totalDebt)}
                  <span className="currency"> VND</span>
                </p>
                <p className="stat-trend neutral">Unpaid amount</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-3 px-4">
            <h5 className="mb-0 fw-bold">Revenue over time</h5>

            <div className="chart-legend d-flex gap-3">
              <span className="d-flex align-items-center gap-1 text-muted small">
                <span className="legend-dot primary"></span>
                Revenue
              </span>
            </div>
          </div>

          <div className="card-body px-4" style={{ height: "350px" }}>
            {loading ? (
              <div className="empty-box">Đang tải biểu đồ doanh thu...</div>
            ) : chartData.length === 0 ? (
              <div className="empty-box">Chưa có dữ liệu doanh thu.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--primary-color)"
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary-color)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dx={-10}
                    tickFormatter={(value) => formatCompactMoney(Number(value))}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [
                      formatCurrency(Number(value || 0)),
                      "Revenue",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--primary-color)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pt-3 px-4 d-flex justify-content-between">
                <h5 className="mb-0 fw-bold">Revenue by Doctor</h5>
              </div>

              <div className="card-body px-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="px-4 border-0 text-muted small text-uppercase">
                          Doctor
                        </th>
                        <th className="border-0 text-muted small text-uppercase">
                          Appointments
                        </th>
                        <th className="px-4 border-0 text-muted small text-uppercase text-end">
                          Total Revenue
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {doctorRevenue.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="empty-table-cell">
                            Chưa có dữ liệu doanh thu theo bác sĩ.
                          </td>
                        </tr>
                      ) : (
                        doctorRevenue.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-4 fw-medium text-dark">
                              {doc.name}
                            </td>
                            <td>{doc.appointments}</td>
                            <td className="px-4 text-end fw-bold">
                              {formatCompactMoney(doc.revenue)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pt-3 px-4 d-flex justify-content-between">
                <h5 className="mb-0 fw-bold">Top Services</h5>
              </div>

              <div className="card-body px-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="px-4 border-0 text-muted small text-uppercase">
                          Service
                        </th>
                        <th className="border-0 text-muted small text-uppercase">
                          Count
                        </th>
                        <th className="px-4 border-0 text-muted small text-uppercase text-end">
                          Revenue
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {serviceRevenue.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="empty-table-cell">
                            Chưa có dữ liệu doanh thu theo dịch vụ.
                          </td>
                        </tr>
                      ) : (
                        serviceRevenue.map((svc) => (
                          <tr key={svc.id}>
                            <td className="px-4 fw-medium text-dark">
                              {svc.name}
                            </td>
                            <td>{svc.count}</td>
                            <td className="px-4 text-end fw-bold">
                              {formatCompactMoney(svc.revenue)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-header bg-transparent border-0 pt-3 px-4">
            <h5 className="mb-0 fw-bold">Detailed Invoices</h5>
          </div>

          <div className="card-body px-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4 text-muted small text-uppercase">
                      Date
                    </th>
                    <th className="text-muted small text-uppercase">Patient</th>
                    <th className="text-muted small text-uppercase">Doctor</th>
                    <th className="text-muted small text-uppercase">
                      Services
                    </th>
                    <th className="text-muted small text-uppercase text-end">
                      Total
                    </th>
                    <th className="text-muted small text-uppercase text-center">
                      Status
                    </th>
                    <th className="px-4"></th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="empty-table-cell">
                        Đang tải danh sách hóa đơn...
                      </td>
                    </tr>
                  ) : filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-table-cell">
                        Không có hóa đơn phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.slice(0, 10).map((invoice) => (
                      <tr key={(invoice as any).id}>
                        <td className="px-4 text-muted">
                          {getInvoiceDate(invoice)
                            ? new Date(
                                getInvoiceDate(invoice),
                              ).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </td>

                        <td className="fw-bold text-dark">
                          {getPatientName(invoice)}
                        </td>

                        <td>{getDoctorName(invoice)}</td>

                        <td>{getInvoiceServicesText(invoice)}</td>

                        <td className="text-end fw-bold">
                          {formatCurrency(getInvoiceTotal(invoice))}
                        </td>

                        <td className="text-center">
                          <span
                            className={`badge px-3 py-2 rounded-pill ${
                              isPaidInvoice(invoice)
                                ? "bg-success-soft text-success"
                                : "bg-warning-soft text-warning"
                            }`}
                          >
                            {isPaidInvoice(invoice) ? "Paid" : "Unpaid"}
                          </span>
                        </td>

                        <td className="px-4 text-end">
                          <button
                            className="btn btn-ghost-primary btn-sm"
                            type="button"
                            title="View invoice"
                          >
                            <ExternalLink size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;
