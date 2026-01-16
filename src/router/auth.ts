import express from "express";
import authController from "controller/authController.js";
const auth = express.Router();
auth.post("/register", authController.register);
auth.post("/login", authController.login);
auth.post("/validate", authController.validate);
auth.post("/refresh", authController.tokenUpdateByRefreshToken);

auth.get("/logout", authController.logout);
auth.post("/forgot-password", authController.forgotPassword);
auth.post("/reset-password/:token", authController.resetPassword);
auth.post("/password", authController.password);
export default auth;
