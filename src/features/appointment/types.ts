import { User } from '@/src/types/auth';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  chairId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: string;
  notes?: string;
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  chairId: string;
  date: string;
  time: string;
  type: string;
  notes?: string;
}
