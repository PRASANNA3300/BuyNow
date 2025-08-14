import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Calendar, CreditCard, MapPin } from 'lucide-react';
import { useOrder } from '../../hooks/useOrders';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: order, isLoading, error } = useOrder(id ? parseInt(id) : 0);
  const orderCreated = location.state?.orderCreated;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Package className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Message */}
      {orderCreated && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-8">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Order placed successfully!</span>
          </div>
          <p className="mt-1 text-sm">Thank you for your purchase. Your order has been received and is being processed.</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="ml-2">{order.status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Order Status Timeline */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['pending', 'processing', 'shipped', 'delivered'].includes(order.status.toLowerCase())
                  ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                <Package className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-600 mt-1">Pending</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              ['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase())
                ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['processing', 'shipped', 'delivered'].includes(order.status.toLowerCase())
                  ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                <Package className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-600 mt-1">Processing</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              ['shipped', 'delivered'].includes(order.status.toLowerCase())
                ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                ['shipped', 'delivered'].includes(order.status.toLowerCase())
                  ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                <Truck className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-600 mt-1">Shipped</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              order.status.toLowerCase() === 'delivered' ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                order.status.toLowerCase() === 'delivered'
                  ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                <CheckCircle className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-600 mt-1">Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                {item.productImageUrl && (
                  <img
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.productName}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
              <p>
                {order.shippingCity}, {order.shippingState} {order.shippingZip}
              </p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${(order.totalAmount * 0.926).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>${(order.totalAmount * 0.074).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {order.paymentId && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Payment ID: <span className="font-mono">{order.paymentId}</span>
                </p>
                {order.paymentStatus && (
                  <p className="text-sm text-gray-600 mt-1">
                    Payment Status: <span className="font-medium">{order.paymentStatus}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Notes</h2>
            <p className="text-gray-600">{order.notes}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => navigate('/products')}
            variant="secondary"
          >
            Continue Shopping
          </Button>
          {order.status.toLowerCase() === 'delivered' && (
            <Button>
              Leave a Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
