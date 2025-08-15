import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CustomerLayout } from './components/layout/CustomerLayout';

// Admin pages
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';

// Customer pages
import { Home } from './pages/customer/Home';
import { ProductCatalog } from './pages/customer/ProductCatalog';
import { ProductDetail } from './pages/customer/ProductDetail';
import { Cart } from './pages/customer/Cart';
import { Checkout } from './pages/customer/Checkout';
import { Orders } from './pages/customer/Orders';
import { OrderDetail } from './pages/customer/OrderDetail';
import { Login } from './pages/customer/Login';
import { Register } from './pages/customer/Register';
import { Profile } from './pages/customer/Profile';

import { PERMISSIONS } from './lib/permissions';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors
        if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const paypalOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
  currency: "USD",
  intent: "capture",
};

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PayPalScriptProvider options={paypalOptions}>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Customer routes */}
                <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
                <Route path="/products" element={<CustomerLayout><ProductCatalog /></CustomerLayout>} />
                <Route path="/products/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
                <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
                <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />

                {/* Protected customer routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CustomerLayout><Checkout /></CustomerLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <CustomerLayout><Orders /></CustomerLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <CustomerLayout><OrderDetail /></CustomerLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <CustomerLayout><Profile /></CustomerLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requiredRoles={['Admin', 'admin']}>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute requiredRoles={['Admin', 'admin']}>
                      <DashboardLayout>
                        <Products />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />


                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </PayPalScriptProvider>

        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;