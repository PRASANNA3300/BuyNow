export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  userName: string;
  userEmail: string;
  totalAmount: number;
  status: string;
  paymentId?: string;
  paymentStatus?: string;
  shippingName: string;
  shippingAddress: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface CreateOrderData {
  shippingName: string;
  shippingAddress: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  notes?: string;
  paymentId: string;
}

export interface OrderFilters {
  userId?: number;
  status?: string;
  paymentStatus?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export interface OrderListResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
