// src/middlewares/userMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_KEY || process.env.JWT_SECRET || 'fallback-secret-key';

const userMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookies or header
    let token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login to access this resource'
      });
    }

    if (!JWT_SECRET || JWT_SECRET === 'fallback-secret-key') {
      console.warn('⚠️ JWT_SECRET not properly configured');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    req.user = {
      userId: user._id,
      emailId: user.emailId,
      role: user.role,
      firstName: user.firstName
    };
    req.result = user;

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