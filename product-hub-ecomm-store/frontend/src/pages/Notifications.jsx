import { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { toast, Slide } from "react-toastify";
import DeleteConfirmationModal from "../components/ModalComponents/DeleteConfirmationModal";
import axiosInstance from "../utils/axiosInstance";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState(null); // 'clearAll' or null
  const [loading, setLoading] = useState(true);
  const {
    currentUser: user,
    authReady,
    unreadNotificationCount,
    setUnreadNotificationCount,
  } = useShop();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const response = await axiosInstance.get(`/notifications/${user.id}`);

      setNotifications(response.data.notifications || []);
      const count = response.data.unreadCount || 0;
      setUnreadNotificationCount(count);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to Load notifications.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (notification) => {
    try {
      if (notification.isRead) return;

      const notificationId = notification._id;
      await axiosInstance.put(`/notifications/${notificationId}/read`);
      // Optimistic UI update: mark locally without full reload (frontend update ui immediately, backend will update on next fetch)
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      setUnreadNotificationCount(Math.max(0, unreadNotificationCount - 1));
      toast.success("Notification marked as read!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark notification as read.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        },
      );
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axiosInstance.put(`/notifications/${user.id}/read-all`);
      // fetchNotifications(); // Refresh notifications (can be done through this way also but we are doing optimistic ui update to avoid extra loading time)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotificationCount(0);
      toast.success("All notifications marked as read!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to mark all notifications as read.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        },
      );
    }
  };

  // Delete single notification
  const deleteNotification = async (notificationId) => {
    try {
      await axiosInstance.delete(`/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      setUnreadNotificationCount((prev) => Math.max(0, prev - 1));
      toast.success("Notification deleted!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete notification.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        },
      );
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axiosInstance.delete(`/notifications/${user.id}/clear-all`);
      setNotifications([]);
      setUnreadNotificationCount(0);
      toast.success("All notifications cleared!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to clear notifications.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        },
      );
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteAction(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteAction === "clearAll") {
      await clearAllNotifications();
    }
    setShowDeleteModal(false);
    setDeleteAction(null);
  };

  // Fetch notifications on component mount
  useEffect(() => {
    if (!authReady || !user?.id) return;

    fetchNotifications();
  }, [authReady, user?.id]);

  const getNotificationStyle = (type) => {
    const styles = {
      order_placed: {
        icon: "🎉",
        bg: "bg-blue-50",
        border: "border-l-4 border-blue-500",
        textColor: "text-blue-700",
      },
      order_confirmed: {
        icon: "✅",
        bg: "bg-green-50",
        border: "border-l-4 border-green-500",
        textColor: "text-green-700",
      },
      order_shipped: {
        icon: "🚚",
        bg: "bg-purple-50",
        border: "border-l-4 border-purple-500",
        textColor: "text-purple-700",
      },
      order_delivered: {
        icon: "📦",
        bg: "bg-emerald-50",
        border: "border-l-4 border-emerald-500",
        textColor: "text-emerald-700",
      },
      order_cancelled: {
        icon: "❌",
        bg: "bg-red-50",
        border: "border-l-4 border-red-500",
        textColor: "text-red-700",
      },
      payment_completed: {
        icon: "💳",
        bg: "bg-yellow-50",
        border: "border-l-4 border-yellow-500",
        textColor: "text-yellow-700",
      },
      payment_failed: {
        icon: "⚠️",
        bg: "bg-red-50",
        border: "border-l-4 border-red-500",
        textColor: "text-red-700",
      },
      feedback_reply: {
        icon: "💬",
        bg: "bg-orange-100",
        border: "border-l-4 border-orange-500",
        textColor: "text-orange-700",
      },
    };

    return styles[type] || styles.order_placed;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Notifi<span className="text-orange-500">cations</span>
            </h1>
            {unreadNotificationCount > 0 && (
              <span className="bg-orange-500 text-white rounded-full px-3 py-1 text-md font-semibold">
                {unreadNotificationCount} New
              </span>
            )}
          </div>
          <p className="text-gray-600">
            Track your order updates and important notifications here
          </p>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 mb-6 justify-end">
            {unreadNotificationCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 cursor-pointer active:scale-95 transition text-sm font-medium"
              >
                Mark All as Read
              </button>
            )}
            <button
              onClick={() => {
                setDeleteAction("clearAll");
                setShowDeleteModal(true);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 cursor-pointer active:scale-95 transition text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📭</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Notifications
              </h2>
              <p className="text-gray-500">
                You're all caught up! Check back later for order updates.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const style = getNotificationStyle(notification.type);

              return (
                <div
                  key={notification._id}
                  className={`${style.bg} ${style.border} p-4 rounded-lg cursor-pointer transition hover:shadow-md ${
                    !notification.isRead ? "shadow-md" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    markAsRead(notification);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${style.textColor}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="bg-orange-500 text-white rounded-full px-3 py-1 text-[10px] font-semibold">
                              New Message
                            </span>
                          )}
                        </div>
                        {notification.type !== "feedback_reply" && (
                          <p className="text-gray-700 mt-1 text-sm">
                            {notification.message}
                          </p>
                        )}

                        {/* Show feedback reply details if available */}
                        {notification.type === "feedback_reply" &&
                          notification.userMessage && (
                            <div className="mt-3 space-y-3 text-sm bg-white bg-opacity-50 p-3 rounded">
                              {/* User's Original Message */}
                              <div className="border-l-4 border-blue-500 pl-3">
                                <p className="font-semibold text-gray-700 mb-1">
                                  Your Message:
                                </p>
                                <p className="text-gray-600 italic">
                                  "{notification.userMessage}"
                                </p>
                              </div>

                              {/* divider */}
                              <div className="relative my-6 overflow-hidden rounded-full h-0.5 bg-gray-200">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-orange-400 to-transparent animate-pulse"></div>
                              </div>

                              {/* Admin's Reply */}
                              {notification.adminReply && (
                                <div className="border-l-4 border-green-500 pl-3">
                                  <p className="font-semibold text-gray-700 mb-1">
                                    Response:
                                  </p>
                                  <p className="text-gray-600 italic">
                                    "{notification.adminReply}"
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                        {/* Show order details if available */}
                        {notification.orderDetails && (
                          <div className="mt-3 text-sm text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                            <p>
                              <strong>Order ID:</strong>{" "}
                              {String(
                                notification.orderDetails.orderNumber || "",
                              )
                                .slice(-8)
                                .toUpperCase()}
                            </p>
                            <p>
                              <strong>Product:</strong>{" "}
                              {notification.orderDetails.productName ||
                                notification.orderDetails.product ||
                                "N/A"}
                            </p>
                            <p>
                              <strong>Amount:</strong> Rs{" "}
                              {notification.orderDetails.totalAmount}
                            </p>
                            <p>
                              <strong>Payment:</strong>{" "}
                              {notification.orderDetails.paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : "Card Payment"}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(
                            notification.createdAt,
                          ).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(notification.createdAt).toLocaleTimeString(
                            "en-US",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="text-gray-600 hover:text-red-500 bg-gray-200 px-2 py-1 rounded-lg cursor-pointer transition-colors font-medium"
                      title="Delete notification"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        {notifications.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Notifications are automatically refreshed
              every 30 seconds. You can also mark notifications as read or
              delete them individually.
            </p>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        title="Clear All Notifications"
        description="Are you sure you want to delete all notifications?"
        buttonLabel="Delete"
      />
    </div>
  );
};

export default Notifications;
