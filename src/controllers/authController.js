// src/controllers/authController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Make sure JWT_KEY is available
const JWT_SECRET = process.env.JWT_KEY || process.env.JWT_SECRET || 'fallback-secret-key';

// Register User
const register = async (req, res) => {
  try {
    const { firstName, emailId, password } = req.body;

    if (!firstName || !emailId || !password) {
      return res.status(400).json({
        message: "Missing required fields",
        required: ["firstName", "emailId", "password"]
      });
    }

    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
      role: "user"
    });

    const token = jwt.sign(
      {
        userId: user._id,
        emailId: user.emailId,
        role: user.role
      },
      JWT_SECRET,  // Use the variable
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({
      message: err.message,
    });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        emailId: user.emailId,
        role: user.role,
      },
      JWT_SECRET,  // Use the variable
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        firstName: user.firstName,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
      },
      token,
      message: "Login Successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// Admin Register
const adminRegister = async (req, res) => {
  try {
    const { firstName, emailId, password } = req.body;

    if (!firstName || !emailId || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
      role: "admin",
    });

    const token = jwt.sign(
      {
        userId: user._id,
        emailId: user.emailId,
        role: "admin",
      },
      JWT_SECRET,  // Use the variable
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Admin Registered Successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(400).json({
      message: err.message,
    });
  }
};

// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie("token");

    res.status(200).json({
      message: "Profile deleted successfully"
    });

  } catch (err) {
    console.error("Delete profile error:", err);
    res.status(500).json({
      message: err.message
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
};