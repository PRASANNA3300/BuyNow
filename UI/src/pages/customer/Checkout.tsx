import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCart, clearCart } from '../../store/cartSlice';
import { useCreateOrder } from '../../hooks/useOrders';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const checkoutSchema = z.object({
  shippingName: z.string().min(2, 'Name must be at least 2 characters'),
  shippingAddress: z.string().min(5, 'Address must be at least 5 characters'),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().min(2, 'City must be at least 2 characters'),
  shippingState: z.string().min(2, 'State must be at least 2 characters'),
  shippingZip: z.string().min(5, 'ZIP code must be at least 5 characters'),
  shippingCountry: z.string().min(2, 'Country must be at least 2 characters'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { items, totalItems, subTotal, tax, total, isLoading } = useAppSelector((state) => state.cart);
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingName: user?.name || '',
      shippingCountry: 'United States',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    dispatch(fetchCart());
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    if (items.length === 0 && !isLoading) {
      navigate('/cart');
    }
  }, [items.length, isLoading, navigate]);

  const createPayPalOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toFixed(2),
            currency_code: 'USD',
          },
          description: `BuyNow Order - ${totalItems} items`,
        },
      ],
    });
  };

  const onPayPalApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      const details = await actions.order.capture();
      const formData = getValues();

      // Create order in our backend
      const order = await createOrderMutation.mutateAsync({
        ...formData,
        paymentId: details.id,
      });

      // Clear cart after successful order
      await dispatch(clearCart()).unwrap();

      // Redirect to order confirmation
      navigate(`/orders/${order.id}`, {
        state: {
          orderCreated: true,
          paymentDetails: details
        }
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      setPaymentError(error instanceof Error ? error.message : 'Order creation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const onPayPalError = (error: any) => {
    console.error('PayPal error:', error);
    setPaymentError('Payment failed. Please try again.');
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (items.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* Shipping Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>

            <form className="space-y-6">
              <div>
                <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="shippingName"
                  {...register('shippingName')}
                  className="mt-1"
                  placeholder="Enter your full name"
                />
                {errors.shippingName && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <Input
                  id="shippingAddress"
                  {...register('shippingAddress')}
                  className="mt-1"
                  placeholder="Enter your address"
                />
                {errors.shippingAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingAddress.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="shippingAddress2" className="block text-sm font-medium text-gray-700">
                  Address Line 2 (Optional)
                </label>
                <Input
                  id="shippingAddress2"
                  {...register('shippingAddress2')}
                  className="mt-1"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <Input
                    id="shippingCity"
                    {...register('shippingCity')}
                    className="mt-1"
                    placeholder="City"
                  />
                  {errors.shippingCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.shippingCity.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <Input
                    id="shippingState"
                    {...register('shippingState')}
                    className="mt-1"
                    placeholder="State"
                  />
                  {errors.shippingState && (
                    <p className="mt-1 text-sm text-red-600">{errors.shippingState.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="shippingZip" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <Input
                    id="shippingZip"
                    {...register('shippingZip')}
                    className="mt-1"
                    placeholder="ZIP Code"
                  />
                  {errors.shippingZip && (
                    <p className="mt-1 text-sm text-red-600">{errors.shippingZip.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="shippingCountry" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <Input
                  id="shippingCountry"
                  {...register('shippingCountry')}
                  className="mt-1"
                  placeholder="Country"
                />
                {errors.shippingCountry && (
                  <p className="mt-1 text-sm text-red-600">{errors.shippingCountry.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  {...register('notes')}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special instructions for your order"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  {item.productImageUrl && (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Error */}
            {paymentError && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {paymentError}
              </div>
            )}

            {/* PayPal Payment */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment</h3>
              {isPending ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <PayPalButtons
                  style={{ layout: 'vertical' }}
                  createOrder={createPayPalOrder}
                  onApprove={onPayPalApprove}
                  onError={onPayPalError}
                  disabled={isProcessing || Object.keys(errors).length > 0}
                />
              )}

              {isProcessing && (
                <div className="mt-4 text-center">
                  <LoadingSpinner />
                  <p className="text-sm text-gray-600 mt-2">Processing your order...</p>
                </div>
              )}
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
