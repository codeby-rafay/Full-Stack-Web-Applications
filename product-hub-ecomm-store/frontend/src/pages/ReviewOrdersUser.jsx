import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../redux/hooks";
import { toast, Slide } from "react-toastify";
import { DeleteOrderToast } from "../utils/toastUtils";
import { ReviewOrdersSkeletonLoader } from "../components/SkeletonLoader";
import {
  Package,
  Calendar,
  DollarSign,
  User,
  Trash2,
  ChevronDown,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import DeleteConfirmationModal from "../components/ModalComponents/DeleteConfirmationModal";

const ReviewOrdersUser = () => {
  const { currentUser, authReady } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [actionType, setActionType] = useState(null); // delete or cancel
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authReady || !currentUser) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/orders/user/${currentUser.id}`,
        );
        setOrders(response.data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error(error.response?.data?.message || "Failed to load orders", {
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

    fetchOrders();
  }, [authReady, currentUser]);

  const getPaymentStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      returned: "bg-red-100 text-red-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || colors.pending;
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setActionType("delete");
    setShowDeleteModal(true);
  };

  const handleCancelOrderClick = (orderId) => {
    setOrderToDelete(orderId);
    setActionType("cancel");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      if (actionType === "delete") {
        await axiosInstance.delete(`/orders/user/${orderToDelete}`);
        setOrders((prev) => prev.filter((o) => o._id !== orderToDelete));
        DeleteOrderToast();
      } else if (actionType === "cancel") {
        const res = await axiosInstance.patch(`/orders/user/${orderToDelete}`, {
          orderStatus: "cancelled",
        });
        const updatedOrder = res.data.order;
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o)),
        );
        toast.success("Order cancelled", {
          transition: Slide,
          pauseOnHover: false,
          draggable: true,
        });
      }

      setShowDeleteModal(false);
      setOrderToDelete(null);
      setActionType(null);
    } catch (error) {
      console.error("Error performing action:", error);
      toast.error(error.response?.data?.message || "Failed to perform action", {
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

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.orderStatus !== "cancelled")
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  const totalDelivered = useMemo(() => {
    return orders.filter((order) => order.orderStatus === "delivered").length;
  }, [orders]);

  if (!authReady || !currentUser) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Please login to see your orders.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <ReviewOrdersSkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              My <span className="text-orange-500">Orders</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Track and manage your purchases
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {orders.length}
                </p>
              </div>
              <Package size={32} className="text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {totalDelivered}
                </p>
              </div>
              <Package size={32} className="text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign size={32} className="text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No orders yet</p>
            <p className="text-gray-500 mt-2">
              Start shopping to create your first order!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedOrderId(
                      expandedOrderId === order._id ? null : order._id,
                    )
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Order ID
                      </p>
                      <p className="text-sm font-mono font-bold text-gray-900 mt-1">
                        {String(order._id || "")
                          .slice(-8)
                          .toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Order Date
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {order.timestamp
                          ? new Date(order.timestamp).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Items
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {order.totalItems}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Total
                      </p>
                      <p className="text-lg font-bold text-orange-600 mt-1">
                        ${order.totalAmount?.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          Status
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mt-1 ${
                            order.orderStatus === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.orderStatus === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.orderStatus === "shipped"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {(order.orderStatus === "pending" ||
                          order.orderStatus === "confirmed") && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrderClick(order._id);
                            }}
                            className="px-3 py-2 bg-yellow-50 text-yellow-700 border cursor-pointer border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <ChevronDown
                          size={20}
                          className={`text-gray-400 transition-transform ${
                            expandedOrderId === order._id ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div
                  className={`border-t border-gray-100 bg-gray-50 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedOrderId === order._id
                      ? "max-h-500 opacity-100 p-6"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <User size={16} className="text-orange-500" />
                        Order Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Customer:</span>{" "}
                          {order.userName}
                        </p>
                        <p className="text-gray-600 break-all">
                          <span className="font-semibold">Email:</span>{" "}
                          {order.userEmail}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Items:</span>{" "}
                          {order.totalItems}
                        </p>
                        {order.paymentMethod && (
                          <p className="text-gray-600">
                            <span className="font-semibold">
                              Payment Status:
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 rounded text-xs font-semibold capitalize ${getPaymentStatusColor(
                                order.paymentStatus,
                              )}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        Shipping Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Date:</span>{" "}
                          {order.timestamp
                            ? formatDate(order.timestamp)
                            : "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Address:</span>{" "}
                          {order.shippingAddress || "N/A"}
                        </p>
                        {order.notes && (
                          <p className="text-gray-600">
                            <span className="font-semibold">Notes:</span>{" "}
                            {order.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <DollarSign size={16} className="text-orange-500" />
                        Amount
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-900 text-2xl font-bold">
                          ${order.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package size={16} className="text-orange-500" />
                      Products ({order.products?.length || 0})
                    </h4>
                    {order.products && order.products.length > 0 ? (
                      <div className="space-y-3">
                        {order.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between items-start gap-4 shadow-sm"
                          >
                            <div className="grid md:grid-cols-2 items-start text-sm flex-1">
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">
                                  Product Name
                                </p>
                                <p className="font-bold text-lg text-gray-900 mt-1">
                                  {product.name || product.title || "Product"}
                                </p>
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <p className="text-xs text-gray-500 font-medium uppercase">
                                    Category
                                  </p>
                                  <p className="text-gray-800 mt-1">
                                    {product.category || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium uppercase">
                                    Price
                                  </p>
                                  <p className="font-semibold text-gray-900 mt-1">
                                    ${product.price?.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 font-medium uppercase">
                                    Qty
                                  </p>
                                  <p className="font-semibold text-gray-900 mt-1">
                                    {product.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500 font-medium uppercase">
                                Subtotal
                              </p>
                              <p className="font-bold text-orange-600 mt-1">
                                $
                                {(product.price * product.quantity)?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-4">
                        No products in this order
                      </p>
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteClick(order._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-700 cursor-pointer text-white rounded-lg font-semibold transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete Order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <DeleteConfirmationModal
          showDeleteModal={showDeleteModal}
          handleCancelDelete={handleCancelDelete}
          handleConfirmDelete={handleConfirmDelete}
          title={actionType === "cancel" ? "Cancel Order" : "Delete Order"}
          description={
            actionType === "cancel"
              ? "Are you sure you want to cancel this order?"
              : "Are you sure you want to delete this order?"
          }
          buttonLabel={
            actionType === "cancel" ? "Cancel Order" : "Delete Order"
          }
        />
      </div>
    </div>
  );
};

export default ReviewOrdersUser;
