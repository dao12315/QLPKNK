import axiosClient from "@/src/core/http/axiosClient";
import { PrescriptionDto, CreatePrescriptionDto } from "@/src/types/medicine";

export const prescriptionService = {
  getByTreatment: (treatmentId: string) =>
    axiosClient.get<PrescriptionDto[]>(
      `/prescriptions/treatment/${treatmentId}`,
    ),

  getById: (id: string) =>
    axiosClient.get<PrescriptionDto>(`/prescriptions/${id}`),

  create: (data: CreatePrescriptionDto) =>
    axiosClient.post<PrescriptionDto>("/prescriptions", data),

  delete: (id: string) => axiosClient.delete(`/prescriptions/${id}`),
};
