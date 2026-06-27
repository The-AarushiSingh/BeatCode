const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const userMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    // If no token, just continue as guest user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null; // Set user as null for guest access
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_KEY) {
      console.warn('⚠️ JWT_KEY not configured. Please set it in .env');
      req.user = null;
      return next();
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
    
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    // For protected routes, this will be caught by the route handler
    // For public routes, just continue as guest
    req.user = null;
    next();
  }
};


module.exports = userMiddleware;
