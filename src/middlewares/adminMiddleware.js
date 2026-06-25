const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");

const adminMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        message: "Token not present",
      });
    }

    // Check Redis blocklist
    const isBlocked = await redisClient.exists(`token:${token}`);

    if (isBlocked) {
      return res.status(401).json({
        message: "Token is blocked. Please login again.",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if(payload.role!='admin')
        throw new Error("Invalid Token")

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

    
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
};

module.exports = adminMiddleware;
