import { Product } from '../types/product';
import { UserProfile } from '../types/user';

// Mock products data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    category: 'electronics',
    stock: 50,
    imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdBy: '1',
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring',
    price: 299.99,
    category: 'electronics',
    stock: 25,
    imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    createdBy: '1',
  },
  {
    id: '3',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily exercise',
    price: 129.99,
    category: 'sports',
    stock: 75,
    imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    createdBy: '2',
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with programmable settings',
    price: 89.99,
    category: 'home',
    stock: 30,
    imageUrl: 'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    createdBy: '1',
  },
  {
    id: '5',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 45.99,
    category: 'home',
    stock: 5,
    imageUrl: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400',
    isActive: false,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    createdBy: '2',
  },
];

// Mock users data
export const mockUsersData: UserProfile[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+1 (555) 123-4567',
    department: 'IT',
    isActive: true,
    lastLoginAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    phone: '+1 (555) 234-5678',
    department: 'Sales',
    isActive: true,
    lastLoginAt: '2024-01-14T15:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T15:45:00Z',
  },
  {
    id: '3',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    phone: '+1 (555) 345-6789',
    department: 'Marketing',
    isActive: true,
    lastLoginAt: '2024-01-13T09:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    phone: '+1 (555) 456-7890',
    department: 'Engineering',
    isActive: true,
    lastLoginAt: '2024-01-12T14:20:00Z',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '5',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'manager',
    phone: '+1 (555) 567-8901',
    department: 'HR',
    isActive: false,
    lastLoginAt: '2024-01-10T11:30:00Z',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-10T11:30:00Z',
  },
];

// Helper functions for mock data manipulation
let nextProductId = 6;
let nextUserId = 6;

export const addMockProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
  const newProduct: Product = {
    ...product,
    id: nextProductId.toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProducts.push(newProduct);
  nextProductId++;
  return newProduct;
};

export const updateMockProduct = (id: string, updates: Partial<Product>): Product => {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  
  mockProducts[index] = {
    ...mockProducts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockProducts[index];
};

export const deleteMockProduct = (id: string): void => {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index === -1) throw new Error('Product not found');
  mockProducts.splice(index, 1);
};

export const addMockUser = (user: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile => {
  const newUser: UserProfile = {
    ...user,
    id: nextUserId.toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsersData.push(newUser);
  nextUserId++;
  return newUser;
};

export const updateMockUser = (id: string, updates: Partial<UserProfile>): UserProfile => {
  const index = mockUsersData.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');
  
  mockUsersData[index] = {
    ...mockUsersData[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockUsersData[index];
};

export const deleteMockUser = (id: string): void => {
  const index = mockUsersData.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');
  mockUsersData.splice(index, 1);
};