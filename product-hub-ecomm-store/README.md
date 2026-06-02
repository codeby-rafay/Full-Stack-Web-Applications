# ProductHub E-Commerce Store

![React](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.0.1-purple?style=flat-square&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-Free-blue?style=flat-square)

A modern, full-stack e-commerce application built with **React 19** and **Vite** frontend, and **Node.js/Express** backend with **MongoDB**. Browse, search, and explore products across categories while enjoying a personalized shopping experience with secure user authentication, role-based access control, and user-specific cart and saved items.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Installation](#️-installation)
- [Available Routes](#-available-routes)
- [Architecture](#️-architecture)
- [Feature Details](#-feature-details)
- [Security](#-security)
- [API Integration](#-api-integration)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Author](#-author)

## Features

### Authentication & Security

- **User Authentication**: Secure login with JWT tokens + password hashing (signup creates the account; login issues the JWT)
- **Google OAuth Integration**: Quick login and registration with Google OAuth
- **Password Reset**: Secure OTP-based password recovery via email (Nodemailer integration)
- **Role-Based Access Control**: Admin and user roles with protected admin routes
- **Session Management**: Persistent sessions with browser localStorage and secure token storage

### Shopping Experience

- **Product Listing**: Display all available products with detailed information and pagination
- **Product Search**: Real-time search for products with instant feedback
- **Category Filtering**: Browse products organized by categories
- **Product Details**: View comprehensive product information with multiple images, ratings, reviews, and policies
- **Shopping Cart**: Add/remove products, adjust quantities, with automatic total calculation (user-specific)
- **Save Items (Wishlist)**: Bookmark favorite products for later viewing (user-specific, persistent)
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS with auto-scroll to top

### Admin Features

- **Admin Dashboard**: Comprehensive admin panel for managing users and viewing activity
- **Login/Signup History**: Track all user login and registration records with timestamps
- **User Management**: View and manage registered users and their information
- **Order Management**: View and manage all customer orders with status updates
- **User Feedback Management**: Review customer feedback and submit admin replies
- **Delete Confirmation**: Beautiful animated modals with Framer Motion for destructive actions
- **Protected Routes**: Admin dashboard is protected with role-based access control

### Order & Notification System

- **Order Management**: Users can view, track, and manage their personal orders
- **Order Status Tracking**: Track order progress (pending, confirmed, shipped, delivered, cancelled)
- **Notifications**: Real-time notifications for orders, payments, and customer feedback replies
- **Customer Feedback**: Customers can submit feedback and receive admin replies
- **Toast Notifications**: Real-time feedback with React Toastify for all user actions

### User Interface

- **Modern UI**: Clean and intuitive user interface with Lucide React icons
- **Animated Modals**: Beautiful confirmation dialogs using Framer Motion
- **Loading States**: Skeleton loading components (react-loading-skeleton) for better UX
- **Toast Notifications**: Non-intrusive feedback messages
- **Persistent Data**: User data stored with user ID isolation for privacy and security

## Tech Stack

### Frontend Stack

| Technology                 | Version  | Purpose                         |
| -------------------------- | -------- | ------------------------------- |
| **React**                  | 19.2.4   | UI Framework                    |
| **Vite**                   | 8.0.1    | Build Tool & Development Server |
| **React Router DOM**       | 7.13.2   | Client-side Routing             |
| **Tailwind CSS**           | 4.2.2    | Utility-first CSS Framework     |
| **Axios**                  | 1.13.6   | HTTP Client                     |
| **React Context API**      | Built-in | Global State Management         |
| **Framer Motion**          | 12.38.0  | Animations & Transitions        |
| **React Toastify**         | 11.0.5   | Toast Notifications             |
| **Lucide React**           | 1.3.0    | Icon Library                    |
| **React Loading Skeleton** | 3.5.0    | Loading States                  |
| **Formik**                 | 2.4.9    | Form Management                 |
| **Zod**                    | 4.4.3    | Schema Validation               |
| **Three.js**               | 0.184.0  | 3D Graphics (optional)          |

### Backend Stack

| Technology              | Version | Purpose              |
| ----------------------- | ------- | -------------------- |
| **Node.js**             | 20.x    | Runtime Environment  |
| **Express.js**          | 4.22.1  | Web Framework        |
| **MongoDB**             | 5.x+    | NoSQL Database       |
| **Mongoose**            | 9.5.0   | MongoDB ODM          |
| **JWT**                 | 9.0.2   | Authentication       |
| **bcryptjs**            | 2.4.3   | Password Hashing     |
| **Nodemailer**          | 8.0.7   | Email Delivery       |
| **Google Auth Library** | 10.6.2  | OAuth Authentication |
| **Express Validator**   | 7.3.2   | Input Validation     |
| **CORS**                | 2.8.5   | Cross-Origin Support |
| **Morgan**              | 1.10.1  | HTTP Logging         |
| **Redis**               | 5.12.1  | Caching & Sessions   |
| **Jest**                | 30.3.0  | Testing Framework    |
| **Supertest**           | 7.2.2   | HTTP Testing         |

## Project Structure

```
product-hub-ecomm-store/
│
├── frontend/                                # React Vite Frontend Application
│   ├── public/                              # Static assets
│   ├── src/
│   │   ├── components/                      # Reusable React components
│   │   │   ├── Navbar.jsx                   # Navigation bar component
│   │   │   ├── Footer.jsx                   # Footer component
│   │   │   ├── CartDisplay.jsx              # Shopping cart drawer component
│   │   │   ├── ProductCard.jsx              # Reusable product card component
│   │   │   ├── SearchBar.jsx                # Search functionality component
│   │   │   ├── LoadingError.jsx             # Loading and error states
│   │   │   ├── ProtectedAdminRoute.jsx      # Admin route protection component
│   │   │   ├── DeleteConfirmationModal.jsx  # Animated delete confirmation modal
│   │   │   ├── NavbarComponents/            # Navbar sub-components (menu, auth, etc.)
│   │   │   ├── CartPanelComponents/         # Cart panel UI components
│   │   │   ├── HomePageComponents/          # Home page specific components
│   │   │   ├── ProductsPageComponents/      # Products page components
│   │   │   ├── CategoriesCardComponents/    # Category card components
│   │   │   └── SingleProductPageComponents/ # Single product detail components
│   │   │
│   │   ├── context/
│   │   │   └── ShopContext.jsx              # Global state management (auth + cart + saved items)
│   │   │
│   │   ├── pages/                           # Page components (each route)
│   │   │   ├── Home.jsx                     # Home page
│   │   │   ├── Products.jsx                 # All products listing page
│   │   │   ├── SingleProduct.jsx            # Individual product details page
│   │   │   ├── Categories.jsx               # Categories listing page
│   │   │   ├── CategoryProducts.jsx         # Products by category page
│   │   │   ├── Login.jsx                    # User login page
│   │   │   ├── Signup.jsx                   # User signup/registration page
│   │   │   ├── ResetPassword.jsx            # Password reset page (OTP-based)
│   │   │   ├── AdminPage.jsx                # Admin dashboard page
│   │   │   ├── ManageOrdersAdmin.jsx        # Admin order management page
│   │   │   ├── UserFeedback.jsx             # Admin user feedback management page
│   │   │   ├── Notifications.jsx            # User notifications page
│   │   │   ├── ReviewOrdersUser.jsx         # User orders review page
│   │   │   ├── About.jsx                    # About page
│   │   │   ├── Contact.jsx                  # Contact page
│   │   │   ├── Saved.jsx                    # Saved items (wishlist) page
│   │   │   └── NotFound404.jsx              # 404 error page
│   │   │
│   │   ├── api/                             # API integration modules
│   │   │   └── (API service files)
│   │   │
│   │   ├── hooks/                           # Custom React hooks
│   │   ├── utils/                           # Utility functions and helpers
│   │   ├── assets/                          # Images, icons, and static files
│   │   ├── App.jsx                          # Main app component with routing
│   │   ├── main.jsx                         # Application entry point
│   │   ├── App.css                          # App component styles
│   │   ├── index.css                        # Global styles
│   │   ├── vite.config.js                   # Vite configuration
│   │   ├── tailwind.config.js               # Tailwind CSS configuration
│   │   ├── eslint.config.js                 # ESLint configuration
│   │   └── package.json                     # Frontend dependencies
│   │
│   └── index.html                           # HTML entry point
│
└── backend/                                 # Express.js API Server
    ├── server.js                            # Main server entry point
    ├── package.json                         # Backend dependencies
    ├── .env                                 # Environment variables (create this)
    │
    └── src/
        ├── app.js                           # Express app configuration & routes
        │
        ├── db/                              # Database configuration
        │   └── connection.js                # MongoDB connection setup
        │
        ├── models/                          # MongoDB schemas
        │   ├── signup.model.js              # User schema with role field
        │   ├── login.model.js               # Login history schema
        │   ├── order.model.js               # Order schema
        │   ├── notification.model.js        # Notifications schema
        │   └── feedback.model.js            # Customer feedback schema
        │
        ├── controllers/                     # Route handlers
        │   ├── authController.js            # Authentication handlers
        │   ├── orderController.js           # Order management handlers
        │   ├── notificationController.js    # Notification handlers
        │   └── feedbackController.js        # Feedback handlers
        │
        ├── routes/                          # API routes
        │   ├── auth.routes.js               # Authentication routes
        │   ├── order.routes.js              # Order routes
        │   ├── notification.routes.js       # Notification routes
        │   ├── feedback.routes.js           # Feedback routes
        │   └── admin.routes.js              # Admin-specific routes
        │
        ├── middlewares/                     # Express middleware
        │   ├── auth.middleware.js           # JWT verification
        │   ├── errorHandler.js              # Error handling middleware
        │   └── validation.middleware.js     # Input validation
        │
        ├── services/                        # Business logic services
        │   ├── emailService.js              # Email/OTP service
        │   ├── googleOAuth.js               # Google OAuth service
        │   └── tokenService.js              # JWT token service
        │
        └── tests/                           # Test files (Jest + Supertest)
            └── (test files)
```

## Architecture

### State Management

The application uses **React Context API** for global state management through the `ShopContext`:

```javascript
// Available context values
{
  // Authentication
  (currentUser, // Currently logged-in user object with role (null if not logged in)
    login, // Function to login user (saves user & token)
    logout, // Function to logout user
    // Shopping Cart (user-specific)
    cartItems, // Array of items in cart for current user
    addToCart, // Add product to cart
    increaseQty, // Increase product quantity
    decreaseQty, // Decrease product quantity
    removeFromCart, // Remove item from cart
    cartCount, // Total quantity of items in cart
    isInCart, // Check if product is in cart
    getQtyInCart, // Get quantity of specific product in cart
    // Saved Items (user-specific, wishlist)
    savedItems, // Array of saved/favorited items for current user
    toggleSave, // Save/unsave a product
    isSaved); // Check if product is saved
}
```

### User-Specific Storage

Each user's cart and saved items are stored separately in localStorage with user ID-based keys:

- **`cart_[userId]`** - User's shopping cart (persisted across sessions)
- **`savedItems_[userId]`** - User's saved items (persisted across sessions)

This ensures **complete data isolation**:

- When a user logs in, they see only their items
- When they log out, their items remain saved
- Items are automatically loaded when they log back in
- Data is persisted to localStorage automatically whenever cart or saved items change

## Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **MongoDB** 5.x or higher (local or cloud instance)
- **npm** or **yarn** package manager
- **Google OAuth** credentials (optional, for OAuth login)
- **Gmail account** (for OTP email delivery)

### Clone & Setup (5 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd product-hub-ecomm-store

# Backend Setup
cd backend
npm install
# Create .env file with required variables
# Then start the server:
npm run dev

# Frontend Setup (in a new terminal)
cd frontend
npm install
npm run dev

# Open http://localhost:5173 in your browser
```

**That's it!** Your e-commerce application is now running locally.

## Feature Details

### User Authentication

The application includes a complete authentication system:

- **Sign Up**: Create a new account with your full name, email, and password
- **Login**: Sign in with your email and password to access your personalized account
- **Google OAuth**: Quick login/registration using Google OAuth credentials
- **Secure Passwords**: Passwords are hashed using bcryptjs before storage
- **JWT Tokens**: Login (email/password or Google) issues JWT tokens for secure sessions
- **Session Persistence**: Stay logged in across browser sessions; logout removes your session
- **User-Specific Data**: Each user's cart and saved items are completely isolated
- **Password Security**: Tokens stored in localStorage for persistent sessions
- **Role-Based Access**: Admin and user roles for authorization control

### Shopping Cart

- Click the floating shopping cart button (bottom-left) to open the cart drawer
- View all items in your cart with quantities and prices (user-specific)
- Use +/- buttons to adjust item quantities
- Click the X button to remove items from cart
- The cart badge shows total number of items
- Cart total is calculated automatically
- Cart persists across sessions for logged-in users

### Saved Items

### Shopping Cart

- Click the floating shopping cart button (bottom-left) to open the cart drawer
- View all items in your cart with quantities and prices (user-specific)
- Use +/- buttons to adjust item quantities
- Click the X button to remove items from cart
- The cart badge shows total number of items in real-time
- Cart total is calculated automatically
- Cart persists across sessions for logged-in users
- Full user-specific data isolation

### Saved Items (Wishlist)

- Click the heart icon on any product card to save it
- Saved items appear in the navbar with count badge
- View all saved items on the dedicated Saved page
- Saved items persist across sessions for logged-in users
- Your saved items are completely private and only visible to you
- Quick toggle between saved and unsaved states

### Admin Dashboard

- **Admin-Only Access**: Only users with admin role can access the dashboard
- **Protected Routes**: Admin dashboard is protected with role-based access control
- **Login History**: View all user login records with timestamps and email addresses (with delete confirmation)
- **Signup Management**: Track all user registrations with creation dates and account information
- **User Management**: View and manage all registered users with their information
- **Order Management**: View and manage customer orders with status updates
- **User Feedback**: Review customer feedback and submit admin replies
- **Analytics**: View insights into user activity and account creation patterns
- **Secure Access**: JWT tokens verify admin authorization before granting access

### Product Discovery

- **Real-Time Search**: Type keywords to find products instantly
- **Category Browsing**: Explore products organized by categories
- **Product Details**: View comprehensive information including:
  - Multiple product images with thumbnail selection
  - Price and discount information
  - Product ratings and customer reviews
  - Stock availability information
  - Warranty, shipping, and return policy details
  - Auto-scroll to top when product page opens

### Notifications System

- **Real-Time Updates**: Notifications for order status changes, payments, and feedback replies
- **Notification Types**: Order placed, confirmed, shipped, delivered, cancelled, payment updates, feedback replies
- **Rich Content**: Detailed information including order details and feedback conversation context
- **Mark as Read**: Mark individual notifications or all notifications as read
- **Persistent Storage**: Notifications persist across sessions
- **Admin Replies**: When admins reply to feedback, users receive notifications with the conversation

### Order Management

- **User Order History**: View your personal orders on the "My Orders" page
- **Order Details**: See complete order information including items, dates, and status
- **Order Status Tracking**: Track order progress through different statuses
- **Order Actions**: Users can cancel orders; admins can update order status
- **Admin Dashboard**: Admins can manage all customer orders
- **Delete Confirmation**: Beautiful modal confirmation before deleting orders

### Customer Feedback

- **Submit Feedback**: Send feedback from the contact page
- **Admin Panel**: Admins can view all feedback and submit replies
- **Notification System**: Users receive notifications when admins reply
- **Conversation Context**: See both user feedback and admin responses
- **Status Tracking**: Track feedback that has been replied to
- **Delete Feedback**: Both users and admins can delete feedback

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org))
- **MongoDB** 5.x or higher ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn** package manager
- **Git** for version control

### Optional Requirements

- **Google OAuth Credentials** - For implementing Google login
  - [Create OAuth credentials](https://console.cloud.google.com)
  - Get Client ID for both backend and frontend
- **Gmail Account** - For OTP-based password reset
  - Use [Gmail App Passwords](https://myaccount.google.com/apppasswords)
  - Note: Regular Gmail password won't work; you need App Password

### Environment Setup

#### Backend `.env` File

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/product-hub

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here

# Email Configuration (for OTP password reset)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password_here

# Server Port
PORT=3000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env` File

Create a `.env` file in the `frontend/` directory:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Backend API URL
VITE_API_URL=http://localhost:3000
```

**Important Notes**:

- Replace placeholder values with your actual credentials
- Keep these files secure; never commit them to version control
- Use `.env.example` as a template for team members
- For production, use environment-specific configurations

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file with configuration (see above)

4. Start the backend server:

   ```bash
   npm run dev        # Development with auto-reload
   # or
   npm start          # Production mode
   ```

   The server will start at `http://localhost:3000` with endpoints:
   - `POST /api/signup` - Register a new user
   - `POST /api/login` - Login user
   - `POST /api/google-login` - Login/register with Google
   - `GET/POST /api/orders` - Manage orders
   - `PATCH/DELETE /api/orders/:orderId` - Update/delete orders
   - And more... (see API Routes section)

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file with configuration (see above)

4. Start the development server with Hot Module Replacement (HMR):

   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`

### Complete Local Development Setup

Run this in your terminal:

```bash
# Clone the repository
git clone <your-repo-url>
cd product-hub-ecomm-store

# Terminal 1: Backend
cd backend
npm install
# Create and configure .env file
npm run dev

# Terminal 2: Frontend (open new terminal)
cd frontend
npm install
# Create and configure .env file
npm run dev

# Open http://localhost:5173 in your browser
```

## Available Routes

### Frontend Routes

#### Public Routes

- **`/`** - Home page with featured products and categories
- **`/products`** - All products listing page with pagination
- **`/categories`** - Product categories overview page
- **`/category/:slug`** - Products filtered by specific category
- **`/login`** - User login page (email/password or Google OAuth)
- **`/signup`** - User registration page
- **`/reset-password`** - Password reset page (OTP-based email verification)
- **`/about`** - About page with company information
- **`/contact`** - Contact page with feedback form

#### Protected Routes (Requires Login)

- **`/saved`** - Saved/favorited items page (user-specific, wishlist)
- **`/notifications`** - User notifications for orders and feedback replies
- **`/my-orders`** - User's personal orders and order history
- **`/products/:id`** - Single product details (auto-scrolls to top)

#### Admin Routes (Admin Only)

- **`/admin/dashboard`** - Admin dashboard with login/signup history and user management
- **`/admin/manage-orders`** - Admin order management interface
- **`/admin/user-feedback`** - Admin user feedback management panel

#### Error Routes

- **`/404`** - Not Found page for invalid routes

### Backend API Endpoints

#### Authentication Routes

- **`POST /api/signup`** - Register new user
  - Body: `{ fullName, email, password }`
  - Returns: User object + JWT token
- **`POST /api/login`** - Login with email/password
  - Body: `{ email, password }`
  - Returns: User object + JWT token
- **`POST /api/google-login`** - Login/register with Google OAuth
  - Body: `{ tokenId }`
  - Returns: User object + JWT token
- **`POST /api/send-otp`** - Send OTP to email
  - Body: `{ email }`
  - Returns: Success message
- **`POST /api/verify-otp`** - Verify OTP from email
  - Body: `{ email, otp }`
  - Returns: Success message
- **`POST /api/reset-password`** - Reset password using OTP
  - Body: `{ email, newPassword }`
  - Returns: Success message

#### Admin Records Routes

- **`GET /api/signup`** - Fetch all signup records (Admin only)
- **`DELETE /api/signup/:id`** - Delete signup record (Admin only)
- **`GET /api/login`** - Fetch all login records (Admin only)
- **`DELETE /api/login/:id`** - Delete login record (Admin only)

#### Order Management Routes

- **`POST /api/orders`** - Create new order
  - Body: `{ userId, products, totalAmount, ... }`
- **`GET /api/orders`** - Fetch all orders (Admin only)
- **`GET /api/orders/:userId`** - Fetch orders for specific user
- **`PATCH /api/orders/:orderId`** - Update order status (Admin only)
  - Body: `{ status }`
- **`DELETE /api/orders/:orderId`** - Delete order

#### Notifications Routes

- **`GET /api/notifications/:userId`** - Fetch user notifications
- **`PUT /api/notifications/:notificationId/read`** - Mark notification as read
- **`PUT /api/notifications/:userId/read-all`** - Mark all notifications as read
- **`DELETE /api/notifications/:notificationId`** - Delete specific notification
- **`DELETE /api/notifications/:userId/clear-all`** - Clear all notifications

#### User Feedback Routes

- **`POST /api/feedback`** - Submit customer feedback
  - Body: `{ userId, subject, message }`
- **`GET /api/feedback`** - Fetch all feedback (Admin only)
- **`GET /api/feedback/:userId`** - Fetch user's feedback
- **`POST /api/feedback/:feedbackId/reply`** - Admin reply to feedback (Admin only)
  - Body: `{ reply }`
- **`DELETE /api/feedback/:feedbackId`** - Delete feedback

## Security

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access Control**: Admin vs user permissions
- **Protected Routes**: Frontend and backend route protection
- **Token Storage**: Secure localStorage with automatic expiration

### Data Privacy

- **User Isolation**: Complete data isolation between users
- **Cart & Wishlist**: User-specific storage with ID-based keys
- **CORS Configuration**: Restricted cross-origin access
- **Input Validation**: Express validator for all user inputs
- **Error Handling**: Secure error messages without exposing sensitive info

### Best Practices

- **Environment Variables**: Sensitive data stored in `.env` files
- **HTTPS Ready**: Backend supports HTTPS in production
- **Secure Headers**: CORS, helmet, and security middleware
- **Rate Limiting**: Protection against brute-force attacks (ready for implementation)
- **Validation**: Server-side validation of all user inputs

## API Integration

### DummyJSON API

This application uses the [DummyJSON API](https://dummyjson.com) for product data:

- **Get All Products**: Fetches products with customizable limits and pagination
- **Get Single Product**: Retrieves detailed information for a specific product
- **Search Products**: Searches products by query string
- **Get Categories**: Fetches all available product categories
- **Get Products by Category**: Filters products by selected category

### API Endpoints Used

```
GET  https://dummyjson.com/products
GET  https://dummyjson.com/products/search?q=laptop
GET  https://dummyjson.com/products/:id
GET  https://dummyjson.com/products/categories
GET  https://dummyjson.com/products/category/:slug
```

### Sample Response

```json
{
  "products": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "description": "Premium wireless headphones...",
      "price": 99.99,
      "thumbnail": "image-url",
      "images": ["url1", "url2"],
      "rating": 4.5,
      "reviews": [...],
      "category": "electronics",
      "stock": 50
    }
  ]
}
```

## Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist/` directory with:

- Minified JavaScript and CSS
- Tree-shaking for unused code
- Asset optimization
- Source maps for debugging

### Build Backend

The backend is production-ready; just ensure `.env` variables are configured for production.

### Preview Production Build

```bash
cd frontend
npm run preview
```

This previews the production build locally at `http://localhost:4173`

## Development

### Code Quality

Run ESLint to check for code quality issues:

```bash
cd frontend
npm run lint
```

### Project Structure

The project follows best practices:

- **Component-Based**: Reusable, modular components
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **Custom Hooks**: Reusable logic in custom React hooks
- **Context API**: Centralized global state management
- **Middleware**: Backend middleware for auth, validation, error handling

## Future Enhancements

- **Advanced Filtering**: Multi-attribute filtering and sorting
- **Product Reviews**: User reviews and ratings system
- **Payment Integration**: Stripe/PayPal checkout
- **Advanced Analytics**: Dashboard analytics and reports
- **Product Recommendations**: ML-based recommendations
- **Dark Mode**: Theme switching capability
- **Multi-Language**: i18n support
- **User Profiles**: Profile management and editing
- **Wishlist Sharing**: Share wishlists with friends
- **Product Comparison**: Compare multiple products
- **Inventory Management**: Backend inventory tracking
- **Discount System**: Coupons and promo codes
- **Email Notifications**: Automated email alerts
- **Performance**: Lazy loading and code splitting
- **Testing**: Comprehensive unit and integration tests

## Installation

### Environment Setup

#### Backend `.env` file (in `backend/` folder):

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Email Configuration (for OTP password reset)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

#### Frontend `.env` file (in `frontend/` folder):

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

**Note**:

- For Google OAuth, create credentials at [Google Cloud Console](https://console.cloud.google.com)
- For email, use Gmail with an [App Password](https://myaccount.google.com/apppasswords) (not your regular password)
- The `GOOGLE_CLIENT_ID` should be the same in both backend and frontend `.env` files

### Backend Setup (Authentication Server)

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm run start
   ```

   Or for development (auto-restart):

   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000` with the following endpoints:
   - `POST http://localhost:3000/api/signup` - Register a new user
   - `POST http://localhost:3000/api/login` - Login user
   - `POST http://localhost:3000/api/google-login` - Login/register with Google
   - `GET/POST http://localhost:3000/api/orders` - Manage orders
   - `PATCH/DELETE http://localhost:3000/api/orders/:orderId` - Update/delete an order

### Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

For local development, run the backend and frontend in separate terminals.

1. Start backend (Terminal 1):

   ```bash
   cd backend
   npm run dev or node server.js
   ```

2. Start frontend with Hot Module Replacement (HMR) (Terminal 2):

   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Building

Build the project for production:

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Preview

Preview the production build locally:

```bash
cd frontend
npm run preview
```

## Code Quality

Run ESLint to check for code quality issues:

```bash
cd frontend
npm run lint
```

## Available Routes

**Frontend Routes:**

- `/` - Home page
- `/login` - User login page
- `/signup` - User registration page
- `/reset-password` - Password reset page (via email OTP)
- `/products` - All products listing
- `/products/:id` - Single product details (auto-scrolls to top)
- `/categories` - Product categories
- `/category/:slug` - Products filtered by category
- `/saved` - Saved/favorited items page (user-specific)
- `/notifications` - User notifications for orders and feedback replies
- `/my-orders` - User's personal orders and order history
- `/about` - About page
- `/contact` - Contact page
- `/admin/dashboard` - Admin dashboard (admin-only, protected route)
- `/admin/manage-orders` - Admin order management (admin-only, protected route)
- `/admin/user-feedback` - Admin user feedback management (admin-only, protected route)

**Backend API Endpoints:**

_Authentication:_

- `POST /api/signup` - Register new user
- `POST /api/login` - Login user and receive JWT token
- `POST /api/google-login` - Login/register with Google
- `POST /api/send-otp` - Send OTP to email for password reset
- `POST /api/verify-otp` - Verify OTP sent to email
- `POST /api/reset-password` - Reset password using OTP

_Admin Records:_

- `GET /api/signup` - Fetch all signup records (admin)
- `DELETE /api/signup/:id` - Delete signup record (admin)
- `GET /api/login` - Fetch all login records (admin)
- `DELETE /api/login/:id` - Delete login record (admin)

_Orders:_

- `POST /api/orders` - Create new order
- `GET /api/orders` - Fetch all orders
- `GET /api/orders/:userId` - Fetch orders for specific user
- `PATCH /api/orders/:orderId` - Update order status
- `DELETE /api/orders/:orderId` - Delete order

_Notifications:_

- `GET /api/notifications/:userId` - Fetch user notifications
- `PUT /api/notifications/:notificationId/read` - Mark notification as read
- `PUT /api/notifications/:userId/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:notificationId` - Delete specific notification
- `DELETE /api/notifications/:userId/clear-all` - Clear all notifications

_User Feedback:_

- `POST /api/feedback` - Submit customer feedback
- `GET /api/feedback` - Fetch all feedback (admin)
- `GET /api/feedback/:userId` - Fetch user feedback
- `POST /api/feedback/:feedbackId/reply` - Add admin reply to feedback (admin)
- `DELETE /api/feedback/:feedbackId` - Delete feedback

## Features in Detail

### User Authentication

The application includes a complete authentication system with:

- **Signup**: Create new accounts with email and password
- **Login**: Secure login with JWT token generation
- **Google Login**: Quick login/registration using Google OAuth
- **Password Security**: Passwords are hashed using bcryptjs before storage
- **Session Management**: Tokens stored in localStorage for persistent sessions
- **User Isolation**: Each user's data is completely isolated from others
- **Role-Based Access**: Admin and user roles for authorization

### Password Reset

Users can securely reset forgotten passwords:

- **Send OTP**: Request password reset link via email
- **Verify OTP**: Validate OTP received in email
- **Reset Password**: Set a new password using verified OTP
- **Email Integration**: Secure OTP delivery via Nodemailer

### Admin Dashboard

The admin dashboard is a powerful management tool with:

- **Admin-Only Access**: Protected route that only users with admin role can access
- **Role-Based Authentication**: JWT tokens verify admin authorization
- **Login History**: View all user login records with timestamps and email addresses (with delete confirmation modal)
- **Signup Management**: Track all user registrations with full details and creation dates (with delete confirmation modal)
- **User Management**: View comprehensive information about all registered users
- **Data Overview**: Get insights into user activity and account creation patterns
- **Delete Confirmation**: Beautiful modal dialogs for confirming destructive actions
- **Success/Error Toasts**: Real-time feedback for all admin operations
- **Secure Interface**: Separate admin interface isolated from regular user features

### Product Search

The search bar allows users to find products quickly by typing keywords. Results are displayed in real-time.

### Category Browsing

Users can explore products organized by categories, making it easier to find what they're looking for.

### Product Details

Each product page displays comprehensive information including:

- Multiple product images with thumbnail selection
- Price and discount information
- Product ratings and customer reviews
- Stock availability
- Warranty, shipping, and return policy information
- **Auto-scroll to top** - Page automatically scrolls to the top when opened

### Shopping Cart

A persistent shopping cart stored in localStorage allows users to:

- Add/remove products
- Adjust quantities
- View cart total automatically calculated
- Data is user-specific (each user has their own cart)
- Cart persists across sessions for logged-in users
- Checkout button for future payment integration

### Saved Items (Wishlist)

Users can save their favorite products to view later:

- Save/unsave products with one click
- Dedicated saved items page
- Persistent storage across sessions (user-specific)
- Badge showing number of saved items
- Complete data isolation between users

### Responsive Layout

The application adapts perfectly to different screen sizes, from mobile phones to desktop computers.

### Delete Confirmation Modal

A reusable, animated confirmation dialog component for destructive actions:

- **Beautiful Animations**: Framer Motion animations for smooth transitions
- **Customizable Text**: Title, description, and button labels can be configured per use case
- **Backdrop Blur**: Professional blur effect on background when modal opens
- **Icon Display**: Trash icon for visual confirmation of delete action
- **Used in**: Order deletion, notification clearing, admin data deletion (login/signup records), and more
- **Toast Notifications**: Success or error toasts shown after confirmation

### Notifications System

A comprehensive notification system that keeps users informed about their orders and feedback:

- **Real-Time Updates**: Notifications for order status changes, payments, and feedback replies
- **Notification Types**: Order placed, confirmed, shipped, delivered, cancelled, payment completed/failed, feedback replies
- **Rich Content**: Display detailed information including order details and feedback conversation context
- **Mark as Read**: Users can mark individual notifications or all notifications as read
- **Persistent**: Notifications are stored in the database and persist across sessions
- **Beautiful UI**: Styled notifications with icons and status indicators
- **Admin Replies**: When admins reply to feedback, users receive notifications with both their message and the response

### User Feedback System

Allows customers to submit feedback and receive responses from admins:

- **Submit Feedback**: Users can send feedback from the contact page
- **Admin Panel**: Admins can view all feedback and submit replies
- **Reply Notifications**: When admins reply, users receive notifications with the conversation context
- **Feedback Status**: Track feedback that has been replied to
- **Delete Feedback**: Both users and admins can delete feedback
- **Email Notifications**: Optional email notifications for feedback replies

### Order Management

Comprehensive order management for both users and admins:

- **User Order History**: Users can view their personal orders on the "My Orders" page
- **Order Details**: View complete order information including items, dates, and status
- **Order Status**: Track order progress through different statuses (pending, confirmed, shipped, delivered, cancelled)
- **Order Actions**: Users can cancel orders, admins can update order status
- **Admin Dashboard**: Admins can manage all customer orders from the admin panel
- **Delete Confirmation**: Beautiful modal confirmation before deleting orders
- **Toast Feedback**: Real-time feedback on order operations

## Browser Support

This application works on all modern browsers that support:

- ES6+ JavaScript features
- CSS Grid and Flexbox
- LocalStorage API
- Fetch/Async-Await

Tested on:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Common Issues

#### Backend won't connect to MongoDB

```bash
# Check MongoDB URI in .env
# Verify MongoDB is running locally or Atlas cluster is accessible
# Try testing connection: mongosh "mongodb+srv://..."
```

#### Frontend can't reach backend

```bash
# Ensure backend is running on http://localhost:3000
# Check VITE_API_URL in .env
# Verify CORS is enabled in backend
```

#### Google OAuth not working

```bash
# Verify GOOGLE_CLIENT_ID in both .env files
# Check OAuth credentials are set to localhost:3000 and localhost:5173
# Ensure both have the same Client ID
```

#### Password reset OTP not received

```bash
# Verify EMAIL_USER and EMAIL_PASSWORD in .env
# Ensure Gmail App Password is used (not regular password)
# Check spam folder for OTP email
```

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- Code follows the existing style
- Components are properly documented
- Tests pass before submitting PR

## Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing issues for similar problems
- Provide detailed error messages and reproduction steps

## Performance Tips

### Frontend Optimization

- Use React DevTools Profiler for component performance
- Implement code splitting for large components
- Use lazy loading for routes and images
- Monitor bundle size with `npm run build`

### Backend Optimization

- Enable database indexing for frequently queried fields
- Implement caching for static data
- Use Redis for session storage
- Monitor API response times

## Deployment

### Deploy to Production

**Frontend (Vercel recommended)**:

```bash
# Build
npm run build

# Deploy (using Vercel CLI)
vercel deploy

# Or deploy dist/ folder to any static hosting
```

**Backend (Heroku, Railway, or similar)**:

```bash
# Set environment variables on hosting platform
# Deploy code
# Monitor logs for errors
```

### Environment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use production MongoDB URI (Atlas cluster)
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS for all connections
- [ ] Set secure CORS origins (not localhost)
- [ ] Update FRONTEND_URL environment variable
- [ ] Test all authentication flows
- [ ] Verify email configuration
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure rate limiting
- [ ] Enable HTTPS/SSL certificates

## Resources

### Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Related Technologies

- [JWT Introduction](https://jwt.io/introduction)
- [RESTful API Principles](https://restfulapi.net)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OAuth 2.0](https://oauth.net/2/)

## Version History

- **v1.0.0** - Initial release with all core features

## Changelog

### [1.0.0] - 2024-05-29

- Initial project launch
- Complete e-commerce functionality
- User authentication system
- Admin dashboard
- Order management
- Notification system
- Customer feedback system

## License

This project is open source and available for free use. You are free to:

- Use commercially
- Modify the code
- Distribute the software
- Use privately

## Acknowledgments

- **DummyJSON API** for providing product data
- **React Community** for amazing libraries and tools
- **Tailwind Labs** for the CSS framework

---

<div align="center">

**If you found this project helpful, please consider giving it a ⭐ on GitHub!**

[⬆ Back to Top](#productHub-e-commerce-store)

</div>

---

## FAQ

**Q: Can I use this for my business?**  
A: Yes! The project is open source and can be used commercially.

**Q: How do I get my own products in the database?**  
A: Modify the API integration to use your own backend or replace DummyJSON with your product API.

**Q: Is the project production-ready?**  
A: The core features are production-ready. Consider adding payment integration and additional testing before going live.

**Q: How do I customize the UI?**  
A: All styles are in `App.css` and use Tailwind CSS classes. Modify `tailwind.config.js` for theme customization.

**Q: Can I remove Google OAuth?**  
A: Yes, simply remove Google OAuth related code from login pages and backend auth routes.

---

**Last Updated**: May 29, 2024  
**Status**: Active Development

## Author

Rafay Ali Saleem

- Email: rafayalisaleem@example.com

**Happy Coding!**
