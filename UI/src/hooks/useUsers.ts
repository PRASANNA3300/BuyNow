import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  mockUsersData, 
  addMockUser, 
  updateMockUser, 
  deleteMockUser 
} from '../lib/mockData';
import { UserProfile, CreateUserData, UpdateUserData, UserFilters } from '../types/user';

export const USERS_QUERY_KEY = 'users';

// Mock API functions
const mockGetUsers = async (filters?: UserFilters): Promise<UserProfile[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let filteredUsers = [...mockUsersData];
  
  if (filters) {
    if (filters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }
    if (filters.isActive !== undefined) {
      filteredUsers = filteredUsers.filter(u => u.isActive === filters.isActive);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(search) || 
        u.email.toLowerCase().includes(search)
      );
    }
    if (filters.department) {
      filteredUsers = filteredUsers.filter(u => u.department === filters.department);
    }
  }
  
  return filteredUsers;
};

const mockGetUser = async (id: string): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const user = mockUsersData.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  return user;
};

const mockCreateUser = async (data: CreateUserData): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return addMockUser(data);
};

const mockUpdateUser = async (data: UpdateUserData): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return updateMockUser(data.id, data);
};

const mockDeleteUser = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  deleteMockUser(id);
};

export function useUsers(filters?: UserFilters) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: () => mockGetUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, id],
    queryFn: () => mockGetUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => mockCreateUser(data),
    onSuccess: (newUser) => {
      // Optimistic update: Add the new user to the cache
      queryClient.setQueryData<UserProfile[]>([USERS_QUERY_KEY], (old) => {
        return old ? [newUser, ...old] : [newUser];
      });

      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => mockUpdateUser(data),
    onSuccess: (updatedUser) => {
      // Optimistic update: Update the specific user in the cache
      queryClient.setQueryData([USERS_QUERY_KEY, updatedUser.id], updatedUser);

      // Update the user in the users list
      queryClient.setQueryData<UserProfile[]>([USERS_QUERY_KEY], (old) => {
        return old?.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        );
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mockDeleteUser(id),
    onSuccess: (_, deletedId) => {
      // Optimistic update: Remove the user from the cache
      queryClient.setQueryData<UserProfile[]>([USERS_QUERY_KEY], (old) => {
        return old?.filter((user) => user.id !== deletedId);
      });

      // Remove the specific user from the cache
      queryClient.removeQueries({ queryKey: [USERS_QUERY_KEY, deletedId] });

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
}