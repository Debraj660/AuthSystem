import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { login, logout, logoutAllDevices, refreshAccessToken, register } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login) ;
userRouter.post("/logout", isAuth, logout);
userRouter.post("/logoutAllDevices", isAuth, logoutAllDevices) ;
userRouter.post("/refresh", refreshAccessToken) ;

export default userRouter ;