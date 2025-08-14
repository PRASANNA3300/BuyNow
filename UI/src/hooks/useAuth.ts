import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockLogin, mockGetCurrentUser } from '../lib/mockAuth';
import { LoginCredentials } from '../types/auth';

export const AUTH_QUERY_KEY = 'auth';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => mockLogin(credentials.email, credentials.password),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.tokens.refreshToken);

      // Update auth cache
      queryClient.setQueryData([AUTH_QUERY_KEY, 'user'], data.user);
      queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Mock logout - just simulate delay
      await new Promise(resolve => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Clear all caches
      queryClient.clear();
    },
    onError: () => {
      // Clear tokens even if logout fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: [AUTH_QUERY_KEY, 'user'],
    queryFn: () => mockGetCurrentUser(),
    enabled: !!localStorage.getItem('accessToken'),
    retry: false,
  });
}