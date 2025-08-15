import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Package } from 'lucide-react';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { useAuth } from '../contexts/AuthContext';
import { PERMISSIONS } from '../lib/permissions';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Modal } from '../components/ui/Modal';
import { ProductForm } from '../components/products/ProductForm';
import { Product } from '../types/product';

export function Products() {
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Admin users have all permissions
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';
  const canCreate = isAdmin || hasPermission(PERMISSIONS.CREATE_PRODUCTS);
  const canUpdate = isAdmin || hasPermission(PERMISSIONS.UPDATE_PRODUCTS);
  const canDelete = isAdmin || hasPermission(PERMISSIONS.DELETE_PRODUCTS);

  const { data: productsResponse, isLoading, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();

  const products = productsResponse?.products || [];
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProductMutation.mutateAsync(product.id);
      } catch (error: any) {
        console.error('Failed to delete product:', error);

        // Provide more specific error messages
        if (error?.response?.status === 404) {
          alert('Product not found. It may have already been deleted.');
        } else if (error?.response?.status === 400) {
          const message = error?.response?.data?.message || 'Cannot delete this product.';
          alert(message);
        } else {
          alert('Failed to delete product. Please try again.');
        }
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Failed to load products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create, edit, and manage your product catalog
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredProducts.length} products found
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            {product.imageUrl ? (
              <div className="relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                {product.isFeatured && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ FEATURED
                  </div>
                )}
                {product.discountPrice && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    SALE
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {product.name}
                </h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  product.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {product.brand && (
                <p className="text-blue-600 text-sm font-medium mb-2">
                  {product.brand}
                </p>
              )}

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    {product.discountPrice ? (
                      <>
                        <p className="text-xl font-bold text-red-600">${product.discountPrice}</p>
                        <p className="text-sm text-gray-500 line-through">${product.price}</p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-gray-900">${product.price}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                  {product.category}
                </span>
              </div>
              
              <div className="flex space-x-2">
                {canUpdate && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}

                {canDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm ? 'Try adjusting your search terms or browse all products.' : 'Get started by creating your first product to begin managing your inventory.'}
          </p>
          {canCreate && !searchTerm && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}