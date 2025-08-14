import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import { Order, CreateOrderData, OrderFilters } from '../types/order';

export const ORDERS_QUERY_KEY = 'orders';

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, filters],
    queryFn: () => apiClient.getOrders(filters),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [ORDERS_QUERY_KEY, id],
    queryFn: () => apiClient.getOrder(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderData) => apiClient.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      // Also invalidate cart since it will be cleared after order creation
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: number; status: string; notes?: string }) => 
      apiClient.updateOrderStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
  });
}
