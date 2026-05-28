export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "rescheduled"
  | "completed"
  | "no_show";

export interface AppointmentDto {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  startTime: string; // ISO date-time: "2026-06-20T09:00:00"
  endTime: string; // ISO date-time: "2026-06-20T10:00:00"
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  rescheduledFromId?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  startTime: string; // ISO date-time
  endTime: string; // ISO date-time
  notes?: string;
}

export interface UpdateAppointmentDto {
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface RescheduleAppointmentDto {
  newStartTime: string; // ISO date-time
  newEndTime: string; // ISO date-time
  notes?: string;
}

export interface CancelAppointmentDto {
  cancellationReason: string;
}

export interface AppointmentFilter {
  page?: number;
  size?: number;
  sort?: string;
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  date?: string; // "2026-06-20" dùng cho /appointments/day hoặc filter nếu backend hỗ trợ
}

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  cancelled: "Đã hủy",
  rescheduled: "Đã dời lịch",
  completed: "Đã khám xong",
  no_show: "Không đến",
};

export const APPOINTMENT_STATUS_COLOR: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-700",
  rescheduled: "bg-purple-50 text-purple-700",
  completed: "bg-green-50 text-green-700",
  no_show: "bg-gray-100 text-gray-500",
};
