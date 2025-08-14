import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Product, CreateProductData, UpdateProductData, ProductFilters } from '../types/product';
import { apiClient } from '../lib/api';

export const PRODUCTS_QUERY_KEY = 'products';

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, filters],
    queryFn: () => apiClient.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: () => apiClient.getProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => apiClient.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductData }) =>
      apiClient.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
}