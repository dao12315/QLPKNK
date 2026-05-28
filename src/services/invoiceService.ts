import axiosClient from "@/src/core/http/axiosClient";
import {
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  PaymentDto,
  CreatePaymentDto,
  InvoiceFilter,
} from "@/src/types/invoice";
import { PaginatedResponse } from "@/src/types/common";

export const invoiceService = {
  getAll: (params?: InvoiceFilter) =>
    axiosClient.get<PaginatedResponse<InvoiceDto>>("/invoices", { params }),

  getById: (id: string) => axiosClient.get<InvoiceDto>(`/invoices/${id}`),

  create: (data: CreateInvoiceDto) =>
    axiosClient.post<InvoiceDto>("/invoices", data),

  update: (id: string, data: UpdateInvoiceDto) =>
    axiosClient.put<InvoiceDto>(`/invoices/${id}`, data),

  cancel: (id: string) =>
    axiosClient.patch<InvoiceDto>(`/invoices/${id}/cancel`),

  getPayments: (invoiceId: string) =>
    axiosClient.get<PaymentDto[]>(`/invoices/${invoiceId}/payments`),

  createPayment: (invoiceId: string, data: CreatePaymentDto) =>
    axiosClient.post<InvoiceDto>(`/invoices/${invoiceId}/payments`, data),
};
