export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateBrandData extends Partial<CreateBrandData> {
  id: number;
}
