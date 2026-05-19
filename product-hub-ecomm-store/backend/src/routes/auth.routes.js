const express = require("express");
const {
  googleLogin,
  signup,
  getSignups,
  deleteSignup,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  sendOTP,
  verifyOTP,
  resetPassword,
  logout,
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
const { authUser, authAdmin, authAny } = require("../middlewares/auth.middleware");

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
router.delete("/auth/delete-account", authUser, deleteAccount);

router.post("/auth/send-otp", authUser, sendOTPValidationRules, sendOTP);
router.post("/auth/verify-otp", authUser, verifyOTPValidationRules, verifyOTP);
router.post(
  "/auth/reset-password",
  authUser,
  resetPasswordValidationRules,
  resetPassword,
);
router.post("/auth/logout", authAny, logout);
router.get("/auth/check-auth", authAny, checkAuth);

module.exports = router;
