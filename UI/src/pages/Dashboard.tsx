import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProducts } from '../hooks/useProducts';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { PERMISSIONS } from '../lib/permissions';

export function Dashboard() {
  const { user, hasPermission } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();





  // Always show admin panel for admin users, regardless of permissions
  if (user?.role === 'Admin' || user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Welcome back, {user?.name}! Manage your products efficiently.
                </p>
              </div>
              <Link to="/admin/products">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{products?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-3xl font-bold text-gray-900">{products?.filter(p => p.isActive).length || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-3xl font-bold text-gray-900">{products?.filter(p => p.stock < 10).length || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Management Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
                <Link to="/admin/products">
                  <Button variant="secondary" size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    View All Products
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-6">
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              ) : products && products.length > 0 ? (
                <div className="space-y-4">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.category} • Stock: {product.stock}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${product.price}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <Link to="/admin/products">
                          <Button variant="secondary" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first product.</p>
                  <Link to="/admin/products">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Product
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for non-admin users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}