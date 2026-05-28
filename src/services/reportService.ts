import axiosClient from "@/src/core/http/axiosClient";

export interface RevenueEntry {
  period: string;
  revenue: number;
  invoiceCount: number;
  paidCount: number;
}

export interface RevenueSummary {
  from: string;
  to: string;
  totalRevenue: number;
  totalUnpaid: number;
  totalInvoices: number;
  breakdown: RevenueEntry[];
}

export const reportService = {
  getRevenue: (params?: {
    from?: string;
    to?: string;
    groupBy?: "day" | "month" | "year";
  }) => axiosClient.get<RevenueSummary>("/reports/revenue", { params }),
};
