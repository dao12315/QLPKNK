import axiosClient from "@/src/core/http/axiosClient";
import {
  TreatmentDto,
  CreateTreatmentDto,
  UpdateTreatmentDto,
  CreateTreatmentSessionDto,
  CreateTreatmentServiceItemDto,
  UpdateTreatmentServiceItemDto,
  TreatmentSessionDto,
  TreatmentServiceItemDto,
  TreatmentFilter,
} from "@/src/types/treatment";
import { PaginatedResponse } from "@/src/types/common";

export const treatmentService = {
  getAll: (params?: TreatmentFilter) =>
    axiosClient.get<PaginatedResponse<TreatmentDto>>("/treatments", {
      params,
    }),

  getById: (id: string) => axiosClient.get<TreatmentDto>(`/treatments/${id}`),

  create: (data: CreateTreatmentDto) =>
    axiosClient.post<TreatmentDto>("/treatments", data),

  update: (id: string, data: UpdateTreatmentDto) =>
    axiosClient.put<TreatmentDto>(`/treatments/${id}`, data),

  createSession: (data: CreateTreatmentSessionDto) =>
    axiosClient.post<TreatmentSessionDto>("/treatments/sessions", data),

  getSessions: (treatmentId: string) =>
    axiosClient.get<TreatmentSessionDto[]>(
      `/treatments/${treatmentId}/sessions`,
    ),

  deleteSession: (sessionId: string) =>
    axiosClient.delete(`/treatments/sessions/${sessionId}`),

  createServiceItem: (data: CreateTreatmentServiceItemDto) =>
    axiosClient.post<TreatmentServiceItemDto>(
      "/treatments/service-items",
      data,
    ),

  getServiceItems: (treatmentId: string) =>
    axiosClient.get<TreatmentServiceItemDto[]>(
      `/treatments/${treatmentId}/service-items`,
    ),

  updateServiceItem: (id: string, data: UpdateTreatmentServiceItemDto) =>
    axiosClient.put<TreatmentServiceItemDto>(
      `/treatments/service-items/${id}`,
      data,
    ),

  deleteServiceItem: (id: string) =>
    axiosClient.delete(`/treatments/service-items/${id}`),
};
