import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useProduct } from '../../hooks/useProducts';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: product, isLoading, error } = useProduct(id ? parseInt(id) : 0);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      // Show success message or redirect to cart
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const effectivePrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <button onClick={() => navigate('/products')} className="hover:text-blue-600">
          Products
        </button>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        {/* Product Image */}
        <div className="flex flex-col">
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-96">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-10 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mt-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">(4.0) 24 reviews</span>
          </div>

          {/* Price */}
          <div className="mt-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ${effectivePrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Save ${(product.price - effectivePrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <p className="mt-2 text-gray-600">{product.description}</p>
          </div>

          {/* Product Details */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            <dl className="mt-2 space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Category:</dt>
                <dd className="text-sm font-medium text-gray-900">{product.categoryName}</dd>
              </div>
              {product.brand && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Brand:</dt>
                  <dd className="text-sm font-medium text-gray-900">{product.brand}</dd>
                </div>
              )}
              {product.sku && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">SKU:</dt>
                  <dd className="text-sm font-medium text-gray-900">{product.sku}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Availability:</dt>
                <dd className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quantity and Add to Cart */}
          {product.stock > 0 && (
            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Max: {product.stock}
                </span>
              </div>

              <div className="mt-6 flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={isAddingToCart}
                  variant="secondary"
                  className="flex-1"
                >
                  Buy Now
                </Button>
              </div>

              <div className="mt-4 flex space-x-4">
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Heart className="h-4 w-4 mr-1" />
                  Add to Wishlist
                </button>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </button>
              </div>
            </div>
          )}

          {product.stock === 0 && (
            <div className="mt-8">
              <Button disabled className="w-full">
                Out of Stock
              </Button>
              <p className="mt-2 text-sm text-gray-600 text-center">
                This item is currently out of stock
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-16">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping</h3>
              <p className="text-sm text-gray-600">
                Free shipping on orders over $50. Standard delivery takes 3-5 business days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Returns</h3>
              <p className="text-sm text-gray-600">
                30-day return policy. Items must be in original condition.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Warranty</h3>
              <p className="text-sm text-gray-600">
                1-year manufacturer warranty included with purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
