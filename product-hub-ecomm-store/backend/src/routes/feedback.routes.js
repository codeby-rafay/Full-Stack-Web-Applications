const express = require("express");
const { authAdmin, authUser } = require("../middlewares/auth.middleware");
const {
  submitFeedbackValidationRules,
  replyToFeedbackValidationRules,
} = require("../middlewares/validation.middleware");
const {
  submitFeedback,
  getAllFeedback,
  markFeedbackAsRead,
  replyToFeedback,
  deleteFeedback,
} = require("../controllers/feedback.controller");

const router = express.Router();

// User routes
router.post(
  "/feedback/submit",
  authUser,
  submitFeedbackValidationRules,
  submitFeedback,
);

// Admin routes
router.get("/feedback/all", authAdmin, getAllFeedback);
router.put("/feedback/:feedbackId/mark-read", authAdmin, markFeedbackAsRead);
router.put(
  "/feedback/:feedbackId/reply",
  authAdmin,
  replyToFeedbackValidationRules,
  replyToFeedback,
);
router.delete("/feedback/:feedbackId", authAdmin, deleteFeedback);

module.exports = router;
