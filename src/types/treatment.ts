export type TreatmentStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface TreatmentSessionDto {
  id: string;
  treatmentId: string;
  appointmentId?: string;
  appointmentStatus?: string;
  note?: string;
  createdAt: string;
}

export interface TreatmentServiceItemDto {
  id: string;
  treatmentId: string;
  serviceId?: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface TreatmentDto {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;

  status: TreatmentStatus;
  diagnosis?: string;
  note?: string;

  toothCodes?: string[];
  toothNote?: string;

  sessions: TreatmentSessionDto[];
  serviceItems: TreatmentServiceItemDto[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateTreatmentDto {
  patientId: string;
  doctorId: string;
  diagnosis?: string;
  note?: string;
  toothCodes?: string[];
  toothNote?: string;
}

export interface UpdateTreatmentDto {
  status?: TreatmentStatus;
  diagnosis?: string;
  note?: string;
  toothCodes?: string[];
  toothNote?: string;
}

export interface CreateTreatmentSessionDto {
  treatmentId: string;
  appointmentId?: string;
  note?: string;
}

export interface CreateTreatmentServiceItemDto {
  treatmentId: string;
  serviceId?: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateTreatmentServiceItemDto {
  serviceId?: string;
  serviceName?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface TreatmentFilter {
  page?: number;
  size?: number;
  sort?: string;
  patientId?: string;
  doctorId?: string;
  status?: TreatmentStatus;
}

export const TREATMENT_STATUS_LABEL: Record<TreatmentStatus, string> = {
  planned: "Kế hoạch",
  in_progress: "Đang điều trị",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const TREATMENT_STATUS_COLOR: Record<TreatmentStatus, string> = {
  planned: "bg-yellow-50 text-yellow-700",
  in_progress: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};
