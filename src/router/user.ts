import express from "express";
import userController from "controller/userController.js";

const user = express.Router();

user.get("/", userController.getCurrentUser);
user.get("/:name", userController.getCurrentUser2);
export default user;
