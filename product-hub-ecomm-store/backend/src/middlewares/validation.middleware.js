const { body, validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const signupValidationRules = [
  body("fullName")
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ min: 3, max: 30 })
    .withMessage("Full name must be between 3 and 30 characters long"),

  body("email").isEmail().withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validateResult,
];

const loginValidationRules = [
  body("email").isEmail().withMessage("Please enter a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  validateResult,
];

const googleLoginValidationRules = [
  body("token")
    .notEmpty()
    .withMessage("Google token is required")
    .isString()
    .withMessage("Invalid token format"),

  validateResult,
];

const sendOTPValidationRules = [
  body("email").isEmail().withMessage("Please enter a valid email address"),

  validateResult,
];

const verifyOTPValidationRules = [
  body("email").isEmail().withMessage("Please enter a valid email address"),

  body("otp")
    .isLength({ min: 4, max: 6 })
    .withMessage("OTP must be 4–6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),

  validateResult,
];

const resetPasswordValidationRules = [
  body("email").isEmail().withMessage("Please enter a valid email address"),

  body("otp")
    .isLength({ min: 4, max: 6 })
    .isNumeric()
    .withMessage("Invalid OTP"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validateResult,
];

const submitFeedbackValidationRules = [
  body("userName")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 4, max: 30 })
    .withMessage("Name must be between 4 and 30 characters"),

  body("userEmail")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("message")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 4, max: 1000 })
    .withMessage("Message must be between 4 and 1000 characters"),

  validateResult,
];

const replyToFeedbackValidationRules = [
  body("reply")
    .isString()
    .withMessage("Reply must be a string")
    .isLength({ min: 4, max: 1000 })
    .withMessage("Reply must be between 4 and 1000 characters"),

  validateResult,
];

const updateProfileValidationRules = [
  body("fullName")
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ min: 3, max: 30 })
    .withMessage("Full name must be between 3 and 30 characters long"),
  body("phone")
    .optional()
    .isString()
    .withMessage("Phone number must be a string")
    .matches(/^(?:\+92\d{10}|0\d{10})$/)
    .withMessage(
      "Phone number must be either +92 followed by 10 digits or 0 followed by 10 digits",
    ),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be either male, female, or other"),

  validateResult,
];

module.exports = {
  signupValidationRules,
  loginValidationRules,
  googleLoginValidationRules,
  sendOTPValidationRules,
  verifyOTPValidationRules,
  resetPasswordValidationRules,
  submitFeedbackValidationRules,
  replyToFeedbackValidationRules,
  updateProfileValidationRules,
};
