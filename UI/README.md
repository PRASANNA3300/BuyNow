# React 19 Admin Dashboard

A modern, role-based admin dashboard built with React 19, TypeScript, and TanStack Query. Features clean architecture, comprehensive CRUD operations, and production-ready code organization.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS
- **Data Management**: TanStack Query for caching, optimistic updates, and synchronization
- **Authentication**: Context-based auth with JWT token management
- **Role-Based Access**: Granular permissions system (Admin, Manager, User)
- **Responsive Design**: Mobile-first approach with clean, professional UI
- **Feature Separation**: Clean architecture with organized file structure
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Optimistic Updates**: Immediate UI feedback with automatic rollback on errors
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Type Safety**: Full TypeScript coverage for robust development

## 🏗️ Architecture

### Feature-Based Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Input, Modal, etc.)
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components (Sidebar, Header, etc.)
│   ├── products/        # Product-specific components
│   └── users/           # User-specific components
├── contexts/            # React contexts (Auth)
├── hooks/               # Custom hooks for data fetching
├── lib/                 # Utilities (API client, permissions)
├── pages/               # Main application pages
├── types/               # TypeScript type definitions
└── App.tsx             # Main app component
```

### Permissions System
- **Admin**: Full access to all features
- **Manager**: Dashboard, Products (view/create/update), Users (view only)
- **User**: Dashboard and Products (view only)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file with the following variables:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME="Admin Dashboard"
VITE_APP_VERSION="1.0.0"
VITE_NODE_ENV=development
```

## 📖 Usage

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Demo Credentials
Since this is a frontend-only demo, the API calls will fail. For a complete experience, implement a backend API that matches the expected endpoints.

**Demo Login Credentials:**
- **Admin**: admin@example.com / password
- **Manager**: manager@example.com / password  
- **User**: user@example.com / password

## 🔗 API Integration

The app expects a backend API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token

### Products
- `GET /products` - List products (with filtering)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Users
- `GET /users` - List users (with filtering)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🎯 Key Features Explained

### TanStack Query Hooks
The app uses custom hooks for data management:

```typescript
// Products
const { data, isLoading, error } = useProducts(filters);
const createMutation = useCreateProduct();
const updateMutation = useUpdateProduct();
const deleteMutation = useDeleteProduct();

// Users
const { data, isLoading, error } = useUsers(filters);
const createMutation = useCreateUser();
const updateMutation = useUpdateUser();
const deleteMutation = useDeleteUser();
```

### Optimistic Updates
All mutations include optimistic updates for immediate user feedback:

```typescript
onSuccess: (newProduct) => {
  // Optimistic update: Add the new product to the cache
  queryClient.setQueryData<Product[]>([PRODUCTS_QUERY_KEY], (old) => {
    return old ? [newProduct, ...old] : [newProduct];
  });
  
  // Invalidate and refetch
  queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
}
```

### Role-Based Permissions
Components and routes are protected based on user permissions:

```typescript
{hasPermission(PERMISSIONS.CREATE_PRODUCTS) && (
  <Button onClick={() => setIsModalOpen(true)}>
    <Plus className="h-4 w-4 mr-2" />
    Add Product
  </Button>
)}
```

### Responsive Design
Built mobile-first with Tailwind CSS:
- Collapsible sidebar on mobile
- Responsive grids and layouts
- Touch-friendly interface elements

## 🔧 Customization

### Adding New Features
1. Create types in `src/types/`
2. Add API methods to `src/lib/api.ts`
3. Create custom hooks in `src/hooks/`
4. Build components in appropriate feature folders
5. Add routes to `src/App.tsx`
6. Update permissions in `src/lib/permissions.ts`

### Styling
The app uses Tailwind CSS with a consistent design system:
- Primary: Blue (#3B82F6)
- Secondary: Slate (#64748B)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)

### Environment Configuration
All configuration is handled through environment variables and can be customized per deployment environment.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on the GitHub repository.