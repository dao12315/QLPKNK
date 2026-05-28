import axiosClient from "@/src/core/http/axiosClient";
import {
  DoctorDto,
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorFilter,
} from "@/src/types/doctor";
import { PaginatedResponse } from "@/src/types/common";

export const doctorService = {
  getAll: (params?: DoctorFilter) =>
    axiosClient.get<PaginatedResponse<DoctorDto>>("/doctors", { params }),

  getById: (id: string) => axiosClient.get<DoctorDto>(`/doctors/${id}`),

  create: (data: CreateDoctorDto) =>
    axiosClient.post<DoctorDto>("/doctors/create", data),

  update: (id: string, data: UpdateDoctorDto) =>
    axiosClient.put<DoctorDto>(`/doctors/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/doctors/${id}`),
};
