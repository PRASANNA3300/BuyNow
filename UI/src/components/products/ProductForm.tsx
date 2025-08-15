import React, { useState, useEffect } from 'react';
import { useCreateProduct, useUpdateProduct } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useBrands } from '../../hooks/useBrands';
import { Product, CreateProductData } from '../../types/product';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    categoryId: product?.categoryId || 0,
    brandId: product?.brandId || 0,
    brand: product?.brand || '',
    sku: product?.sku || '',
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    discountPrice: product?.discountPrice || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        categoryId: product.categoryId || 0,
        brandId: product.brandId || 0,
        brand: product.brand || '',
        sku: product.sku || '',
        stock: product.stock || 0,
        imageUrl: product.imageUrl || '',
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        discountPrice: product.discountPrice || 0,
      });
    }
  }, [product]);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const isEditing = !!product;
  const mutation = isEditing ? updateProductMutation : createProductMutation;

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  const brandOptions = brands.map(brand => ({
    value: brand.id.toString(),
    label: brand.name
  }));

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Category is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const data: CreateProductData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        categoryId: Number(formData.categoryId),
        brandId: formData.brandId ? Number(formData.brandId) : undefined,
        brand: formData.brand.trim() || undefined,
        sku: formData.sku.trim() || undefined,
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl.trim() || undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
      };

      if (isEditing) {
        await updateProductMutation.mutateAsync({ id: product.id, data });
      } else {
        await createProductMutation.mutateAsync(data);
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Enter product name"
          required
        />

        <Select
          label="Category"
          value={formData.categoryId.toString()}
          onChange={(e) => handleChange('categoryId', parseInt(e.target.value) || 0)}
          options={categoryOptions}
          error={errors.categoryId}
          placeholder="Select a category"
          required
        />
      </div>

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        error={errors.description}
        placeholder="Enter product description"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Brand"
          value={formData.brandId ? formData.brandId.toString() : ''}
          onChange={(e) => handleChange('brandId', parseInt(e.target.value) || 0)}
          options={brandOptions}
          error={errors.brandId}
          placeholder="Select a brand (optional)"
        />

        <Input
          label="SKU"
          value={formData.sku}
          onChange={(e) => handleChange('sku', e.target.value)}
          error={errors.sku}
          placeholder="Enter SKU (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Price"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
          error={errors.price}
          placeholder="0.00"
          required
        />

        <Input
          label="Stock Quantity"
          type="number"
          min="0"
          value={formData.stock}
          onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
          error={errors.stock}
          placeholder="0"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Discount Price"
          type="number"
          min="0"
          step="0.01"
          value={formData.discountPrice}
          onChange={(e) => handleChange('discountPrice', parseFloat(e.target.value) || 0)}
          error={errors.discountPrice}
          placeholder="0.00 (optional)"
        />

        <Input
          label="Image URL"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
          helperText="Optional: Add a product image URL"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-slate-700">
            Product is active
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="isFeatured"
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => handleChange('isFeatured', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
          />
          <label htmlFor="isFeatured" className="text-sm text-slate-700">
            Featured product
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={mutation.isPending}
        >
          {isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}