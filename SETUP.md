# BuyNow E-commerce Setup Guide

This guide will help you set up and run the BuyNow e-commerce application locally.

## Quick Start

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
# Run the automated setup script
start-dev.bat
```

**For macOS/Linux:**
```bash
# Make the script executable
chmod +x start-dev.sh

# Run the automated setup script
./start-dev.sh
```

### Option 2: Manual Setup

1. **Install Dependencies:**
```bash
npm run install:all
```

2. **Start Backend API:**
```bash
npm run dev:api
```

3. **Start Frontend (in a new terminal):**
```bash
npm run dev:ui
```

## Detailed Setup Instructions

### Prerequisites

Make sure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd BuyNow
```

### Step 2: Backend Setup

1. Navigate to the API directory:
```bash
cd API
```

2. Restore .NET dependencies:
```bash
dotnet restore
```

3. Run the API:
```bash
dotnet run
```

The API will start at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`

### Step 3: Frontend Setup

1. Navigate to the UI directory (in a new terminal):
```bash
cd UI
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

5. Start the development server:
```bash
npm run dev
```

The frontend will start at: `http://localhost:5173`

## PayPal Configuration

To enable PayPal payments:

1. Create a PayPal Developer account at [developer.paypal.com](https://developer.paypal.com)
2. Create a new application in the PayPal Developer Dashboard
3. Copy your Client ID
4. Update the `VITE_PAYPAL_CLIENT_ID` in your `.env` file

For testing, you can use PayPal's sandbox environment.

## Default Login Credentials

### Admin Account
- **Email:** admin@buynow.com
- **Password:** admin123

### Customer Account
Register a new account through the application to test customer features.

## Database

The application uses SQLite and will automatically:
- Create the database file (`buynow.db`) on first run
- Run migrations to set up tables
- Seed initial data including:
  - Admin user account
  - 5 product categories
  - 20 sample products
  - Application configuration

## Accessing the Application

Once both services are running:

1. **Customer Interface:** Visit `http://localhost:5173`
   - Browse products
   - Add items to cart
   - Complete checkout with PayPal
   - View order history

2. **Admin Interface:** Visit `http://localhost:5173/admin/dashboard`
   - Login with admin credentials
   - Manage products and categories
   - View and update orders
   - Monitor user activity

3. **API Documentation:** Visit `http://localhost:5000/swagger`
   - Interactive API documentation
   - Test API endpoints
   - View request/response schemas

## Troubleshooting

### Common Issues

**Port Already in Use:**
- Backend: Change the port in `API/Properties/launchSettings.json`
- Frontend: Vite will automatically suggest an alternative port

**Database Issues:**
- Delete the `buynow.db` file and restart the API to recreate the database

**PayPal Integration:**
- Ensure you have a valid PayPal Client ID in your `.env` file
- Check browser console for PayPal-related errors

**CORS Errors:**
- Ensure the API is running on the expected port
- Check the `VITE_API_BASE_URL` in your `.env` file

### Logs and Debugging

**Backend Logs:**
- Console output shows API requests and database operations
- Check for any startup errors or exceptions

**Frontend Logs:**
- Open browser developer tools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for failed API requests

## Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload during development

2. **Database Reset:** To reset the database with fresh seed data:
   ```bash
   # Stop the API
   # Delete the buynow.db file in the API directory
   # Restart the API
   ```

3. **API Testing:** Use the Swagger UI at `http://localhost:5000/swagger` to test API endpoints

4. **State Management:** The frontend uses Redux DevTools for debugging state changes

## Production Deployment

For production deployment:

1. **Build the frontend:**
```bash
cd UI
npm run build
```

2. **Publish the backend:**
```bash
cd API
dotnet publish -c Release
```

3. **Configure production environment variables**
4. **Set up a production database** (consider PostgreSQL or SQL Server)
5. **Configure HTTPS and security headers**
6. **Set up proper logging and monitoring**

## Support

If you encounter any issues:

1. Check this setup guide
2. Review the main README.md file
3. Check the troubleshooting section above
4. Create an issue in the repository with detailed error information

## Next Steps

After successful setup:

1. Explore the customer interface by browsing products and making a test purchase
2. Login as admin to manage products and view orders
3. Review the API documentation to understand available endpoints
4. Customize the application for your specific needs
