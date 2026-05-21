import { useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";
import { MessageCircle, Trash2, Reply, X, Send, Mail } from "lucide-react";
import { useShop } from "../context/ShopContext";
import axiosInstance from "../utils/axiosInstance";
import DeleteConfirmationModal from "../components/ModalComponents/DeleteConfirmationModal";
import UserSearchBar from "../components/SearchbarComponents/UserSearchBar";

function UserFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyModal, setReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    replied: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, authReady } = useShop();

  // Fetch all feedback
  useEffect(() => {
    if (!authReady || !currentUser?.id || currentUser?.role !== "admin") {
      return;
    }

    fetchFeedback();
  }, [authReady, currentUser]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/feedback/all");

      setFeedbacks(response.data.feedback);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to load feedback", {
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

  const handleConfirmDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      await axiosInstance.delete(`/feedback/${feedbackToDelete}`);

      setFeedbacks(feedbacks.filter((f) => f._id !== feedbackToDelete));
      setShowDeleteModal(false);
      setFeedbackToDelete(null);

      toast.success("Feedback deleted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      toast.error("Failed to delete feedback", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    }
  };

  const handleDeleteClick = (feedbackId) => {
    setFeedbackToDelete(feedbackId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setFeedbackToDelete(null);
  };

  const handleMarkAsRead = async (feedbackId) => {
    try {
      // Optimistic UI update: mark locally without full reload (frontend updates immediately, backend updates in background)
      setFeedbacks((prev) =>
        prev.map((f) => (f._id === feedbackId ? { ...f, status: "read" } : f)),
      );

      await axiosInstance.put(`/feedback/${feedbackId}/mark-read`);

      toast.success("Marked as read!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      // If error, fetch fresh data to revert optimistic update
      fetchFeedback();
      toast.error("Failed to mark as read", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty", {
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
      setReplySending(true);
      await axiosInstance.put(`/feedback/${selectedFeedback._id}/reply`, {
        reply: replyText,
      });

      toast.success("Reply sent successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });

      // Update feedbacks list
      fetchFeedback();
      setReplyModal(false);
      setReplyText("");
      setSelectedFeedback(null);
    } catch (error) {
      toast.error("Failed to send reply", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } finally {
      setReplySending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <MessageCircle size={48} className="text-orange-500" />
        </div>
      </div>
    );
  }

  if (!authReady || !currentUser?.id || currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4">
        <div className="text-center">
          <MessageCircle size={48} className="text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Please login as an admin to view feedback.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2 mt-6">
              <Mail className="text-orange-500" size={32} />
              User Feedback & <span className="text-orange-500">Messages</span>
            </h1>
            <p className="text-gray-600 mt-2">
              Manage user feedback and respond to their messages
            </p>
          </div>
          <div className="md:mt-8 flex items-center">
            <UserSearchBar
              onSearch={setSearchQuery}
              placeholder="Search feedback by name, email or message..."
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Messages
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </p>
              </div>
              <MessageCircle className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Unread</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.unread}
                </p>
              </div>
              <Mail className="text-red-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Replied</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.replied}
                </p>
              </div>
              <Reply className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow">
          {(() => {
            const filtered = feedbacks.filter((f) => {
              if (!searchQuery.trim()) return true;
              const q = searchQuery.toLowerCase();
              return (
                (f.userName || "").toLowerCase().includes(q) ||
                (f.userEmail || "").toLowerCase().includes(q) ||
                (f.subject || "").toLowerCase().includes(q) ||
                (f.message || "").toLowerCase().includes(q)
              );
            });

            if (filtered.length === 0) {
              return (
                <div className="p-8 text-center">
                  <MessageCircle
                    size={48}
                    className="mx-auto text-gray-300 mb-4"
                  />
                  <p className="text-gray-500">
                    {searchQuery
                      ? "No matching feedback found"
                      : "No feedback messages yet"}
                  </p>
                </div>
              );
            }

            return (
              <div className="divide-y">
                {filtered.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="p-6 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* User and Status */}
                        <div className="flex items-center gap-3 mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {feedback.userName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {feedback.userEmail}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              feedback.status,
                            )}`}
                          >
                            {getStatusLabel(feedback.status)}
                          </span>
                        </div>

                        {/* Message */}
                        <p className="text-gray-700 mb-4">{feedback.message}</p>

                        {/* Admin Reply if exists */}
                        {feedback.adminReply && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-semibold text-green-800 mb-2">
                              Your Reply:
                            </p>
                            <p className="text-gray-700">
                              {feedback.adminReply.reply}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Sent on{" "}
                              {new Date(
                                feedback.adminReply.repliedAt,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {/* Date */}
                        <p className="text-xs text-gray-500 mt-3">
                          Received on{" "}
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 ml-4">
                        {feedback.status === "unread" && (
                          <button
                            onClick={() => handleMarkAsRead(feedback._id)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 font-semibold transition cursor-pointer text-xs"
                            title="Mark as read"
                          >
                            Mark Read
                          </button>
                        )}
                        {feedback.status !== "replied" && (
                          <button
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setReplyModal(true);
                            }}
                            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-700 transition cursor-pointer"
                            title="Reply"
                          >
                            <Reply size={20} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(feedback._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
        <DeleteConfirmationModal
          showDeleteModal={showDeleteModal}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
          title="Remove Feedback"
          description="Are you sure you want to delete this feedback?"
          buttonLabel="Delete"
        />
      </div>

      {/* Reply Modal */}
      {replyModal && selectedFeedback && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full border-t-4 border-orange-500 animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Reply to {selectedFeedback.userName}
              </h2>
              <button
                onClick={() => {
                  setReplyModal(false);
                  setReplyText("");
                }}
                className="text-gray-500 hover:text-gray-900 cursor-pointer transition hover:bg-gray-200 rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Original Message */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Customer's Message:
                </p>
                <p className="text-gray-700">{selectedFeedback.message}</p>
              </div>

              {/* Reply Text Area */}
              <div>
                <label
                  htmlFor="reply-textarea"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Your Reply *
                </label>
                <textarea
                  id="reply-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows="6"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t justify-end">
              <button
                onClick={() => {
                  setReplyModal(false);
                  setReplyText("");
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReply}
                disabled={replySending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer transition ${
                  replySending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-700"
                }`}
              >
                <Send size={18} />
                {replySending ? "Sending..." : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserFeedback;
