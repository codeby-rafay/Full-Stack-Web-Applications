// Debug script to check admin user in database
require("dotenv").config();
const mongoose = require("mongoose");
const signupModel = require("../src/models/signup.model");

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find admin user
    const admin = await signupModel.findOne({ email: "admin@example.com" });

    if (!admin) {
      process.exit(0);
    }

    if (!admin.role || admin.role !== "admin") {

      admin.role = "admin";
      await admin.save();
    } else {
      console.log(" Admin role is correctly set to 'admin'");
    }

    process.exit(0);
  } catch (error) {
    console.error(" Error:", error.message);
    process.exit(1);
  }
};

checkAdmin();
