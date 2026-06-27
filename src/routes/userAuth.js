const express = require("express");

const authRouter = express.Router();

const userMiddleware = require("../middlewares/userMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  register,
  login,
  logout,
  adminRegister,
} = require("../controllers/authController");

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post("/logout", userMiddleware, logout);

authRouter.post("/admin/register", adminMiddleware, adminRegister);

module.exports = authRouter;