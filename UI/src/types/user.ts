export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  id: number;
  password?: string;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  department?: string;
}