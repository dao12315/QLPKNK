import axiosClient from "@/src/core/http/axiosClient";
import {
  AppointmentDto,
  CreateAppointmentDto,
  AppointmentFilter,
  RescheduleAppointmentDto,
  CancelAppointmentDto,
} from "@/src/types/appointment";
import { PaginatedResponse } from "@/src/types/common";

export const appointmentService = {
  getAll: (params?: AppointmentFilter) =>
    axiosClient.get<PaginatedResponse<AppointmentDto>>("/appointments", {
      params,
    }),

  getToday: (params?: { date?: string; doctorId?: string }) =>
    axiosClient.get<AppointmentDto[]>("/appointments/day", { params }),

  getById: (id: string) =>
    axiosClient.get<AppointmentDto>(`/appointments/${id}`),

  create: (data: CreateAppointmentDto) =>
    axiosClient.post<AppointmentDto>("/appointments", data),

  confirm: (id: string) =>
    axiosClient.patch<AppointmentDto>(`/appointments/${id}/confirm`),

  cancel: (id: string, data: CancelAppointmentDto) =>
    axiosClient.patch<AppointmentDto>(`/appointments/${id}/cancel`, data),

  reschedule: (id: string, data: RescheduleAppointmentDto) =>
    axiosClient.patch<AppointmentDto>(`/appointments/${id}/reschedule`, data),
};
