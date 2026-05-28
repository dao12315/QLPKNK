import axiosClient from "@/src/core/http/axiosClient";
import {
  PatientDto,
  CreatePatientDto,
  UpdatePatientDto,
  PatientFilter,
} from "@/src/types/patient";
import { PaginatedResponse } from "@/src/types/common";

export const patientService = {
  getAll: (params?: PatientFilter) =>
    axiosClient.get<PaginatedResponse<PatientDto>>("/patients", { params }),

  getById: (id: string) => axiosClient.get<PatientDto>(`/patients/${id}`),

  create: (data: CreatePatientDto) =>
    axiosClient.post<PatientDto>("/patients/create", data),

  update: (id: string, data: UpdatePatientDto) =>
    axiosClient.put<PatientDto>(`/patients/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/patients/${id}`),
};
