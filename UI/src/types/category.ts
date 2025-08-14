export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: number;
}
