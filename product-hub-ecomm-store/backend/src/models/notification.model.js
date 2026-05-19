const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signup",
    required: [true, "User ID is required"],
    index: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
  },
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "feedback",
  },
  type: {
    type: String,
    enum: [
      "order_placed",
      "order_confirmed",
      "order_shipped",
      "order_delivered",
      "order_cancelled",
      "payment_completed",
      "payment_failed",
      "feedback_reply",
    ],
    required: [true, "Notification type is required"],
  },
  title: {
    type: String,
    required: [true, "Notification title is required"],
  },
  message: {
    type: String,
    required: [true, "Notification message is required"],
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread",
  },
  orderDetails: {
    orderNumber: String,
    totalAmount: Number,
    paymentMethod: String,
    orderStatus: String,
    productName: String,
    previousStatus: String,
  },
  userMessage: {
    type: String,
  },
  adminReply: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  hiddenForUser: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

const notificationModel = mongoose.model("notification", notificationSchema);

module.exports = notificationModel;
