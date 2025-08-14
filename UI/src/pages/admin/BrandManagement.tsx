import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Eye, EyeOff } from 'lucide-react';
import { useAllBrands, useCreateBrand, useUpdateBrand, useDeleteBrand } from '../../hooks/useBrands';
import { Brand, CreateBrandData } from '../../types/brand';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

interface BrandFormData {
  name: string;
  description: string;
  logoUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export function BrandManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    description: '',
    logoUrl: '',
    isActive: true,
    sortOrder: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: brands = [], isLoading } = useAllBrands();
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logoUrl: '',
      isActive: true,
      sortOrder: 0,
    });
    setErrors({});
    setEditingBrand(null);
  };

  const openModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logoUrl: brand.logoUrl || '',
        isActive: brand.isActive,
        sortOrder: brand.sortOrder,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    }

    if (formData.sortOrder < 0) {
      newErrors.sortOrder = 'Sort order must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const brandData: CreateBrandData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        logoUrl: formData.logoUrl.trim() || undefined,
        isActive: formData.isActive,
        sortOrder: formData.sortOrder,
      };

      if (editingBrand) {
        await updateBrandMutation.mutateAsync({ id: editingBrand.id, ...brandData });
      } else {
        await createBrandMutation.mutateAsync(brandData);
      }

      closeModal();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  };

  const handleDelete = async (brand: Brand) => {
    if (brand.productCount > 0) {
      alert(`Cannot delete "${brand.name}" because it has ${brand.productCount} products associated with it.`);
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${brand.name}"?`)) {
      try {
        await deleteBrandMutation.mutateAsync(brand.id);
      } catch (error) {
        console.error('Failed to delete brand:', error);
        alert('Failed to delete brand. Please try again.');
      }
    }
  };

  const handleChange = (field: keyof BrandFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Brand Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage product brands and their information
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {brand.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900">{brand.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    {brand.isActive ? (
                      <span className="flex items-center text-green-600 text-sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-gray-500 text-sm">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {brand.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {brand.description}
              </p>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-blue-600">
                <Package className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{brand.productCount} products</span>
              </div>
              <span className="text-xs text-gray-500">
                Order: {brand.sortOrder}
              </span>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openModal(brand)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(brand)}
                disabled={brand.productCount > 0}
                className="flex-1"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {brands.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No brands yet</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first brand.</p>
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Brand
          </Button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Brand Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter brand name"
                required
              />

              <Input
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                error={errors.description}
                placeholder="Enter brand description (optional)"
              />

              <Input
                label="Logo URL"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                error={errors.logoUrl}
                placeholder="https://example.com/logo.png (optional)"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Sort Order"
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 0)}
                  error={errors.sortOrder}
                  placeholder="0"
                />

                <div className="flex items-center space-x-2 mt-6">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
                >
                  {editingBrand ? 'Update Brand' : 'Create Brand'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
