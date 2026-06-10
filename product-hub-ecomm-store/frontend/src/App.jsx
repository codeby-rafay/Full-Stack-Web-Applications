import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import {
  HomeSkeletonLoader,
  ProductsSkeletonLoader,
  SingleProductSkeletonLoader,
  CategoriesSkeletonLoader,
  CategoryProductsSkeletonLoader,
  NotificationsSkeletonLoader,
  SavedSkeletonLoader,
  ReviewOrdersSkeletonLoader,
  UserProfileSkeletonLoader,
  AdminPageSkeletonLoader,
  ManageOrdersSkeletonLoader,
  UserFeedbackSkeletonLoader,
  AboutSkeletonLoader,
  ContactSkeletonLoader,
  LoginSkeletonLoader,
  SignupSkeletonLoader,
  SkeletonLoader,
} from "./components/SkeletonLoader";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDisplay from "./components/CartDisplay";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const AdminLayout = lazy(() => import("./components/AdminLayout"));
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const Categories = lazy(() => import("./pages/Categories"));
const CategoryProducts = lazy(() => import("./pages/Categoryproducts"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Saved = lazy(() => import("./pages/Saved"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const ManageOrdersAdmin = lazy(() => import("./pages/ManageOrdersAdmin"));
const NotFound404 = lazy(() => import("./pages/NotFound404"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Notifications = lazy(() => import("./pages/Notifications"));
const ReviewOrdersUser = lazy(() => import("./pages/ReviewOrdersUser"));
const UserFeedback = lazy(() => import("./pages/UserFeedback"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isResetPasswordRoute = location.pathname === "/reset-password";
  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf8]">
      {!isAdminRoute && !isResetPasswordRoute && <Navbar />}
      <main className="grow min-h-[80vh]">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<HomeSkeletonLoader />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/products"
            element={
              <Suspense fallback={<ProductsSkeletonLoader />}>
                <Products />
              </Suspense>
            }
          />
          <Route
            path="/products/:id"
            element={
              <Suspense fallback={<SingleProductSkeletonLoader />}>
                <SingleProduct />
              </Suspense>
            }
          />
          <Route
            path="/categories"
            element={
              <Suspense fallback={<CategoriesSkeletonLoader />}>
                <Categories />
              </Suspense>
            }
          />
          <Route
            path="/category/:slug"
            element={
              <Suspense fallback={<CategoryProductsSkeletonLoader />}>
                <CategoryProducts />
              </Suspense>
            }
          />
          <Route
            path="/about"
            element={
              <Suspense fallback={<AboutSkeletonLoader />}>
                <About />
              </Suspense>
            }
          />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<ContactSkeletonLoader />}>
                <Contact />
              </Suspense>
            }
          />
          <Route
            path="/saved"
            element={
              <Suspense fallback={<SavedSkeletonLoader />}>
                <Saved />
              </Suspense>
            }
          />
          <Route
            path="/notifications"
            element={
              <Suspense fallback={<NotificationsSkeletonLoader />}>
                <Notifications />
              </Suspense>
            }
          />
          <Route
            path="/my-orders"
            element={
              <Suspense fallback={<ReviewOrdersSkeletonLoader />}>
                <ReviewOrdersUser />
              </Suspense>
            }
          />
          <Route
            path="/my-profile"
            element={
              <Suspense fallback={<UserProfileSkeletonLoader />}>
                <UserProfile />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<LoginSkeletonLoader />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<SignupSkeletonLoader />}>
                <Signup />
              </Suspense>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <Suspense fallback={<AdminPageSkeletonLoader />}>
                  <AdminLayout>
                    <AdminPage />
                  </AdminLayout>
                </Suspense>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/manage-orders"
            element={
              <ProtectedAdminRoute>
                <Suspense fallback={<ManageOrdersSkeletonLoader />}>
                  <AdminLayout>
                    <ManageOrdersAdmin />
                  </AdminLayout>
                </Suspense>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/user-feedback"
            element={
              <ProtectedAdminRoute>
                <Suspense fallback={<UserFeedbackSkeletonLoader />}>
                  <AdminLayout>
                    <UserFeedback />
                  </AdminLayout>
                </Suspense>
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <NotFound404 />
              </Suspense>
            }
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && !isResetPasswordRoute && !isAuthRoute && (
        <CartDisplay />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
