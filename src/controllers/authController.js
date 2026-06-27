const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateSignUpData = require("../utils/validate");
const redisClient = require("../config/redis");

const register = async (req, res) => {
  try {
    // Validate request data
    validateSignUpData(req.body);

    const { firstName, emailId, password } = req.body;
    //*jo koi bhi is path se ayega vo as a user hi register hoga
    req.body.role='user';
    // Check if user already exists
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        emailId: user.emailId,
        role:'user'
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      },
    );

    // Send response
    res.status(201).json({
      message: "User Registered Successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
      },
    });
  } catch (err) {
  console.error(err);

  res.status(400).json({
    message: err.message,
  });
}
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({
      emailId,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        emailId: user.emailId,
        role:user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


//logout
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(400).json({
        message: "No token found",
      });
    }

    const payload = jwt.decode(token);

    // Add token to Redis blocklist
    await redisClient.set(
      `token:${token}`,
      "blocked"
    );

    // Auto-delete when JWT expires
    await redisClient.expireAt(
      `token:${token}`,
      payload.exp
    );

    // Remove cookie
    res.clearCookie("token");

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const adminRegister=async(req,res)=>{
   try {
    // Validate request data
    validateSignUpData(req.body);

    const { firstName, emailId, password } = req.body;
    req.body.role='admin';
    // Check if user already exists
    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      firstName,
      emailId,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        emailId: user.emailId,
        role:'admin'
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // Send response
    res.status(201).json({
      message: "User Registered Successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        emailId: user.emailId,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  adminRegister,

};
