import { useEffect, useState, useMemo } from "react";
import { DeleteOrderToast, FailedToLoadOrdersToast } from "../utils/toastUtils";
import { ManageOrdersSkeletonLoader } from "../components/SkeletonLoader";
import {
  Package,
  User,
  Calendar,
  DollarSign,
  ChevronDown,
  Loader,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { toast, Slide } from "react-toastify";
import { useAuth } from "../redux/hooks";
import axiosInstance from "../utils/axiosInstance";
import OrderSearchBar from "../components/SearchbarComponents/OrderSearchBar";
import DeleteConfirmationModal from "../components/ModalComponents/DeleteConfirmationModal";

const ManageOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const { currentUser, authReady } = useAuth();

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

  useEffect(() => {
    if (!authReady || !currentUser?.id || currentUser?.role !== "admin") {
      return;
    }

    fetchOrders();
  }, [authReady, currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/orders/admin");

      if (response.data?.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      FailedToLoadOrdersToast();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/orders/admin/${orderId}`, {
        orderStatus: newStatus,
      });

      if (response.data?.order) {
        setOrders(
          orders.map((o) => (o._id === orderId ? response.data.order : o)),
        );
        toast.success("Order status updated!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    }
  };

  const handleDeleteClick = (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const handleMarkReturned = async (orderId) => {
    try {
      const response = await axiosInstance.patch(`/orders/admin/${orderId}`, {
        paymentStatus: "returned",
      });

      if (response.data?.order) {
        setOrders(
          orders.map((o) => (o._id === orderId ? response.data.order : o)),
        );
        toast.success("Payment status set to returned", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: true,
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Error marking payment as returned:", error);
      toast.error("Failed to mark payment as returned", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        transition: Slide,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await axiosInstance.delete(`/orders/admin/${orderToDelete}`);

      setOrders(orders.filter((o) => o._id !== orderToDelete));
      setShowDeleteModal(false);
      setOrderToDelete(null);
      DeleteOrderToast();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order", {
        position: "top-right",
        autoClose: 3000,
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

  const toggleOrderExpanded = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === filterStatus);

  // Filter by search query
  const searchFilteredOrders = useMemo(() => {
    if (!searchQuery.trim()) {
      return filteredOrders;
    }

    const query = searchQuery.toLowerCase().trim();

    return filteredOrders.filter((order) => {
      const orderId = order._id.toLowerCase();
      const userName = (order.userName || "").toLowerCase();
      const userEmail = (order.userEmail || "").toLowerCase();
      const status = order.orderStatus.toLowerCase();
      const paymentMethod = (order.paymentMethod || "").toLowerCase();

      return (
        orderId.includes(query) ||
        userName.includes(query) ||
        userEmail.includes(query) ||
        status.includes(query) ||
        paymentMethod.includes(query)
      );
    });
  }, [filteredOrders, searchQuery]);

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      returned: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || colors.pending;
  };

  const totalRevenue = useMemo(() => {
    return filteredOrders
      .filter((order) => order.orderStatus !== "cancelled")
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [filteredOrders]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return <ManageOrdersSkeletonLoader />;
  }

  if (!authReady || !currentUser?.id || currentUser?.role !== "admin") {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle size={48} className="text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Please login as an admin to view orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-linear-to-br from-orange-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Header */}
          <div>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 mt-6"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Customer <span className="text-orange-500">Orders</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and track all customer purchases
            </p>
          </div>
          {/* Search Bar */}
          <div className="mt-12 flex items-center gap-4 flex-wrap md:w-auto">
            <OrderSearchBar
              onSearch={handleSearch}
              placeholder="Search orders by ID, name or email..."
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
                <p className="text-gray-500 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {orders.filter((o) => o.orderStatus === "confirmed").length}
                </p>
              </div>
              <Package size={32} className="text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-500 mt-2">
                  {orders.filter((o) => o.orderStatus === "pending").length}
                </p>
              </div>
              <Package size={32} className="text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-green-500 mt-2">
                  {orders.filter((o) => o.orderStatus === "delivered").length}
                </p>
              </div>
              <Package size={32} className="text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Cancelled</p>
                <p className="text-3xl font-bold text-red-500 mt-2">
                  {orders.filter((o) => o.orderStatus === "cancelled").length}
                </p>
              </div>
              <Package size={32} className="text-red-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Card Payment
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {orders.filter((o) => o.paymentMethod === "card").length}
                </p>
              </div>
              <DollarSign size={32} className="text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">COD</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {orders.filter((o) => o.paymentMethod === "cod").length}
                </p>
              </div>
              <DollarSign size={32} className="text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  ${totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign size={32} className="text-orange-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            "all",
            "confirmed",
            "pending",
            "shipped",
            "delivered",
            "cancelled",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-all capitalize ${
                filterStatus === status
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-orange-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {searchFilteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg font-medium">No orders found</p>
            <p className="text-gray-500 mt-2">
              {filterStatus === "all"
                ? "There are no orders yet."
                : `There are no ${filterStatus} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchFilteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrderExpanded(order._id)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Order ID
                      </p>
                      <p className="text-sm font-mono font-bold text-gray-900 mt-1">
                        {String(order._id).slice(-8).toUpperCase()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Customer
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {order.userName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.userEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Total
                      </p>
                      <p className="text-lg font-bold text-orange-600 mt-1">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">
                        Status
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize mt-1 ${getStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">
                          Date
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          {new Date(order.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform ${
                          expandedOrderId === order._id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Details*/}
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
                        Customer Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Name:</span>{" "}
                          {order.userName}
                        </p>
                        <p className="text-gray-600 break-all">
                          <span className="font-semibold">Email:</span>{" "}
                          {order.userEmail}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">
                            Shipping Address:
                          </span>{" "}
                          {order.shippingAddress}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Items:</span>{" "}
                          {order.totalItems}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Calendar size={16} className="text-orange-500" />
                        Order Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">
                          <span className="font-semibold">Date:</span>{" "}
                          {order.timestamp
                            ? formatDate(order.timestamp)
                            : "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Payment Method:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs font-semibold uppercase ${
                              order.paymentMethod === "card"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {order.paymentMethod === "card"
                              ? "Card Payment"
                              : "Cash on Delivery"}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Payment Status:</span>
                          <span
                            className={`ml-2 px-2 py-1 rounded text-xs font-semibold capitalize ${getPaymentStatusColor(
                              order.paymentStatus,
                            )}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          <span className="font-semibold">Notes:</span>
                          <span className="ml-1 py-1 rounded text-md capitalize">
                            {order.notes}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <DollarSign size={16} className="text-orange-500" />
                        Amount
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-900 text-2xl font-bold">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package size={16} className="text-orange-500" />
                      Products ({order.products.length})
                    </h4>
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
                            <div className="grid grid-cols-4 gap-2">
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
                                  ${product.price.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">
                                  Qty
                                </p>
                                <p className="text-gray-900 mt-1">
                                  {product.quantity}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">
                                  Subtotal
                                </p>
                                <p className="font-bold text-orange-600 mt-1">
                                  $
                                  {(product.price * product.quantity).toFixed(
                                    2,
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Management */}
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-t border-gray-200 pt-6">
                    <div className="flex flex-col gap-2">
                      <div className="font-bold ml-2">Status</div>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.paymentStatus === "completed" &&
                        order.orderStatus === "cancelled" && (
                          <button
                            onClick={() => handleMarkReturned(order._id)}
                            title="Mark as Returned"
                            className="px-4 py-2 bg-green-200 text-green-700 cursor-pointer hover:bg-green-300 border border-green-100 rounded-lg text-sm font-medium transition-colors"
                          >
                            Mark Returned
                          </button>
                        )}

                      <button
                        onClick={() => handleDeleteClick(order._id)}
                        title="Delete Order"
                        className="px-6 py-2 bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Delete Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default ManageOrdersAdmin;
