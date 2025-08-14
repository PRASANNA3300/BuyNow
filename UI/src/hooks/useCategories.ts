import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Category, CreateCategoryData, UpdateCategoryData } from '../types/category';

export const CATEGORIES_QUERY_KEY = 'categories';

export function useCategories() {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: () => apiClient.getCategories(),
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, 'all'],
    queryFn: () => apiClient.getAllCategories(),
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, id],
    queryFn: () => apiClient.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryData) => apiClient.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryData }) => 
      apiClient.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
}
