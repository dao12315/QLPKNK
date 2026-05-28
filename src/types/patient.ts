export type Gender = "male" | "female" | "other";

export interface PatientDto {
  userId: string;
  patientId: string;
  name: string;
  email: string;
  roles: string;
  phone?: string;
  gender?: Gender;
  dob?: string; // "1990-05-20"
  address?: string;
  medicalHistory?: string;
}

export interface CreatePatientDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: Gender;
  dob?: string; // "1990-05-20"
  address?: string;
  medicalHistory?: string;
}

export interface UpdatePatientDto {
  phone?: string;
  gender?: Gender;
  dob?: string;
  address?: string;
  medicalHistory?: string;
}

export interface PatientFilter {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  phone?: string;
}
