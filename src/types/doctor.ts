export interface DoctorDto {
  id: string;
  userId: string;
  fullName: string;
  specialization: string;
  experienceYears: number;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorDto {
  name: string;
  email: string;
  password: string;
  fullName: string;
  specialization: string;
  experienceYears: number;
  phone: string;
}

export interface UpdateDoctorDto {
  fullName?: string;
  specialization?: string;
  experienceYears?: number;
  phone?: string;
}

export interface DoctorFilter {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  fullName?: string;
  phone?: string;
}

export interface DoctorScheduleDto {
  id: string;
  doctorId: string;
  doctorName: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ... 6=Sat
  startTime: string; // "08:00"
  endTime: string; // "17:00"
  isActive: boolean;
}

export interface CreateDoctorScheduleDto {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface UpdateDoctorScheduleDto {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export const DAY_OF_WEEK_LABELS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];
