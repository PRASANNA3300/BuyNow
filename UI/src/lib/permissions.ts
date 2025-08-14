export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'dashboard.view',
  
  // Products
  VIEW_PRODUCTS: 'products.view',
  CREATE_PRODUCTS: 'products.create',
  UPDATE_PRODUCTS: 'products.update',
  DELETE_PRODUCTS: 'products.delete',
  
  // Users
  VIEW_USERS: 'users.view',
  CREATE_USERS: 'users.create',
  UPDATE_USERS: 'users.update',
  DELETE_USERS: 'users.delete',
  
  // System
  MANAGE_SYSTEM: 'system.manage',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  Admin: Object.values(PERMISSIONS),
  admin: Object.values(PERMISSIONS),
  Manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.UPDATE_PRODUCTS,
    PERMISSIONS.VIEW_USERS,
  ],
  manager: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.CREATE_PRODUCTS,
    PERMISSIONS.UPDATE_PRODUCTS,
    PERMISSIONS.VIEW_USERS,
  ],
  User: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PRODUCTS,
  ],
  user: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PRODUCTS,
  ],
};

export const hasPermission = (userRole: string, permission: Permission): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

export const hasAnyRole = (userRole: string, roles: string | string[]): boolean => {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.some(role =>
    role.toLowerCase() === userRole.toLowerCase() ||
    roleArray.includes(userRole)
  );
};