import { AuthResponse, LoginCredentials, RegisterData, ChangePasswordData } from '../types/auth';
import { Product, CreateProductData, UpdateProductData, ProductFilters, ProductListResponse } from '../types/product';
import { UserProfile, CreateUserData, UpdateUserData, UserFilters } from '../types/user';
import { Category, CreateCategoryData, UpdateCategoryData } from '../types/category';
import { Brand, CreateBrandData, UpdateBrandData } from '../types/brand';
import { CartSummary, AddToCartData, UpdateCartItemData } from '../types/cart';
import { Order, CreateOrderData, OrderFilters, OrderListResponse } from '../types/order';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', { method: 'POST' });
  }

  async getCurrentUser(): Promise<UserProfile> {
    return this.request<UserProfile>('/auth/me');
  }

  async changePassword(data: ChangePasswordData): Promise<void> {
    return this.request<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Product endpoints
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<ProductListResponse>(`/products${query}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: number, data: UpdateProductData): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/products/${id}`, { method: 'DELETE' });
  }

  // User endpoints
  async getUsers(filters?: UserFilters): Promise<UserProfile[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<UserProfile[]>(`/users${query}`);
  }

  async getUser(id: string): Promise<UserProfile> {
    return this.request<UserProfile>(`/users/${id}`);
  }

  async createUser(data: CreateUserData): Promise<UserProfile> {
    return this.request<UserProfile>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(data: UpdateUserData): Promise<UserProfile> {
    return this.request<UserProfile>(`/users/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string): Promise<void> {
    return this.request<void>(`/users/${id}`, { method: 'DELETE' });
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getAllCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories/all');
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(data: CreateCategoryData): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: number, data: UpdateCategoryData): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/categories/${id}`, { method: 'DELETE' });
  }

  // Brand endpoints
  async getBrands(): Promise<Brand[]> {
    return this.request<Brand[]>('/brands');
  }

  async getAllBrands(): Promise<Brand[]> {
    return this.request<Brand[]>('/brands/all');
  }

  async getBrand(id: number): Promise<Brand> {
    return this.request<Brand>(`/brands/${id}`);
  }

  async createBrand(data: CreateBrandData): Promise<Brand> {
    return this.request<Brand>('/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBrand(id: number, data: UpdateBrandData): Promise<Brand> {
    return this.request<Brand>(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBrand(id: number): Promise<void> {
    return this.request<void>(`/brands/${id}`, { method: 'DELETE' });
  }

  // Cart endpoints
  async getCart(): Promise<CartSummary> {
    return this.request<CartSummary>('/cart');
  }

  async addToCart(data: AddToCartData): Promise<void> {
    return this.request<void>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCartItem(id: number, data: UpdateCartItemData): Promise<void> {
    return this.request<void>(`/cart/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeFromCart(id: number): Promise<void> {
    return this.request<void>(`/cart/items/${id}`, { method: 'DELETE' });
  }

  async clearCart(): Promise<void> {
    return this.request<void>('/cart', { method: 'DELETE' });
  }

  // Order endpoints
  async getOrders(filters?: OrderFilters): Promise<OrderListResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<OrderListResponse>(`/orders${query}`);
  }

  async getOrder(id: number): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(data: CreateOrderData): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: number, status: string, notes?: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Config endpoints
  async getConfig(): Promise<Record<string, string>> {
    return this.request<Record<string, string>>('/config');
  }

  async getConfigValue(key: string): Promise<string> {
    return this.request<string>(`/config/${key}`);
  }

  async setConfig(config: Record<string, string>): Promise<void> {
    return this.request<void>('/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async updateConfigValue(key: string, value: string): Promise<void> {
    return this.request<void>(`/config/${key}`, {
      method: 'PUT',
      body: JSON.stringify(value),
    });
  }
}

export const apiClient = new ApiClient();