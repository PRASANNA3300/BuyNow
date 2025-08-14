import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, Star, ShoppingCart } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useAppDispatch } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Button } from '../../components/ui/Button';
import { ProductFilters } from '../../types/product';

export function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 20,
  });

  const { data: productsResponse, isLoading: productsLoading } = useProducts(filters);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Update filters from URL params
  useEffect(() => {
    const newFilters: ProductFilters = {
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: 20,
    };

    if (searchParams.get('search')) newFilters.search = searchParams.get('search')!;
    if (searchParams.get('categoryId')) newFilters.categoryId = parseInt(searchParams.get('categoryId')!);
    if (searchParams.get('brand')) newFilters.brand = searchParams.get('brand')!;
    if (searchParams.get('minPrice')) newFilters.minPrice = parseFloat(searchParams.get('minPrice')!);
    if (searchParams.get('maxPrice')) newFilters.maxPrice = parseFloat(searchParams.get('maxPrice')!);
    if (searchParams.get('sortBy')) newFilters.sortBy = searchParams.get('sortBy')!;
    if (searchParams.get('sortOrder')) newFilters.sortOrder = searchParams.get('sortOrder')!;
    if (searchParams.get('isFeatured')) newFilters.isFeatured = searchParams.get('isFeatured') === 'true';

    setFilters(newFilters);
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    setSearchParams(params);
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const products = productsResponse?.products || [];
  const totalPages = productsResponse?.totalPages || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discover Products
          </h1>
          <p className="text-gray-600 mt-2 flex items-center">
            <span className="mr-2">🛍️</span>
            {productsResponse?.totalCount || 0} amazing products waiting for you
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center px-4 py-2 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <div className="flex border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 transition-all duration-200 ${viewMode === 'grid' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 transition-all duration-200 ${viewMode === 'list' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-blue-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 space-y-6`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateFilters({ categoryId: undefined })}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                    !filters.categoryId ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => updateFilters({ categoryId: category.id })}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      filters.categoryId === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.name} ({category.productCount})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-3">
              <div>
                <input
                  type="number"
                  placeholder="Min price"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilters({ minPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max price"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
            <select
              value={`${filters.sortBy || 'created'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                updateFilters({ sortBy, sortOrder });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
            </select>
          </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
              }>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <Link to={`/products/${product.id}`} className={`relative ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                      {product.imageUrl ? (
                        <div className="relative overflow-hidden">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={`object-cover transition-transform duration-300 hover:scale-110 ${
                              viewMode === 'list'
                                ? 'w-32 h-32 rounded-l-2xl'
                                : 'w-full h-48'
                            }`}
                          />
                          {product.discountPrice && (
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              SALE
                            </div>
                          )}
                          {product.isFeatured && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              ⭐ FEATURED
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${
                          viewMode === 'list' ? 'w-32 h-32 rounded-l-2xl' : 'w-full h-48'
                        }`}>
                          <span className="text-gray-400 text-4xl">📦</span>
                        </div>
                      )}
                    </Link>
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex justify-between' : ''}`}>
                      <div className={viewMode === 'list' ? 'flex-1' : ''}>
                        <Link to={`/products/${product.id}`}>
                          <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 text-lg">
                            {product.name}
                          </h3>
                        </Link>
                        {product.brand && (
                          <p className="text-blue-600 text-sm font-medium mb-2">
                            {product.brand}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex flex-col">
                            {product.discountPrice ? (
                              <>
                                <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                  ${product.discountPrice.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-yellow-700 ml-1 font-medium">4.5</span>
                          </div>
                        </div>

                      </div>
                      {viewMode === 'list' && (
                        <div className="flex flex-col justify-between ml-4">
                          <Button
                            onClick={() => handleAddToCart(product.id)}
                            size="sm"
                            className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      )}
                      {viewMode === 'grid' && (
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          className="w-full mt-3 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => updateFilters({ page })}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
