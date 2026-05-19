import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { SkeletonLoader } from "./components/SkeletonLoader";
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
        <Suspense fallback={<SkeletonLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:slug" element={<CategoryProducts />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/my-orders" element={<ReviewOrdersUser />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/my-profile" element={<UserProfile />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminPage />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/manage-orders"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <ManageOrdersAdmin />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin/user-feedback"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <UserFeedback />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </Suspense>
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
