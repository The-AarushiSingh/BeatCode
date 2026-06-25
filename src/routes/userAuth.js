const express= require('express');
const userMiddleware = require('../middlewares/userMiddleware');
const userMiddleware=require('../middlewares/userMiddleware')
const adminMiddleware=require("../middlewares/adminMiddleware")
const authRouter=express.Router();
const {register, login, logout,adminRegister}=require("../controllers/authController")
authRouter.post("/register",register);

authRouter.post("/login",login);

authRouter.post("/logout",userMiddleware,logout);

authRouter.post("/admin/register",adminMiddleware,adminRegister);
//mai khud register kraungi isko