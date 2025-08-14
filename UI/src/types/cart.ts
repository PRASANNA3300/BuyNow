export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl?: string;
  productPrice: number;
  productDiscountPrice?: number;
  quantity: number;
  totalPrice: number;
  availableStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  subTotal: number;
  tax: number;
  total: number;
}

export interface AddToCartData {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}
