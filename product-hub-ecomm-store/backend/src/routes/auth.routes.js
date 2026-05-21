const express = require("express");
const {
  googleLogin,
  signup,
  getSignups,
  deleteSignup,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  deleteAccount,
  sendOTP,
  verifyOTP,
  resetPassword,
  logout,
  logoutAll,
  checkAuth,
} = require("../controllers/auth.controller");
const {
  signupValidationRules,
  loginValidationRules,
  googleLoginValidationRules,
  sendOTPValidationRules,
  verifyOTPValidationRules,
  resetPasswordValidationRules,
  updateProfileValidationRules,
} = require("../middlewares/validation.middleware");
const {
  authUser,
  authAdmin,
  authAny,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/auth/google-login", googleLoginValidationRules, googleLogin);
router.post("/auth/signup", signupValidationRules, signup);
router.get("/auth/signup", authAdmin, getSignups);
router.delete("/auth/signup/:id", authAdmin, deleteSignup);
router.post("/auth/login", loginValidationRules, login);

router.get("/auth/profile", authAny, getProfile);
router.put(
  "/auth/profile",
  authAny,
  updateProfileValidationRules,
  updateProfile,
);
router.delete("/auth/delete-account", authAny, deleteAccount);

router.post("/auth/send-otp", sendOTPValidationRules, sendOTP);
router.post("/auth/verify-otp", verifyOTPValidationRules, verifyOTP);
router.post(
  "/auth/reset-password",
  resetPasswordValidationRules,
  resetPassword,
);

router.post("/auth/logout", authAny, logout);
router.post("/auth/logout-all", authAny, logoutAll);

router.get("/auth/check-auth", authAny, checkAuth);

router.post("/auth/refresh", refreshToken);

module.exports = router;
