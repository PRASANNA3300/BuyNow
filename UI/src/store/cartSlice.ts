import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CartSummary, CartItem, AddToCartData, UpdateCartItemData } from '../types/cart';
import { apiClient } from '../lib/api';

interface CartState {
  items: CartItem[];
  totalItems: number;
  subTotal: number;
  tax: number;
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await apiClient.getCart();
      return cart;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: AddToCartData, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.addToCart(data);
      // Refresh cart after adding item
      dispatch(fetchCart());
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, data }: { id: number; data: UpdateCartItemData }, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.updateCartItem(id, data);
      // Refresh cart after updating item
      dispatch(fetchCart());
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update cart item');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      await apiClient.removeFromCart(id);
      // Refresh cart after removing item
      dispatch(fetchCart());
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.clearCart();
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartSummary>) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.totalItems;
        state.subTotal = action.payload.subTotal;
        state.tax = action.payload.tax;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.totalItems = 0;
        state.subTotal = 0;
        state.tax = 0;
        state.total = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;
