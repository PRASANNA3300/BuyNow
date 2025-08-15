import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  LogOut,
  Settings,
  Menu,
  X,
  Tag
} from 'lucide-react';
import { PERMISSIONS } from '../../lib/permissions';
import { Button } from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();

  // Admin users have access to all navigation items
  const isAdmin = user?.role === 'Admin' || user?.role === 'admin';

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      permission: PERMISSIONS.VIEW_PRODUCTS,
    },
  ];

  const filteredNavigation = navigation.filter(item =>
    isAdmin || hasPermission(item.permission)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-600 bg-opacity-75 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-slate-50 border-b border-slate-200">
            <h1 className="text-xl font-semibold text-slate-900">
              {import.meta.env.VITE_APP_NAME}
            </h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded-md hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }
                  `}
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}