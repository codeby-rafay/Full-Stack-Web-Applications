import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { toast, Slide } from "react-toastify";
import { useShop } from "../context/ShopContext";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import axiosInstance from "../utils/axiosInstance";
import {
  FillAllFieldsToast,
  EnterValidEmailToast,
  Welcometoast,
  PasswordLengthToast,
  PasswordNotMatchToast,
} from "../utils/toastUtils";

function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useShop();

  // Define Google response handler with useCallback
  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        const token = response.credential;

        // send token to backend using axios
        const res = await axiosInstance.post("/auth/google-login", {
          token,
        });

        const data = res.data;

        if (!data?.user || !data?.token) {
          throw new Error("Invalid server response");
        }

        // Save user info using our login function from context
        login(data.user, data.token);

        Welcometoast(data.user);

        // Navigate to home
        setTimeout(() => {
          window.scrollTo(0, 0);
          navigate("/");
        }, 100);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            error.message ||
            "Google login failed",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            transition: Slide,
          },
        );
      }
    },
    [login, navigate, Welcometoast],
  );

  // Initialize Google Sign-In globally (only once)
  useGoogleSignIn(handleGoogleResponse, "googleBtn");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      FillAllFieldsToast();
      return;
    }

    if (formData.fullName.trim().length < 3) {
      toast.error("Please enter a valid Full Name", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      EnterValidEmailToast();
      return;
    }

    if (formData.password.length < 6) {
      PasswordLengthToast();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      PasswordNotMatchToast();
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Please accept the terms and conditions", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/auth/signup", {
        fullName: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
      });

      // signup successful
      toast.success("Account created successfully! Please login.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });

      // Go to login page
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          error.message ||
          "Signup failed. Please try again.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Create <span className="text-orange-500">Account</span>
          </h1>
          <p className="text-gray-500">
            Join us to start shopping amazing products
          </p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  id="fullName-input"
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  id="email-input"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password-input"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                At least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 border border-gray-300 rounded-lg mt-0.5"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="#"
                  className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="text-orange-500 hover:text-orange-600 font-semibold"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 active:scale-95 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Google Button */}
          <div className="space-y-3">
            <div id="googleBtn" className="w-full flex justify-center"></div>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
