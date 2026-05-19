const OAuth2Client = require("google-auth-library").OAuth2Client;
const signupModel = require("../models/signup.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateOTP,
  sendOTPEmail,
  storeOTP,
  verifyOTP: verifyOTPUtil,
  clearOTP,
} = require("../services/otp.service");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET;

// Google OAuth route
//  (post api)
async function googleLogin(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify token from Google
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: client._clientId,
      });
    } catch (tokenError) {
      console.error("Token verification failed:", tokenError.message);
      return res.status(401).json({
        message: "Invalid or expired token",
        error: tokenError.message,
      });
    }

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    const { sub, name, email } = payload;

    let user = await signupModel.findOne({
      $or: [{ email }, { googleId: sub }],
    });

    if (!user) {
      try {
        user = await signupModel.create({
          fullName: name,
          email,
          password: null, // No password for Google users
          googleId: sub,
        });
      } catch (dbError) {
        console.error("Database error creating new user:", dbError.message);
        return res.status(400).json({
          message: "Error creating user account",
          error: dbError.message,
        });
      }
    } else {
      // If account was deleted, reactivate it on re-register via Google
      if (user.deletedAccount) {
        user = await signupModel.findOneAndUpdate(
          { email },
          { deletedAccount: false, googleId: sub },
          { returnDocument: "after" },
        );
        // existing user - update their Google ID if not already set
      } else if (!user.googleId) {
        user = await signupModel.findOneAndUpdate(
          { email },
          { googleId: sub },
          { returnDocument: "after" },
        );
      }
    }

    // Block deleted accounts
    if (user.deletedAccount) {
      return res.status(403).json({
        message: "This account has been deleted. Please register again.",
      });
    }

    // JWT token
    const jwtToken = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "3h" },
    );

    res.cookie("authToken", jwtToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.json({
      message: "Google login successful!",
      token: jwtToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message || error);
    res.status(500).json({
      message: "Error logging in with Google",
      error: error.message,
    });
  }
}

// SIGNUP
// (post api)
async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body; //data sent from fronend to backend

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" }); //sent data back to frontend
    }

    const existingUser = await signupModel.findOne({ email });
    if (existingUser) {
      // If the account was previously deleted, reactivate it with new info
      if (existingUser.deletedAccount) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const reactivated = await signupModel.findOneAndUpdate(
          { email },
          {
            fullName,
            password: hashedPassword,
            deletedAccount: false,
            phone: null,
            gender: null,
          },
          { returnDocument: "after" },
        );

        const token = jwt.sign(
          {
            id: reactivated._id,
            fullName: reactivated.fullName,
            email: reactivated.email,
            role: reactivated.role || "user",
          },
          JWT_SECRET,
          { expiresIn: "3h" },
        );

        res.cookie("authToken", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 3 * 60 * 60 * 1000,
        });

        return res.status(201).json({
          message: "Account created successfully!",
          user: {
            id: reactivated._id,
            fullName: reactivated.fullName,
            email: reactivated.email,
            role: reactivated.role || "user",
          },
          token,
        });
      }
      return res
        .status(400)
        .json({ message: "This email is already registered. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await signupModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: createdUser._id,
        fullName: createdUser.fullName,
        email: createdUser.email,
        role: createdUser.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "3h" },
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: createdUser._id,
        fullName: createdUser.fullName,
        email: createdUser.email,
        role: createdUser.role || "user",
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating account" });
  }
}

// (get api)
async function getSignups(req, res) {
  try {
    const signups = await signupModel
      .find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Signup Data fetched successfully",
      signups,
    });
  } catch (error) {
    console.error("Error loading signup data:", error);
    res.status(500).json({ message: "Error loading signup data" });
  }
}

// (delete api)
async function deleteSignup(req, res) {
  const id = req.params.id;
  try {
    const deletedUser = await signupModel.findOneAndDelete({ _id: id });
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete signup error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
}

// LOGIN
// (post api)
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await signupModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "No account found with this email. Please signup first.",
      });
    }

    // Block deleted accounts
    if (user.deletedAccount) {
      return res.status(403).json({
        message:
          "This account has been deleted. Please register again to create a new account.",
      });
    }

    // Check if user only has Google login (no password set)
    if (!user.password) {
      return res.status(400).json({
        message:
          "This account was created with Google Sign-In. Please use Google to login.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Incorrect password or email. Please try again.",
      });
    }

    // login token creation
    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "3h" },
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in. Please try again." });
  }
}

// PROFILE
// (get api)
async function getProfile(req, res) {
  try {
    const userId = req.user.id; // comes from auth middleware (JWT)

    const user = await signupModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Error loading profile" });
  }
}

// (put api)
async function updateProfile(req, res) {
  try {
    const { fullName, phone, gender } = req.body;
    const userId = req.user.id;

    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({ message: "Full name cannot be empty" });
    }

    if (gender && !["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ message: "Invalid gender value" });
    }

    const updateData = {
      fullName: fullName.trim(),
      gender: req.body.gender,
      phone: phone && phone.trim() !== "" ? phone.trim() : null,
    };

    const updatedUser = await signupModel.findByIdAndUpdate(
      userId,
      updateData,
      {
        returnDocument: "after",
      },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        gender: updatedUser.gender,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
}

// DELETE ACCOUNT
// (delete api)
async function deleteAccount(req, res) {
  try {
    const userId = req.user.id;

    const user = await signupModel.findByIdAndUpdate(
      userId,
      { deletedAccount: true },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Error deleting account" });
  }
}

//route 4: PASSWORD RESET - OTP
async function sendOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await signupModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP to email
    await sendOTPEmail(email, otp);

    // Store OTP in memory (with expiration)
    storeOTP(email, otp);

    res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      message: "Error sending OTP. Please check your email address",
    });
  }
}

// Verify OTP
async function verifyOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Verify OTP
    const verification = verifyOTPUtil(email, otp);

    if (!verification.valid) {
      return res.status(400).json({ message: verification.message });
    }

    res.status(200).json({
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      message: "Error verifying OTP",
    });
  }
}

// Reset Password
async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    // Verify OTP one more time
    const verification = verifyOTPUtil(email, otp);
    if (!verification.valid) {
      return res.status(400).json({ message: verification.message });
    }

    // Find user and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await signupModel.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { returnDocument: "after" },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear OTP from store
    clearOTP(email);

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Error resetting password",
    });
  }
}

// Logout
async function logout(req, res) {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout successfully",
  });
}

// Check if user is authenticated (for frontend, when the page loads to confirm the user session is valid.)
async function checkAuth(req, res) {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "No token provided. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      authenticated: true,
      user: decoded,
      message: "User is authenticated.",
    });
  } catch (error) {
    console.error("Check auth error:", error);
    return res.status(401).json({
      authenticated: false,
      message: "Invalid or expired token",
    });
  }
}

module.exports = {
  googleLogin,
  signup,
  getSignups,
  deleteSignup,
  login,
  getProfile,
  updateProfile,
  deleteAccount,
  sendOTP,
  verifyOTP,
  resetPassword,
  logout,
  checkAuth,
};
