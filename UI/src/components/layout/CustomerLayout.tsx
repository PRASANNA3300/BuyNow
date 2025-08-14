import React, { ReactNode, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchCart } from '../../store/cartSlice';
import { useState } from 'react';

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { totalItems } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BuyNow</span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                />
              </div>
            </form>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50">
                Products
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-lg animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{user?.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                    <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Link>
                    <Link to="/orders" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      My Orders
                    </Link>
                    {user?.role === 'Admin' && (
                      <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-sm text-purple-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200 border-t border-gray-100">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-3"></div>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 border-t border-gray-100"
                    >
                      <span className="w-4 h-4 mr-3">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-blue-50">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-blue-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
              />
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-blue-100 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/products"
                className="flex items-center py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">🛍️</span>
                Products
              </Link>
              <Link
                to="/cart"
                className="flex items-center py-3 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                Cart {totalItems > 0 && (
                  <span className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full px-2 py-1 font-medium">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="block py-2 text-gray-700 hover:text-blue-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">BuyNow</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Your premium destination for quality products and exceptional shopping experience.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-blue-300">Quick Links</h4>
              <ul className="space-y-3 text-gray-300">
                <li><Link to="/products" className="hover:text-blue-300 transition-colors duration-200 flex items-center"><span className="mr-2">🛍️</span>Products</Link></li>
                <li><Link to="/cart" className="hover:text-blue-300 transition-colors duration-200 flex items-center"><span className="mr-2">🛒</span>Cart</Link></li>
                {isAuthenticated && (
                  <li><Link to="/orders" className="hover:text-blue-300 transition-colors duration-200 flex items-center"><span className="mr-2">📦</span>My Orders</Link></li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-purple-300">Customer Service</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-purple-300 transition-colors duration-200 flex items-center"><span className="mr-2">📞</span>Contact Us</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors duration-200 flex items-center"><span className="mr-2">❓</span>FAQ</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors duration-200 flex items-center"><span className="mr-2">🚚</span>Shipping Info</a></li>
                <li><a href="#" className="hover:text-purple-300 transition-colors duration-200 flex items-center"><span className="mr-2">↩️</span>Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-pink-300">Connect</h4>
              <ul className="space-y-3 text-gray-300">
                <li><a href="#" className="hover:text-pink-300 transition-colors duration-200 flex items-center"><span className="mr-2">📘</span>Facebook</a></li>
                <li><a href="#" className="hover:text-pink-300 transition-colors duration-200 flex items-center"><span className="mr-2">🐦</span>Twitter</a></li>
                <li><a href="#" className="hover:text-pink-300 transition-colors duration-200 flex items-center"><span className="mr-2">📷</span>Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-12 pt-8 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400">&copy; 2024 BuyNow. All rights reserved.</p>
              <div className="flex space-x-6 text-gray-400">
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">Terms of Service</a>
                <a href="#" className="hover:text-blue-300 transition-colors duration-200">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
