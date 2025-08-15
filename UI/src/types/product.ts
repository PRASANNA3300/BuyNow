export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  categoryName: string;
  brand?: string;
  brandId?: number;
  sku?: string;
  stock: number;
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  discountPrice?: number;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdByName: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  categoryId: number;
  brand?: string;
  brandId?: number;
  sku?: string;
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  discountPrice?: number;
}

export interface UpdateProductData extends Partial<CreateProductData> {
}

export interface ProductFilters {
  categoryId?: number;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}