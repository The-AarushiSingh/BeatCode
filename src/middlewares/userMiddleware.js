// src/middlewares/userMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userMiddleware = async (req, res, next) => {
  try {
    // Get token from cookie or header
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }

    if (!process.env.JWT_KEY) {
      console.error('JWT_KEY not configured');
      return res.status(500).json({
        error: 'Server configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    // ✅ FIX: Set both req.user and req.result for compatibility
    req.user = {
      userId: user._id,
      emailId: user.emailId,
      role: user.role,
      firstName: user.firstName
    };
    req.result = user; // For backward compatibility

    next();

  } catch (error) {
    console.error('User auth error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please login again'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Session expired',
        message: 'Please login again'
      });
    }
    
    res.status(401).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
};

module.exports = userMiddleware;