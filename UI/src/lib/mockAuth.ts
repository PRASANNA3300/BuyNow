// Mock authentication data and functions
export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Check credentials
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || password !== 'password') {
    throw new Error('Invalid email or password');
  }

  // Generate mock tokens
  const tokens = {
    accessToken: `mock-access-token-${user.id}`,
    refreshToken: `mock-refresh-token-${user.id}`,
  };

  return {
    user,
    tokens,
  };
};

export const mockGetCurrentUser = async (): Promise<MockUser> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token');
  }

  // Extract user ID from mock token
  const userId = token.split('-').pop();
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};