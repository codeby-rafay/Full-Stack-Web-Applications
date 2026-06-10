import { useState, useEffect } from "react";
import { Mail, ArrowLeft, Loader, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";
import {
  EnterValidEmailToast,
  FillAllFieldsToast,
  PasswordLengthToast,
  PasswordNotMatchToast,
} from "../utils/toastUtils";
import axiosInstance from "../utils/axiosInstance";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP Verification, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address", {
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
    if (!emailRegex.test(email)) {
      EnterValidEmailToast();
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("/auth/send-otp", { email });

      setStep(2);
      toast.success("OTP sent to your Email. Check spam folder if needed.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP", {
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

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits", {
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

      await axiosInstance.post("/auth/verify-otp", {
        email,
        otp,
      });

      setStep(3);
      toast.success("OTP verified successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      const errorMsg =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      FillAllFieldsToast();
      return;
    }

    if (newPassword.length < 6) {
      PasswordLengthToast();
      return;
    }

    if (newPassword.length < 6) {
      PasswordLengthToast();
      return;
    }

    if (newPassword !== confirmPassword) {
      PasswordNotMatchToast();
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success("Password reset successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      console.error("Error resetting password:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="absolute top-10 left-5 mb-6 flex cursor-pointer hover:-translate-x-2 transition-all hover:underline items-center gap-2 text-orange-500 hover:text-orange-700 text-xl font-bold"
        >
          <ArrowLeft size={24} />
          <span>Back to Login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {step === 1 && (
              <>
                Reset <span className="text-orange-500">Password</span>
              </>
            )}
            {step === 2 && (
              <>
                Verify <span className="text-orange-500">OTP</span>
              </>
            )}
            {step === 3 && (
              <>
                Create New <span className="text-orange-500">Password</span>
              </>
            )}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new password for your account"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          {/* Step 1: Email & Send OTP */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
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
                    value={email}
                    id="email-input"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 cursor-pointer active:scale-95 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <label
                  htmlFor="otp-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp-input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit OTP"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-center tracking-widest"
                  maxLength="6"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Check your email inbox and spam folder
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 cursor-pointer active:scale-95 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-orange-500 hover:text-orange-700 py-2 font-medium cursor-pointer text-sm transition-colors"
              >
                Change Email
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label
                  htmlFor="newPassword-input"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 cursor-pointer active:scale-95 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx <= step ? "bg-orange-500 w-8" : "bg-gray-200 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
