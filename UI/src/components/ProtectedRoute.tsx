import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  requiredRoles = []
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
            <p className="text-slate-600">You don't have permission to access this resource.</p>
          </div>
        </div>
      );
    }
  }

  // Check required roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = hasRole(requiredRoles);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
            <p className="text-slate-600">Your role doesn't have access to this resource.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}