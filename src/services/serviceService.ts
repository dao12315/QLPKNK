import axiosClient from "@/src/core/http/axiosClient";
import {
  ServiceDto,
  CreateServiceDto,
  UpdateServiceDto,
  ServiceFilter,
} from "@/src/types/service";
import { PaginatedResponse } from "@/src/types/common";

export const serviceService = {
  getAll: (params?: ServiceFilter) =>
    axiosClient.get<PaginatedResponse<ServiceDto>>("/services", { params }),

  getById: (id: string) => axiosClient.get<ServiceDto>(`/services/${id}`),

  create: (data: CreateServiceDto) =>
    axiosClient.post<ServiceDto>("/services", data),

  update: (id: string, data: UpdateServiceDto) =>
    axiosClient.put<ServiceDto>(`/services/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/services/${id}`),
};
