// src/routes/userAuth.js
const express = require('express');
const authRouter = express.Router();
const { 
  register, 
  login, 
  logout, 
  adminRegister, 
  deleteProfile 
} = require('../controllers/authController');
const userMiddleware = require("../middlewares/userMiddleware");
const adminMiddleware = require('../middlewares/adminMiddleware');

// Public routes (no auth)
authRouter.post('/register', register);
authRouter.post('/login', login);

// Protected routes (auth required)
authRouter.post('/logout', userMiddleware, logout);
authRouter.delete('/profile', userMiddleware, deleteProfile);

// Admin routes
authRouter.post('/admin/register', adminMiddleware, adminRegister);

// Check user (auth required)
authRouter.get('/check', userMiddleware, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
    role: req.result.role,
  };

  res.status(200).json({
    user: reply,
    message: "Valid User"
  });
});

module.exports = authRouter;