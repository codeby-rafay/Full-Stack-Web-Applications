const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "signup",
    required: [true, "User ID is required"],
  },
  userEmail: {
    type: String,
    required: [true, "User email is required"],
  },
  userName: {
    type: String,
    required: [true, "Username is required"],
  },
  products: [
    {
      id: {
        type: String,
        required: [true, "Product ID is required"],
      },
      name: {
        type: String,
        required: [true, "Product name is required"],
      },
      price: {
        type: Number,
        required: [true, "Product price is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
      },
      category: {
        type: String,
        required: [true, "Product category is required"],
      },
      description: {
        type: String,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
  },
  totalItems: {
    type: Number,
    required: [true, "Total items is required"],
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "returned", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cod"],
    default: "cod",
    required: [true, "Payment method is required"],
  },
  shippingAddress: {
    type: String,
  },
  notes: {
    type: String,
  },
  hiddenForUser: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;
