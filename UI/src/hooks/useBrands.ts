import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Brand, CreateBrandData, UpdateBrandData } from '../types/brand';

export const BRANDS_QUERY_KEY = 'brands';

export function useBrands() {
  return useQuery({
    queryKey: [BRANDS_QUERY_KEY],
    queryFn: () => apiClient.getBrands(),
  });
}

export function useAllBrands() {
  return useQuery({
    queryKey: [BRANDS_QUERY_KEY, 'all'],
    queryFn: () => apiClient.getAllBrands(),
  });
}

export function useBrand(id: number) {
  return useQuery({
    queryKey: [BRANDS_QUERY_KEY, id],
    queryFn: () => apiClient.getBrand(id),
    enabled: !!id,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandData) => apiClient.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateBrandData) => apiClient.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });
    },
  });
}
