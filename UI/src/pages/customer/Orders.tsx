import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye, Calendar, CreditCard } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';

export function Orders() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    sortBy: 'created',
    sortOrder: 'desc',
  });

  const { data: ordersResponse, isLoading, error } = useOrders(filters);

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

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  const orders = ordersResponse?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <div className="flex items-center space-x-4">
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({ ...filters, sortBy, sortOrder, page: 1 });
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="total-desc">Highest Amount</option>
            <option value="total-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Order Header */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  {order.paymentStatus && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      Payment: {order.paymentStatus}
                    </span>
                  )}
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="px-6 py-4">
              <div className="space-y-3">
                {order.orderItems.slice(0, 3).map((item) => (
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
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                ))}

                {order.orderItems.length > 3 && (
                  <div className="text-sm text-gray-500 text-center py-2">
                    +{order.orderItems.length - 3} more items
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingName}</p>
                  <p>{order.shippingAddress}</p>
                  {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                  <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {ordersResponse && ordersResponse.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: ordersResponse.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setFilters({ ...filters, page })}
                className={`px-3 py-2 rounded-md text-sm ${
                  filters.page === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
