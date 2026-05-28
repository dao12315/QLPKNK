import axiosClient from "@/src/core/http/axiosClient";
import {
  DoctorScheduleDto,
  CreateDoctorScheduleDto,
  UpdateDoctorScheduleDto,
} from "@/src/types/doctor";

export const scheduleService = {
  getByDoctor: (doctorId: string) =>
    axiosClient.get<DoctorScheduleDto[]>(
      `/doctor-schedules/doctor/${doctorId}`,
    ),

  create: (data: CreateDoctorScheduleDto) =>
    axiosClient.post<DoctorScheduleDto>("/doctor-schedules", data),

  update: (id: string, data: UpdateDoctorScheduleDto) =>
    axiosClient.put<DoctorScheduleDto>(`/doctor-schedules/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/doctor-schedules/${id}`),
};
