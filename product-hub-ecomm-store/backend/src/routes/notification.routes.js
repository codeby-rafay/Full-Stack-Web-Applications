const express = require("express");
const {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notification.controller");
const { authUser } = require("../middlewares/auth.middleware");

const router = express.Router();

// Fetch all notifications for a user
router.get("/notifications/:userId", authUser, getUserNotifications);

// PUT - Mark a notification as read
router.put(
  "/notifications/:notificationId/read",
  authUser,
  markNotificationAsRead,
);

// PUT - Mark all notifications as read
router.put(
  "/notifications/:userId/read-all",
  authUser,
  markAllNotificationsAsRead,
);

// Delete a single notification Api
router.delete("/notifications/:notificationId", authUser, deleteNotification);

// Clear all Api
router.delete(
  "/notifications/:userId/clear-all",
  authUser,
  clearAllNotifications,
);

module.exports = router;
