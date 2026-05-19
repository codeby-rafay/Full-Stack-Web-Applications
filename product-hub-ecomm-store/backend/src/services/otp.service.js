require("dotenv").config();
const nodemailer = require("nodemailer");

// store OTPs temporarily in server memory
const otpStore = new Map();

// generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// send OTP via email to user
const sendOTPEmail = async (email, otp) => {
  try {
    // configure email service
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP - ProductHub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ff9500 0%, #ffb84d 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">ProductHub</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
              You requested a password reset for your ProductHub account. 
              Use the OTP below to verify your identity and reset your password.
            </p>
            <div style="background: white; border: 2px solid #ff9500; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">Your OTP:</p>
              <h1 style="color: #ff9500; margin: 0; font-size: 40px; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin: 20px 0;">
              <strong>This OTP is valid for 10 minutes only.</strong>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request a password reset, please ignore this email or contact our support team.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              © 2026 ProductHub. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending OTP Email:", error);
    throw error;
  }
};

// expiration of OTP (2 minutes)
const storeOTP = (email, otp) => {
  const expirationTime = Date.now() + 2 * 60 * 1000;
  otpStore.set(email, {
    otp,
    expiresAt: expirationTime,
  });
};

// verify OTP
const verifyOTP = (email, otp) => {
  const stored = otpStore.get(email);

  if (!stored) {
    return {
      valid: false,
      message: "OTP not found. Please request a new OTP.",
    };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return {
      valid: false,
      message: "OTP has expired. Please request a new OTP.",
    };
  }

  if (stored.otp !== otp) {
    return {
      valid: false,
      message: "Invalid OTP. Please try again.",
    };
  }

  return {
    valid: true,
    message: "OTP verified successfully.",
  };
};

// clear OTP after verification
const clearOTP = (email) => {
  otpStore.delete(email);
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  storeOTP,
  verifyOTP,
  clearOTP,
};
