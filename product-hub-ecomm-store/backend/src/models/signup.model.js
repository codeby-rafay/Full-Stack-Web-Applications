const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email already exists"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: function () {
      // Password only required for non-Google users
      return !this.googleId;
    },
    default: null, // null for Google users
  },
  googleId: {
    type: String,
    default: null, // only set for regular users
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  deletedAccount: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const signupModel = mongoose.model("signup", signupSchema);

module.exports = signupModel;
