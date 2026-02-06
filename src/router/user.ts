import express from "express";
import userController from "controller/userController.js";
import friend from "./friend.js";
import chat from "./chat.js";

const user = express.Router();

user.get("/", userController.getCurrentUser);
// user.get("/:name", userController.getCurrentUser2);

user.use("/friend", friend);
user.use("/chat", chat);
export default user;
