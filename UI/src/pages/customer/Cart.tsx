import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../../store/cartSlice';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function Cart() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, totalItems, subTotal, tax, total, isLoading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(updateCartItem({ id: itemId, data: { quantity: newQuantity } })).unwrap();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your cart</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your shopping cart.</p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading cart: {error}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Button
          variant="secondary"
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart Items */}
        <div className="lg:col-span-7">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link
                            to={`/products/${item.productId}`}
                            className="hover:text-blue-600"
                          >
                            {item.productName}
                          </Link>
                        </h3>
                        <div className="mt-1 flex items-center space-x-2">
                          {item.productDiscountPrice ? (
                            <>
                              <span className="text-lg font-bold text-red-600">
                                ${item.productDiscountPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ${item.productPrice.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              ${item.productPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          In stock: {item.availableStock}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-center min-w-[3rem]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.availableStock}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {item.quantity} × ${(item.productDiscountPrice || item.productPrice).toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Items ({totalItems})</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full mt-6"
              size="lg"
            >
              Proceed to Checkout
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/products"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
