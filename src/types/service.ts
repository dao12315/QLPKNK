export interface ServiceDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  durationMinutes?: number;
  isActive?: boolean;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
  isActive?: boolean;
}

export interface ServiceFilter {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  name?: string;
  isActive?: boolean;
}
