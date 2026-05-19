const orderModel = require("../models/order.model");
const jwt = require("jsonwebtoken");
const { createNotification } = require("./notification.controller");
const {
  sendEmail,
  orderPlacedEmail,
  orderStatusUpdateEmail,
} = require("../services/orderEmail.service");

// route 3: ORDERS
// (POST API)
async function createOrder(req, res) {
  try {
    const {
      userId,
      userEmail,
      userName,
      products,
      totalAmount,
      totalItems,
      shippingAddress,
      notes,
      paymentMethod,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }
    if (!userName) {
      return res.status(400).json({ message: "Username is required" });
    }
    if (!products) {
      return res.status(400).json({ message: "Products array is required" });
    }
    if (!totalAmount && totalAmount !== 0) {
      return res.status(400).json({ message: "Total amount is required" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Products must be an array" });
    }

    if (products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products array cannot be empty" });
    }

    let paymentStatus = "pending";

    if (paymentMethod === "card") {
      paymentStatus = "completed";
    } else {
      paymentStatus = "pending";
    }

    const newOrder = {
      userId,
      userEmail,
      userName,
      products,
      totalAmount,
      totalItems: totalItems || products.length,
      shippingAddress: shippingAddress || "",
      notes: notes || "",
      paymentMethod: paymentMethod || "cod",
      orderStatus: "pending",
      paymentStatus: paymentStatus,
    };

    const order = await orderModel.create(newOrder);

    // Extract product names from products array
    const productNames = products.map((p) => p.name).join(", ");

    // Create notification for order placed
    await createNotification(
      userId,
      order._id,
      "order_placed",
      "Order Placed Successfully! 🎉",
      `Your order No.${String(order._id).slice(-8).toUpperCase()} has been placed. Total: Rs ${totalAmount}. Track your order status here.`,
      {
        orderNumber: order._id,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        orderStatus: order.orderStatus,
        productName: productNames,
      },
    );

    // Send order placed email
    const emailHtml = orderPlacedEmail(userName, userEmail, order);
    await sendEmail(
      userEmail,
      "Order Confirmation - Your Order Has Been Placed",
      emailHtml,
    );

    res.status(201).json({
      message: "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      message: "Error placing order",
    });
  }
}

// GET API - Fetch all orders (for admin dashboard)
async function getAllOrdersAdmin(req, res) {
  try {
    const orders = await orderModel
      .find()
      .sort({ timestamp: -1 })
      .populate("userId", "fullName email");

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.error("Error loading orders:", error);
    res.status(500).json({ message: "Error loading orders" });
  }
}

// GET API - Fetch user's orders
async function getUserOrders(req, res) {
  try {
    const { userId } = req.params;
    const orders = await orderModel
      .find({ userId, hiddenForUser: { $ne: true } })
      .sort({ timestamp: -1 });

    res.status(200).json({
      message: "User orders fetched successfully",
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.error("Error loading user orders:", error);
    res.status(500).json({ message: "Error loading user orders" });
  }
}

// UPDATE API - Update order status
async function updateOrderStatusAdmin(req, res) {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus, notes, shippingAddress } = req.body;

    // Get the original order to track status changes
    const originalOrder = await orderModel.findById(orderId);
    if (!originalOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    let updateData = {
      ...(orderStatus !== undefined && { orderStatus }),
      ...(paymentStatus !== undefined && { paymentStatus }),
      ...(notes !== undefined && { notes }),
      ...(shippingAddress !== undefined && { shippingAddress }),
    };

    if (orderStatus === "delivered") {
      updateData.paymentStatus = "completed";
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId },
      updateData,
      { returnDocument: "after" },
    );

    // Send notification and email if order status changed
    if (orderStatus && orderStatus !== originalOrder.orderStatus) {
      const statusTitles = {
        confirmed: "Order Confirmed! ✅",
        shipped: "Order Shipped! 🚚",
        delivered: "Order Delivered! 📦",
        cancelled: "Order Cancelled ❌",
      };

      const statusMessages = {
        confirmed: "Your order has been confirmed by our team.",
        shipped: "Your order is on the way to you.",
        delivered: "Your order has been delivered successfully.",
        cancelled: "Your order has been cancelled.",
      };

      const productNames = originalOrder.products.map((p) => p.name).join(", ");

      // Create notification for user
      await createNotification(
        originalOrder.userId,
        orderId,
        `order_${orderStatus}`,
        statusTitles[orderStatus] || `Order Status Updated`,
        statusMessages[orderStatus] ||
          `Your order status has been updated to ${orderStatus}`,
        {
          orderNumber: orderId,
          totalAmount: originalOrder.totalAmount,
          paymentMethod: originalOrder.paymentMethod,
          orderStatus: orderStatus,
          previousStatus: originalOrder.orderStatus,
          productName: productNames,
        },
      );

      // Send email to user
      const emailHtml = orderStatusUpdateEmail(
        originalOrder.userName,
        originalOrder.userEmail,
        originalOrder,
        orderStatus,
        originalOrder.orderStatus,
      );

      const emailSubjects = {
        confirmed: "Order Confirmed - Your Order Is Confirmed",
        shipped: "Order Shipped - Your Order Is On The Way",
        delivered: "Order Delivered - Your Order Has Arrived",
        cancelled: "Order Cancelled - Cancellation Confirmation",
      };

      await sendEmail(
        originalOrder.userEmail,
        emailSubjects[orderStatus] || "Order Status Update",
        emailHtml,
      );
    }
    res.status(200).json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
}

// DELETE API - Delete order
async function deleteOrderAdmin(req, res) {
  try {
    const { orderId } = req.params;
    const deletedOrder = await orderModel.findOneAndDelete({ _id: orderId });

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
}

// DELETE API - Hide order from user side only (keeps database and admin view intact)
async function deleteUserOrder(req, res) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await orderModel.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the logged-in user owns this order
    if (order.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this order" });
    }

    await orderModel.findOneAndUpdate(
      { _id: orderId },
      { hiddenForUser: true },
      { returnDocument: "after" },
    );

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
}

// PATCH API - User can update their own order status (cancel only)
async function updateOrderStatusUser(req, res) {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Only allow cancelling from user side
    if (!orderStatus || orderStatus !== "cancelled") {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await orderModel.findOne({ _id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You don't have permission to update this order" });
    }

    if (
      !(order.orderStatus === "pending" || order.orderStatus === "confirmed")
    ) {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled at this stage" });
    }

    // notification and email logic
    const previousStatus = order.orderStatus;
    order.orderStatus = "cancelled";
    // Optionally set payment status
    order.paymentStatus =
      order.paymentStatus === "completed" ? order.paymentStatus : "failed";

    const updated = await order.save();

    const productNames = order.products.map((p) => p.name).join(", ");

    // Create cancellation notification
    await createNotification(
      userId,
      orderId,
      "order_cancelled",
      "Order Cancelled ❌",
      "Your order has been cancelled successfully. Check your email for refund details.",
      {
        orderNumber: orderId,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        orderStatus: "cancelled",
        previousStatus: previousStatus,
        productName: productNames,
      },
    );

    // Send cancellation email
    const emailHtml = orderStatusUpdateEmail(
      order.userName,
      order.userEmail,
      order,
      "cancelled",
      previousStatus,
    );

    await sendEmail(
      order.userEmail,
      "Order Cancelled - Cancellation Confirmation",
      emailHtml,
    );

    res.status(200).json({ message: "Order cancelled", order: updated });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
}

module.exports = {
  createOrder,
  getAllOrdersAdmin,
  getUserOrders,
  updateOrderStatusAdmin,
  deleteOrderAdmin,
  deleteUserOrder,
  updateOrderStatusUser,
};
