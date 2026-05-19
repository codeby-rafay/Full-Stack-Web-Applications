# ProductHub E-Commerce Store

A modern, full-stack e-commerce application built with React and Vite frontend, and Node.js/Express backend. Browse, search, explore products across categories, and enjoy a personalized shopping experience with user authentication and user-specific cart and saved items.

## Features

- **User Authentication**: Secure login with JWT tokens + password hashing (signup creates the account; login issues the JWT)
- **Role-Based Access Control**: Admin and user roles with protected admin routes
- **Admin Dashboard**: Comprehensive admin panel for managing users and viewing activity
- **User-Specific Storage**: Each user's cart and saved items are isolated and persist across sessions
- **Product Listing**: Display all available products with detailed information
- **Product Search**: Search for products in real-time
- **Category Filtering**: Filter products by categories
- **Product Details**: View detailed information for individual products with auto-scroll to top
- **Shopping Cart**: Add products to cart, adjust quantities, and remove items (user-specific)
- **Save Items**: Bookmark favorite products for later viewing (user-specific)
- **Persistent Storage**: User data stored with user ID isolation for privacy and security
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Fast Performance**: Built with Vite for optimal development and production performance
- **Modern UI**: Clean and intuitive user interface with icons from Lucide React
- **Animated Modals**: Beautiful confirmation dialogs using Framer Motion for delete actions
- **Toast Notifications**: Real-time feedback with React Toastify for all user actions
- **Google Authentication**: Quick login and registration with Google OAuth
- **Password Reset**: Secure OTP-based password recovery via email
- **Navigation**: Easy navigation between pages (Home, Products, Categories, About, Contact, Saved, Login, Signup, Notifications, My Orders, Admin Dashboard)
- **Notifications System**: Real-time notifications for orders, payments, and customer feedback replies
- **Order Management**: Users can view, track, and manage their personal orders
- **Customer Feedback**: Customers can submit feedback and receive replies from admins
- **Admin Order Management**: Admins can view and manage all customer orders

## Tech Stack

**Frontend:**

- **Frontend Framework**: React 19.2.4
- **Build Tool**: Vite 8.0.1
- **Styling**: Tailwind CSS 4.2.2 with Vite integration
- **HTTP Client**: Axios 1.13.6
- **Routing**: React Router DOM 7.13.2
- **Icons**: Lucide React 1.3.0
- **Notifications**: React Toastify
- **State Management**: React Context API
- **Local Storage**: Browser localStorage for persistent data (user-specific keys)
- **Code Quality**: ESLint with React plugins

**Backend:**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs for password hashing
- **CORS**: Enabled for frontend communication
- **Role-Based Access**: User roles (admin/user) for authorization
- **Admin Features**: Login/signup history tracking and order management

## State Management

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

- `cart_userId` - User's shopping cart
- `savedItems_userId` - User's saved items

This ensures **complete data isolation** - when a user logs in, they see only their items; when they log out, their items remain saved and are automatically loaded when they log back in.

Data is persisted to localStorage automatically whenever cart or saved items change.

## Features Usage

### Authentication

- **Sign Up**: Create a new account with your full name, email, and password
- **Login**: Sign in with your email and password to access your personalized account
- **Secure**: Passwords are hashed using bcryptjs; login (email/password or Google) issues JWT tokens
- **User Session**: Stay logged in across browser sessions; logout removes your session
- **User-Specific Data**: Each user's cart and saved items are completely isolated

### Shopping Cart

- Click the floating shopping cart button (bottom-left) to open the cart drawer
- View all items in your cart with quantities and prices (user-specific)
- Use +/- buttons to adjust item quantities
- Click the X button to remove items from cart
- The cart badge shows total number of items
- Cart total is calculated automatically
- Cart persists across sessions for logged-in users

### Saved Items

- Click the heart icon on any product card to save it
- Saved items appear in the navbar (shows count)
- View all saved items on the dedicated Saved page
- Saved items persist across sessions for logged-in users
- Your saved items are only visible to you

### Admin Dashboard

- **Admin Access**: Only users with admin role can access the admin dashboard
- **Protected Routes**: Admin dashboard is protected with role-based access control
- **Login History**: View all user login records with timestamps and email addresses
- **Signup Management**: Track all user registrations with creation dates and account information
- **User Management**: View and manage registered users and their information
- **Admin Navigation**: Dedicated admin interface separate from the main user interface
- **Secure Access**: JWT tokens verify admin authorization before granting access

## Project Structure

```
product-hub-ecomm-store/
├── frontend/                       # React frontend application
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx                 # Navigation bar component
│       │   ├── Footer.jsx                 # Footer component
│       │   ├── CartDisplay.jsx            # Shopping cart drawer component
│       │   ├── ProductCard.jsx            # Reusable product card component
│       │   ├── SearchBar.jsx              # Search functionality
│       │   ├── LoadingError.jsx           # Loading and error states
│       │   ├── ProtectedAdminRoute.jsx    # Admin route protection component
│       │   ├── DeleteConfirmationModal.jsx # Reusable delete confirmation modal with animations
│       │   ├── NavbarComponents/          # Navbar sub-components
│       │   ├── CartPanelComponents/       # Cart panel UI components
│       │   ├── HomePageComponents/        # Home page specific components
│       │   ├── ProductsPageComponents/    # Products page specific components
│       │   ├── CategoriesCardComponents/  # Category card components
│       │   └── SingleProductPageComponents/ # Single product detail components
│       ├── context/
│       │   └── ShopContext.jsx            # Global state management (auth + cart + saved items + role)
│       ├── pages/
│       │   ├── Home.jsx                   # Home page
│       │   ├── Products.jsx               # All products page
│       │   ├── SingleProduct.jsx          # Individual product details
│       │   ├── Categories.jsx             # Categories listing page
│       │   ├── CategoryProducts.jsx       # Products by category
│       │   ├── Login.jsx                  # Login page
│       │   ├── Signup.jsx                 # Signup page
       │   ├── ResetPassword.jsx          # Password reset page
       │   ├── AdminPage.jsx              # Admin dashboard page
       │   ├── ManageOrdersAdmin.jsx      # Admin order management page
       │   ├── UserFeedback.jsx           # Admin user feedback page
       │   ├── Notifications.jsx          # User notifications page
       │   ├── ReviewOrdersUser.jsx       # User orders review page
       │   ├── About.jsx                  # About page
       │   ├── Contact.jsx                # Contact page
       │   ├── Saved.jsx                  # Saved items page
       │   └── NotFound404.jsx            # 404 page
│       ├── api/
│       │   └── API integration modules
│       ├── App.jsx                        # Main app component with routing
│       ├── main.jsx                       # Application entry point
│       ├── App.css                        # App styles
│       └── index.css                      # Global styles
│
└── backend/                        # Express.js API + authentication server
    ├── server.js                   # Main server file
    ├── package.json                # Backend dependencies
    ├── src/
    │   ├── app.js                  # Express app with signup/login routes
    │   ├── db/                     # Database configuration
    │   └── models/
    │       ├── signup.model.js     # User schema with role field
    │       ├── login.model.js      # Login history schema
    │       └── order.model.js      # Order schema for e-commerce orders
```

## API Integration

This application uses the [DummyJSON API](https://dummyjson.com) for data:

- **Get All Products**: Fetches up to 30 products with customizable limits
- **Get Single Product**: Retrieves detailed information for a specific product
- **Search Products**: Searches products by query string
- **Get Categories**: Fetches all available product categories
- **Get Products by Category**: Filters products by selected category

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

This application works on all modern browsers that support ES6+.

## Future Enhancements

- Advanced product filters and sorting options
- Product reviews and ratings submission
- Checkout and payment integration (Stripe/PayPal)
- Order history and tracking
- Product recommendations based on browsing history
- Dark mode support
- Multi-language support
- User profile management and editing
- Wishlist sharing with other users
- Product comparison feature
- Enhanced admin dashboard with analytics and reports
- Inventory management for products
- Discount and coupon management system

## License

This project is free to use and modify.

## Author

Rafay Ali Saleem.

**Happy Coding!**
