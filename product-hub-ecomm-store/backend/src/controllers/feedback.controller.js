const feedbackModel = require("../models/feedback.model");
const notificationModel = require("../models/notification.model");
const { sendFeedbackEmail } = require("../services/feedbackEmail.service");
const { sendFeedbackReplyEmail } = require("../services/feedbackReplyEmail.service");

// POST - Submit contact us form
async function submitFeedback(req, res) {
  try {
    const { userId, userEmail, userName, subject, message } = req.body;

    if (!userId || !userEmail || !userName || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await feedbackModel.create({
      userId,
      userEmail,
      userName,
      subject,
      message,
      status: "unread",
    });

    // Send thank you email to user
    await sendFeedbackEmail(userEmail, userName, message);

    res.status(201).json({
      message: "Feedback submitted successfully!",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
}

// GET - Get all feedback (admin only)
async function getAllFeedback(req, res) {
  try {
    const feedback = await feedbackModel
      .find()
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("adminReply.repliedBy", "fullName email");

    const unreadCount = await feedbackModel.countDocuments({
      status: "unread",
    });

    const repliedCount = await feedbackModel.countDocuments({
      status: "replied",
    });

    res.status(200).json({
      message: "Feedback fetched successfully",
      feedback,
      stats: {
        total: feedback.length,
        unread: unreadCount,
        replied: repliedCount,
      },
    });
  } catch (error) {
    console.error("Error loading feedbacks:", error);
    res.status(500).json({ message: "Error loading feedbacks" });
  }
}

// PUT - Mark feedback as read (admin only)
async function markFeedbackAsRead(req, res) {
  try {
    const { feedbackId } = req.params;

    const feedback = await feedbackModel.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.status === "unread") {
      feedback.status = "read";
      await feedback.save();
    }

    res.status(200).json({
      message: "Feedback marked as read",
      feedback,
    });
  } catch (error) {
    console.error("Error marking feedback as read:", error);
    res.status(500).json({ message: "Error marking feedback as read" });
  }
}

// PUT - Reply to feedback (admin only)
async function replyToFeedback(req, res) {
  try {
    const { feedbackId } = req.params;
    const { reply } = req.body;
    const adminId = req.user.id;

    if (!reply) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const feedback = await feedbackModel.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Update feedback with admin reply
    feedback.adminReply = {
      reply,
      repliedAt: new Date(),
      repliedBy: adminId,
    };
    feedback.status = "replied";

    await feedback.save();

    // Send reply email to user
    await sendFeedbackReplyEmail(
      feedback.userEmail,
      feedback.userName,
      feedback.message,
      reply,
    );

    // Create notification for user
    try {
      await notificationModel.create({
        userId: feedback.userId,
        type: "feedback_reply",
        title: "Response to Your Feedback",
        message: `Reply to your message: "${feedback.adminReply.reply}"`,
        feedbackId: feedbackId,
        userMessage: feedback.message,
        adminReply: feedback.adminReply.reply,
        isRead: false,
      });
    } catch (notifError) {
      console.error(
        "Error creating notification for feedback reply:",
        notifError,
      );
      res
        .status(500)
        .json({ message: "Error creating notification for feedback reply" });
    }

    res.status(200).json({
      message: "Reply sent successfully!",
      feedback,
    });
  } catch (error) {
    console.error("Error replying to feedback:", error);
    res.status(500).json({ message: "Error replying to feedback" });
  }
}

// DELETE - Delete feedback (admin only)
async function deleteFeedback(req, res) {
  try {
    const { feedbackId } = req.params;

    const feedback = await feedbackModel.findByIdAndDelete(feedbackId);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Error deleting feedback" });
  }
}

module.exports = {
  submitFeedback,
  getAllFeedback,
  markFeedbackAsRead,
  replyToFeedback,
  deleteFeedback,
};
