export interface MedicineDto {
  id: string;
  name: string;
  unit: string;
  price: number;
  stock: number;

  batchNumber?: string;
  expiryDate?: string; // "2027-12-31"
  description?: string;

  isActive?: boolean;
  lowStock?: boolean;
  expired?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMedicineDto {
  name: string;
  unit: string;
  price: number;
  stock: number;

  batchNumber?: string;
  expiryDate?: string; // "2027-12-31"
  description?: string;
}

export interface UpdateMedicineDto {
  name?: string;
  unit?: string;
  price?: number;
  stock?: number;

  batchNumber?: string;
  expiryDate?: string;
  description?: string;
  isActive?: boolean;
}

export interface AdjustStockDto {
  delta: number; // positive = nhập, negative = xuất
  reason?: string;
}

export interface MedicineFilter {
  page?: number;
  size?: number;
  sort?: string;
  keyword?: string;
  name?: string;
  lowStock?: boolean;
  expired?: boolean;
}

export interface PrescriptionItemDto {
  id: string;
  medicineId: string;
  medicineName: string;
  unit?: string;
  quantity: number;
  dosage?: string;
  note?: string;
}

export interface PrescriptionDto {
  id: string;
  treatmentId: string;
  note?: string;
  items: PrescriptionItemDto[];
  createdAt: string;
}

export interface CreatePrescriptionDto {
  treatmentId: string;
  note?: string;
  items: {
    medicineId: string;
    quantity: number;
    dosage?: string;
    note?: string;
  }[];
}
