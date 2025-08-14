# BuyNow E-commerce Application

A complete Amazon/Flipkart-style e-commerce web application built with Vite + React for the frontend and .NET Core Web API with SQLite for the backend.

## Features

### Customer Features
- **Product Browsing**: Browse products by category, search, sort, and filter
- **Product Details**: Detailed product pages with images, descriptions, and reviews
- **Shopping Cart**: Add/remove items, update quantities, view cart summary
- **Checkout**: Secure checkout process with PayPal integration
- **Order Management**: View order history and track order status
- **User Authentication**: Register, login, logout, and password change
- **User Profile**: View and manage profile information

### Admin Features
- **Product Management**: Full CRUD operations for products
- **Category Management**: Manage product categories
- **Order Management**: View and update order status
- **User Management**: View user accounts and activity
- **Dashboard**: Overview of key metrics and recent activity

### Technical Features
- **Fully Dynamic**: All data flows from SQLite DB → .NET API → React UI
- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Role-Based Access**: Admin and User roles with appropriate permissions
- **PayPal Integration**: Secure payment processing
- **Responsive Design**: Mobile-first responsive design
- **Real-time Updates**: State management with Redux Toolkit

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **TailwindCSS** for styling
- **React Hook Form** with Zod validation
- **PayPal React SDK** for payments
- **Tanstack Query** for server state management

### Backend
- **.NET 8** Web API
- **Entity Framework Core** with SQLite
- **JWT Authentication** with BCrypt password hashing
- **Swagger/OpenAPI** documentation
- **CORS** enabled for frontend integration

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- .NET 8 SDK
- Git

### Backend Setup

1. Navigate to the API directory:
```bash
cd API
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Update the database connection string in `appsettings.json` if needed (SQLite is used by default).

4. Run the application:
```bash
dotnet run
```

The API will be available at `https://localhost:5001` or `http://localhost:5000`.

### Frontend Setup

1. Navigate to the UI directory:
```bash
cd UI
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file and configure:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Default Accounts

### Admin Account
- **Email**: admin@buynow.com
- **Password**: admin123

### Test User
Register a new account to test user features.

## Database Seeding

The application automatically seeds the database with:
- 1 Admin user account
- 5 Product categories
- 20 Sample products
- Application configuration settings

## API Documentation

Once the backend is running, visit `http://localhost:5000/swagger` to view the interactive API documentation.

## Project Structure

```
BuyNow/
├── API/                          # .NET Core Web API
│   ├── Controllers/              # API Controllers
│   ├── Models/                   # Entity Models
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Data/                     # Database Context
│   ├── Services/                 # Business Logic Services
│   └── Program.cs                # Application Entry Point
├── UI/                           # React Frontend
│   ├── src/
│   │   ├── components/           # Reusable Components
│   │   ├── pages/                # Page Components
│   │   ├── hooks/                # Custom Hooks
│   │   ├── store/                # Redux Store
│   │   ├── types/                # TypeScript Types
│   │   ├── lib/                  # Utilities and API Client
│   │   └── contexts/             # React Contexts
│   ├── public/                   # Static Assets
│   └── package.json              # Dependencies
└── README.md                     # This File
```

## Key Features Implementation

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/User)
- Protected routes and API endpoints
- Secure password hashing with BCrypt

### E-commerce Functionality
- Dynamic product catalog with filtering and sorting
- Shopping cart with persistent state
- PayPal payment integration
- Order management and tracking
- Inventory management

### Data Flow
- All data is fetched from the SQLite database
- No hardcoded data in frontend or backend
- Dynamic categories, filters, and configuration
- Real-time cart and order updates

## Development

### Running Tests
```bash
# Frontend tests
cd UI
npm test

# Backend tests
cd API
dotnet test
```

### Building for Production
```bash
# Frontend build
cd UI
npm run build

# Backend publish
cd API
dotnet publish -c Release
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact support@buynow.com or create an issue in the repository.
