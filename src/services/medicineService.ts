import axiosClient from "@/src/core/http/axiosClient";
import {
  MedicineDto,
  CreateMedicineDto,
  UpdateMedicineDto,
  AdjustStockDto,
  MedicineFilter,
  PrescriptionDto,
  CreatePrescriptionDto,
} from "@/src/types/medicine";
import { PaginatedResponse } from "@/src/types/common";

export const medicineService = {
  getAll: (params?: MedicineFilter) =>
    axiosClient.get<PaginatedResponse<MedicineDto>>("/medicines", { params }),

  getById: (id: string) => axiosClient.get<MedicineDto>(`/medicines/${id}`),

  create: (data: CreateMedicineDto) =>
    axiosClient.post<MedicineDto>("/medicines", data),

  update: (id: string, data: UpdateMedicineDto) =>
    axiosClient.put<MedicineDto>(`/medicines/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/medicines/${id}`),

  adjustStock: (id: string, data: AdjustStockDto) =>
    axiosClient.patch<MedicineDto>(`/medicines/${id}/stock`, data),

  getLowStock: () =>
    axiosClient.get<MedicineDto[]>("/medicines/inventory/low-stock"),

  getExpiringSoon: () =>
    axiosClient.get<MedicineDto[]>("/medicines/inventory/expiring-soon"),
};

export const prescriptionService = {
  create: (data: CreatePrescriptionDto) =>
    axiosClient.post<PrescriptionDto>("/prescriptions", data),

  getById: (id: string) =>
    axiosClient.get<PrescriptionDto>(`/prescriptions/${id}`),

  getByTreatment: (treatmentId: string) =>
    axiosClient.get<PrescriptionDto[]>(
      `/prescriptions/treatment/${treatmentId}`,
    ),

  delete: (id: string) => axiosClient.delete(`/prescriptions/${id}`),
};
