const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "signup",
      required: [true, "User ID is required"],
      index: true,
    },
    userEmail: {
      type: String,
      required: [true, "User email is required"],
    },
    userName: {
      type: String,
      required: [true, "Username is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied"],
      default: "unread",
    },
    adminReply: {
      reply: String,
      repliedAt: Date,
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "signup",
      },
    },
  },
  { timestamps: true },
);

const feedbackModel = mongoose.model("feedback", feedbackSchema);

module.exports = feedbackModel;
