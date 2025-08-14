import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

export const CONFIG_QUERY_KEY = 'config';

export function useConfig() {
  return useQuery({
    queryKey: [CONFIG_QUERY_KEY],
    queryFn: () => apiClient.getConfig(),
  });
}

export function useConfigValue(key: string) {
  return useQuery({
    queryKey: [CONFIG_QUERY_KEY, key],
    queryFn: () => apiClient.getConfigValue(key),
    enabled: !!key,
  });
}

export function useSetConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: Record<string, string>) => apiClient.setConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONFIG_QUERY_KEY] });
    },
  });
}

export function useUpdateConfigValue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => 
      apiClient.updateConfigValue(key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONFIG_QUERY_KEY] });
    },
  });
}
