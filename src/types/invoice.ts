export type InvoiceStatus = "unpaid" | "partial" | "paid" | "cancelled";

export type PaymentMethod = "cash" | "banking" | "momo" | "vnpay" | "other";

export interface InvoiceDto {
  id: string;
  treatmentId: string;
  patientId: string;
  patientName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt?: string;
  payments?: PaymentDto[];
}

export interface CreateInvoiceDto {
  treatmentId: string;
  patientId?: string;
}

export interface UpdateInvoiceDto {
  status?: InvoiceStatus;
}

export interface PaymentDto {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  notes?: string;
  paidAt: string;
}

export interface CreatePaymentDto {
  amount: number;
  method: PaymentMethod;
  notes?: string;
}

export interface InvoiceFilter {
  page?: number;
  size?: number;
  sort?: string;
  patientId?: string;
  treatmentId?: string;
  status?: InvoiceStatus;
  dateFrom?: string;
  dateTo?: string;
}

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  unpaid: "Chưa thanh toán",
  partial: "Thanh toán một phần",
  paid: "Đã thanh toán",
  cancelled: "Đã hủy",
};

export const INVOICE_STATUS_COLOR: Record<InvoiceStatus, string> = {
  unpaid: "bg-red-50 text-red-700",
  partial: "bg-yellow-50 text-yellow-700",
  paid: "bg-green-50 text-green-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "Tiền mặt",
  banking: "Chuyển khoản",
  momo: "MoMo",
  vnpay: "VNPay",
  other: "Khác",
};
