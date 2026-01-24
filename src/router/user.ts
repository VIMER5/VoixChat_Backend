import express from "express";
import userController from "controller/userController.js";
import friend from "./friend.js";

const user = express.Router();

user.get("/", userController.getCurrentUser);
// user.get("/:name", userController.getCurrentUser2);

user.use("/friend", friend);
export default user;
